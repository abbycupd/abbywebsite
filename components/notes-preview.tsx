import { NotesPreviewSection } from "@/components/notes-preview-section";
import { fetchPublishedPosts } from "@/lib/notes/queries";
import { prerenderedSlugsFor } from "@/lib/notes/urls";

export async function NotesPreview() {
  const notes = await fetchPublishedPosts();
  return <NotesPreviewSection initialNotes={notes} prerenderedSlugs={prerenderedSlugsFor(notes)} />;
}
