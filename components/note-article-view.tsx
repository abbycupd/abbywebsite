import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RenderDoc } from "@/components/notes/render-doc";
import type { JournalPost } from "@/lib/notes/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** The public article layout — identical markup/classes to the site's
 * original static note page. Shared by the pre-built /notes/[slug] pages,
 * the live /notes/view?slug= viewer (for posts published after the last
 * deploy), and the admin's draft preview. */
export function NoteArticleView({ post, draftBanner }: { post: JournalPost; draftBanner?: boolean }) {
  return (
    <>
      <Link href="/notes" className="label mb-10 inline-flex items-center gap-1.5 text-graphite hover:text-ink">
        <ArrowLeft size={13} />
        all notes
      </Link>

      {draftBanner && (
        <p className="label mb-6 inline-flex items-center gap-2 rounded-full border border-roast/40 bg-roast/5 px-3 py-1.5 text-roast">
          draft preview — not public
        </p>
      )}

      <article className="max-w-prose">
        <p className="label mb-3">{formatDate(post.published_at ?? post.created_at)}</p>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt=""
            className="mt-6 w-full rounded-md border border-mist object-cover"
          />
        )}

        <div className="mt-8 space-y-5">
          <RenderDoc doc={post.content} />
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="label rounded-full border border-mist px-2.5 py-1">
                {t}
              </span>
            ))}
          </div>
        )}
      </article>
    </>
  );
}
