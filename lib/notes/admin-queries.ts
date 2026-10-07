import { getSupabaseClient } from "@/lib/supabase/client";
import { mapJournalRow, JOURNAL_SELECT_COLUMNS } from "./queries";
import { collectImageSrcs, parseJournalDoc } from "./content";
import { RESERVED_NOTE_SLUGS } from "./urls";
import type { JournalPost, JournalPostInput } from "./types";

const BUCKET = "journal-images";

function requireClient() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase isn't configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  }
  return supabase;
}

/** Every post, drafts and published, newest-edited first. RLS only allows
 * this for the authenticated admin — anonymous callers get an empty array. */
export async function fetchAllPostsForAdmin(): Promise<JournalPost[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select(JOURNAL_SELECT_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapJournalRow);
}

/** A single post by id, regardless of status — used by the editor and the
 * admin-only draft preview screen. */
export async function fetchPostById(id: string): Promise<JournalPost | null> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .select(JOURNAL_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapJournalRow(data) : null;
}

/** True if another post already uses this slug, or it's reserved for one of
 * the site's own /notes/… routes (e.g. the /notes/view live viewer). */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  if (RESERVED_NOTE_SLUGS.has(slug)) return true;
  const supabase = requireClient();
  let query = supabase.from("journal_posts").select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).length > 0;
}

export async function createDraft(input: JournalPostInput): Promise<JournalPost> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .insert({ ...input, status: "draft" })
    .select(JOURNAL_SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapJournalRow(data);
}

/** Updates post content without touching status/published_at — this is
 * what autosave and the "Save" button call, for both drafts and already-
 * published posts, so status can never change by accident. */
export async function updatePostContent(id: string, input: JournalPostInput): Promise<JournalPost> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .update(input)
    .eq("id", id)
    .select(JOURNAL_SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapJournalRow(data);
}

/** Publishes a post. Sets published_at only the first time (keeps the
 * original publish date across unpublish/republish cycles). */
export async function publishPost(id: string): Promise<JournalPost> {
  const supabase = requireClient();
  const existing = await fetchPostById(id);
  const patch: Record<string, unknown> = { status: "published" };
  if (!existing?.published_at) {
    patch.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("journal_posts")
    .update(patch)
    .eq("id", id)
    .select(JOURNAL_SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapJournalRow(data);
}

export async function unpublishPost(id: string): Promise<JournalPost> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .update({ status: "draft" })
    .eq("id", id)
    .select(JOURNAL_SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return mapJournalRow(data);
}

/** Permanently deletes a post, then removes any of its uploaded images that
 * no other post still uses. `extraImageUrls` lets the editor include images
 * uploaded since the last save, which aren't on the stored row yet.
 *
 * RLS doesn't raise an error when it blocks a delete — it just matches zero
 * rows — so we ask for the deleted row back and treat "nothing deleted" as a
 * failure rather than a silent success. */
export async function deletePost(id: string, extraImageUrls: string[] = []): Promise<void> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .delete()
    .eq("id", id)
    .select(JOURNAL_SELECT_COLUMNS);

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("nothing was deleted. The post may already be gone, or you're not signed in as the admin.");
  }

  const deleted = mapJournalRow(data[0]);
  const candidates = [deleted.cover_image, ...collectImageSrcs(deleted.content), ...extraImageUrls];

  // The row is already gone, so a storage hiccup here shouldn't surface as a
  // failed delete — worst case an unused image is left behind in the bucket.
  try {
    await removeUnusedImages(candidates);
  } catch (err) {
    console.warn("Post deleted, but its images couldn't be cleaned up:", err);
  }
}

/** Removes the given journal-images URLs from storage, skipping anything
 * outside our bucket and anything still referenced by a remaining post. */
async function removeUnusedImages(urls: (string | null)[]): Promise<void> {
  const supabase = requireClient();
  const bucketPrefix = supabase.storage.from(BUCKET).getPublicUrl("").data.publicUrl.replace(/\/?$/, "/");

  const owned = Array.from(new Set(urls.filter((u): u is string => Boolean(u?.startsWith(bucketPrefix)))));
  if (owned.length === 0) return;

  const { data: others, error } = await supabase.from("journal_posts").select("cover_image, content");
  if (error) throw error;

  const stillUsed = new Set<string>();
  for (const row of others ?? []) {
    if (row.cover_image) stillUsed.add(row.cover_image);
    collectImageSrcs(parseJournalDoc(row.content)).forEach((src) => stillUsed.add(src));
  }

  const paths = owned
    .filter((url) => !stillUsed.has(url))
    .map((url) => decodeURIComponent(url.slice(bucketPrefix.length).split(/[?#]/)[0]))
    .filter(Boolean);
  if (paths.length === 0) return;

  const { error: removeError } = await supabase.storage.from(BUCKET).remove(paths);
  if (removeError) throw removeError;
}

/** Uploads an image (cover or inline) to the journal-images bucket and
 * returns its public URL. `folder` keeps covers and inline images tidy. */
export async function uploadJournalImage(file: File, folder: "covers" | "inline"): Promise<string> {
  const supabase = requireClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
