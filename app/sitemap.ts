import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { fetchPublishedPosts } from "@/lib/notes/queries";

// Static export: render once at build time, with fresh Supabase data (see
// the no-store note in lib/supabase/client.ts).
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/notes"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));

  const notes = await fetchPublishedPosts();
  const noteRoutes = notes.map((note) => ({
    url: `${site.url}/notes/${note.slug}`,
    lastModified: note.updated_at,
  }));

  return [...staticRoutes, ...noteRoutes];
}
