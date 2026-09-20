import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { notes } from "@/data/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/notes"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));

  const noteRoutes = notes.map((note) => ({
    url: `${site.url}/notes/${note.slug}`,
    lastModified: note.date,
  }));

  return [...staticRoutes, ...noteRoutes];
}
