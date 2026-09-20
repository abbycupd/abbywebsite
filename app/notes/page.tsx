import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { NotesList } from "@/components/notes-list";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short writing on building products, software, and everything in between.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="container-page py-16">
        <p className="label mb-2">from my notes app</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Notes</h1>
        <p className="mt-4 max-w-prose text-graphite">
          Short, occasional writing about building Cupd, StudyNI, and whatever else I&rsquo;m working
          through.
        </p>

        <NotesList />
      </main>
      <SiteFooter />
    </>
  );
}
