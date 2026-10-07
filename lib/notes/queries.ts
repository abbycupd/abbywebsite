import { getSupabaseClient } from "@/lib/supabase/client";
import { parseJournalDoc } from "./content";
import type { JournalPost } from "./types";

const SELECT_COLUMNS =
  "id, title, slug, excerpt, content, cover_image, tags, meta_description, status, published_at, created_at, updated_at";

type Row = Record<string, unknown>;

function mapRow(row: Row): JournalPost {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    excerpt: String(row.excerpt ?? ""),
    content: parseJournalDoc(row.content),
    cover_image: (row.cover_image as string | null) ?? null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    meta_description: (row.meta_description as string | null) ?? null,
    status: row.status === "published" ? "published" : "draft",
    published_at: (row.published_at as string | null) ?? null,
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

/**
 * Published posts, newest first. Used by both the build-time (SSG) fetch in
 * app/notes/page.tsx and the client-side refresh that keeps the list live
 * without a rebuild. Safe to call with no Supabase session — RLS exposes
 * published posts to anonymous visitors.
 */
export async function fetchPublishedPosts(): Promise<JournalPost[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("journal_posts")
    .select(SELECT_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("fetchPublishedPosts failed:", error.message);
    return [];
  }
  return (data as Row[]).map(mapRow);
}

/**
 * A single published post by slug, or null if it doesn't exist / isn't
 * published / Supabase isn't reachable. Never throws — callers render a
 * "not found" state on null.
 */
export async function fetchPublishedPostBySlug(slug: string): Promise<JournalPost | null> {
  const supabase = getSupabaseClient();
  if (!supabase || !slug) return null;

  const { data, error } = await supabase
    .from("journal_posts")
    .select(SELECT_COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("fetchPublishedPostBySlug failed:", error.message);
    return null;
  }
  return data ? mapRow(data as Row) : null;
}

export function mapJournalRow(row: Row): JournalPost {
  return mapRow(row);
}

export const JOURNAL_SELECT_COLUMNS = SELECT_COLUMNS;
