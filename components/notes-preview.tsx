import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notes } from "@/data/notes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NotesPreview() {
  const recent = notes.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <section id="notes" className="container-page py-20 sm:py-28">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="label mb-2">from my notes app</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Things I&rsquo;m thinking about
          </h2>
        </div>
        <Link href="/notes" className="label hidden items-center gap-1 hover:text-ink sm:flex">
          all notes
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="divide-y divide-mist border-y border-mist">
        {recent.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8"
          >
            <span className="label w-28 shrink-0">{formatDate(note.date)}</span>
            <span className="flex-1">
              <h3 className="font-display text-lg font-medium tracking-tight transition-colors group-hover:text-roast">
                {note.title}
              </h3>
              <p className="mt-1 max-w-prose text-sm text-graphite">{note.excerpt}</p>
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/notes"
        className="label mt-6 inline-flex items-center gap-1 hover:text-ink sm:hidden"
      >
        all notes
        <ArrowUpRight size={13} />
      </Link>
    </section>
  );
}
