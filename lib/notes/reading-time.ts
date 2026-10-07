import { plainTextFromDoc } from "./content";
import type { JournalDoc } from "./types";

const WORDS_PER_MINUTE = 200;

/** Rough "N min read" estimate, shown only in the admin dashboard/editor. */
export function estimateReadingTime(doc: JournalDoc): number {
  const words = plainTextFromDoc(doc).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
