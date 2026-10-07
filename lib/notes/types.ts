// Shared types for the journal/notes CMS. The on-disk shape in Postgres
// (see supabase/journal.sql) is the source of truth — these mirror it.

export type PostStatus = "draft" | "published";

/** A ProseMirror/Tiptap mark, e.g. { type: "bold" } or { type: "link", attrs: { href } }. */
export type DocMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

/** A ProseMirror/Tiptap node. Content is stored as this JSON tree, never as raw HTML. */
export type DocNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: DocNode[];
  text?: string;
  marks?: DocMark[];
};

export type JournalDoc = {
  type: "doc";
  content: DocNode[];
};

export const EMPTY_DOC: JournalDoc = { type: "doc", content: [] };

/** One row of public.journal_posts. */
export type JournalPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: JournalDoc;
  cover_image: string | null;
  tags: string[];
  meta_description: string | null;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Fields the editor can set when creating/updating a post. */
export type JournalPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: JournalDoc;
  cover_image: string | null;
  tags: string[];
  meta_description: string | null;
};
