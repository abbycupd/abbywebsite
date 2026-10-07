import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PublicNoteDetail } from "@/components/public-note-detail";
import { fetchPublishedPostBySlug, fetchPublishedPosts } from "@/lib/notes/queries";

// Static export: render once at build time, with fresh Supabase data (see
// the no-store note in lib/supabase/client.ts).
export const dynamic = "force-static";

// Static export can only pre-render paths known at build time. We fetch
// whatever is published right now so those posts get a real, fast,
// SEO-friendly static page at their clean URL. Posts published after the
// build don't have one here — the site links them to the live viewer at
// /notes/view?slug=… instead (see lib/notes/urls.ts), and a typed-in clean
// URL for one is forwarded there by app/not-found.tsx. See README.
//
// `output: "export"` fails the build if this ever returns an empty array
// (a quirk of Next 14's static export, not a design choice) — e.g. right
// after creating a fresh Supabase project, before anything's published
// yet. The placeholder keeps the build green in that case; nobody will
// ever link to /notes/__placeholder__, and it resolves to the normal
// "not found" state like any other unknown slug.
export async function generateStaticParams() {
  const posts = await fetchPublishedPosts();
  if (posts.length === 0) return [{ slug: "__placeholder__" }];
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchPublishedPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.meta_description || post.excerpt,
    alternates: { canonical: `/notes/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt,
      type: "article",
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function NotePage({ params }: { params: { slug: string } }) {
  const post = await fetchPublishedPostBySlug(params.slug);

  return (
    <>
      <SiteNav />
      <main id="main" className="container-page py-16">
        <PublicNoteDetail slug={params.slug} initialPost={post} />
      </main>
      <SiteFooter />
    </>
  );
}
