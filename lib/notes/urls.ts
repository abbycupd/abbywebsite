// Public note URLs. This site is a static export on GitHub Pages, so there
// are two kinds of note page:
//
//   /notes/<slug>            A real pre-built HTML page, generated for every
//                            post that was published at the last build
//                            (app/notes/[slug]). Clean URL, proper SEO tags.
//
//   /notes/view?slug=<slug>  One static viewer page (app/notes/view) that
//                            loads any published post from Supabase in the
//                            browser. Works for posts published since the last
//                            build, with no rebuild, in `npm run dev` and in
//                            production alike.
//
// Both always re-check Supabase on load, so an unpublished or deleted post
// disappears from either immediately. See README → "How this works on a
// static, server-less host".

export const NOTE_VIEWER_PATH = "/notes/view";

/** Slugs a post can't use, because a static route already lives there. */
export const RESERVED_NOTE_SLUGS: ReadonlySet<string> = new Set(["view"]);

export function noteViewerHref(slug: string): string {
  return `${NOTE_VIEWER_PATH}?slug=${encodeURIComponent(slug)}`;
}

/** Link to a note: the clean URL if that page was pre-built in this
 * deployment, otherwise the live viewer. */
export function noteHref(slug: string, prerenderedSlugs: readonly string[]): string {
  return prerenderedSlugs.includes(slug) ? `/notes/${slug}` : noteViewerHref(slug);
}

/** Which of these posts have a pre-built /notes/<slug> page. Call this from
 * a build-time (server) render with the same published-posts fetch that
 * generateStaticParams uses.
 *
 * In `next dev` nothing is pre-built: Next renders /notes/[slug] on demand
 * and, because of `output: "export"`, throws a "missing param in
 * generateStaticParams()" error for any slug that function didn't return
 * when it last ran. So in dev every link goes through the viewer, which has
 * no such restriction. */
export function prerenderedSlugsFor(posts: { slug: string }[]): string[] {
  return process.env.NODE_ENV === "production" ? posts.map((p) => p.slug) : [];
}
