import { EMPTY_DOC, type DocNode, type JournalDoc } from "./types";

/** Converts the legacy `data/notes.ts` shape (array of plain paragraphs)
 * into a Tiptap/ProseMirror doc, for the one-off migration script. */
export function docFromParagraphs(paragraphs: string[]): JournalDoc {
  return {
    type: "doc",
    content: paragraphs
      .filter((p) => p.trim().length > 0)
      .map((p) => ({
        type: "paragraph",
        content: [{ type: "text", text: p }],
      })),
  };
}

/** Defensive parse for content coming back from the database — falls back
 * to an empty doc rather than letting a malformed row crash a page. */
export function parseJournalDoc(value: unknown): JournalDoc {
  if (
    value &&
    typeof value === "object" &&
    (value as { type?: unknown }).type === "doc" &&
    Array.isArray((value as { content?: unknown }).content)
  ) {
    return value as JournalDoc;
  }
  return EMPTY_DOC;
}

function collectText(node: DocNode, into: string[]) {
  if (typeof node.text === "string") {
    into.push(node.text);
    return;
  }
  node.content?.forEach((child) => collectText(child, into));
}

/** Flattens a doc to plain text — used for the admin's reading-time estimate
 * and as a fallback meta description when one hasn't been written. */
export function plainTextFromDoc(doc: JournalDoc): string {
  const parts: string[] = [];
  doc.content.forEach((node) => collectText(node, parts));
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function isDocEmpty(doc: JournalDoc): boolean {
  return plainTextFromDoc(doc).length === 0;
}

/** Every image `src` in a doc, in order — used to find which uploaded files a
 * post owns when it's deleted. */
export function collectImageSrcs(doc: JournalDoc): string[] {
  const srcs: string[] = [];
  const walk = (node: DocNode) => {
    if (node.type === "image" && typeof node.attrs?.src === "string") srcs.push(node.attrs.src);
    node.content?.forEach(walk);
  };
  doc.content.forEach(walk);
  return srcs;
}
