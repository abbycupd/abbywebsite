"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { NoteArticleView } from "@/components/note-article-view";
import { fetchPostById } from "@/lib/notes/admin-queries";
import { toFriendlyError } from "@/lib/notes/errors";
import type { JournalPost } from "@/lib/notes/types";

// Admin-only preview, using the real public article styling. Requires an
// authenticated admin session (AdminGuard) to even reach the fetch below,
// and that fetch is additionally enforced by RLS — so a guessed/shared
// preview link never exposes a draft to anyone else. See
// supabase/journal.sql's "Admin can read all posts" policy.
function PreviewRoute() {
  const id = useSearchParams().get("id");
  const [post, setPost] = useState<JournalPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("No post specified.");
      setLoading(false);
      return;
    }
    fetchPostById(id)
      .then((result) => {
        if (!result) setError("This post doesn't exist, or may have been deleted.");
        setPost(result);
      })
      .catch((err) => setError(toFriendlyError(err, "Couldn't load preview")))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminGuard>
      <main id="main" className="container-page py-16">
        <Link href="/admin" className="label mb-10 inline-flex items-center gap-1.5 text-graphite hover:text-ink">
          <ArrowLeft size={13} /> back to admin
        </Link>

        {loading && <p className="label">loading…</p>}
        {error && <p className="label text-roast">{error}</p>}
        {post && <NoteArticleView post={post} draftBanner={post.status === "draft"} />}
      </main>
    </AdminGuard>
  );
}

export default function AdminPreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewRoute />
    </Suspense>
  );
}
