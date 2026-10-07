"use client";

import { useSearchParams } from "next/navigation";
import { PublicNoteDetail } from "@/components/public-note-detail";

/** Reads ?slug= and renders that published note, fetched live from Supabase.
 * Drafts never load here: the query asks for status = 'published' only, and
 * RLS refuses drafts to anyone but the admin regardless. */
export function NoteViewer() {
  const slug = useSearchParams().get("slug") ?? "";
  return <PublicNoteDetail key={slug} slug={slug} initialPost={null} />;
}
