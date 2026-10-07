import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { NoteViewer } from "@/components/note-viewer";

// One static page that can show any published note, chosen by ?slug=. It
// exists because /notes/[slug] can only have HTML for slugs known at build
// time (output: "export"), while posts are published live from the admin.
// See lib/notes/urls.ts for when each URL is used.
//
// The per-post <title> is set in the browser once the post loads (see
// PublicNoteDetail). No canonical here: one static file serves every slug,
// so it can't name the right one, and inheriting the homepage's would be wrong.
export const metadata: Metadata = {
  title: "Notes",
  alternates: { canonical: null },
};

export default function NoteViewerPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="container-page py-16">
        <Suspense fallback={<p className="label">loading…</p>}>
          <NoteViewer />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
