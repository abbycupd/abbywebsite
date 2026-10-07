"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NoteArticleView } from "@/components/note-article-view";
import { site } from "@/data/site";
import { fetchPublishedPostBySlug } from "@/lib/notes/queries";
import type { JournalPost } from "@/lib/notes/types";

/**
 * Fetches a single published post by slug and renders it with the public
 * article styling. Used both by the statically-generated /notes/[slug] page
 * (seeded with `initialPost` from the build-time fetch, for posts that
 * existed at the last deploy) and by the live viewer at /notes/view?slug=
 * (for anything published since — see lib/notes/urls.ts), which passes no
 * initialPost and relies entirely on this client-side fetch. Either way,
 * this always re-fetches on mount so drafts/unpublished/deleted posts never
 * stay visible just because they were baked into an older build.
 */
export function PublicNoteDetail({ slug, initialPost }: { slug: string; initialPost: JournalPost | null }) {
  const [post, setPost] = useState<JournalPost | null>(initialPost);
  const [checked, setChecked] = useState(Boolean(initialPost));

  useEffect(() => {
    let cancelled = false;
    fetchPublishedPostBySlug(slug).then((fresh) => {
      if (!cancelled) {
        setPost(fresh);
        setChecked(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Pre-built pages already have the right <title>; the live viewer and the
  // 404 fallback are one static file for every post, so set it here.
  useEffect(() => {
    if (post) document.title = site.titleTemplate.replace("%s", post.title);
  }, [post]);

  if (!checked) {
    return <p className="label">loading…</p>;
  }

  if (!post) {
    return (
      <div className="max-w-prose">
        <p className="label mb-4">not found</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          This note isn&rsquo;t here.
        </h1>
        <p className="mt-4 text-graphite">
          It might have been unpublished, or the link might be wrong.
        </p>
        <Link
          href="/notes"
          className="label mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          back to all notes
        </Link>
      </div>
    );
  }

  return <NoteArticleView post={post} />;
}
