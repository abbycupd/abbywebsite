"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notes } from "@/data/notes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NotesList() {
  const [active, setActive] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const visible = active ? notes.filter((n) => n.tags.includes(active)) : notes;

  return (
    <div>
      {categories.length > 1 && (
        <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter notes by category">
          <button
            onClick={() => setActive(null)}
            aria-pressed={active === null}
            className={`label rounded-full border px-3 py-1.5 transition-colors ${
              active === null
                ? "border-ink bg-ink text-cream"
                : "border-mist text-graphite hover:border-ink/30 hover:text-ink"
            }`}
          >
            all
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`label rounded-full border px-3 py-1.5 transition-colors ${
                active === cat
                  ? "border-ink bg-ink text-cream"
                  : "border-mist text-graphite hover:border-ink/30 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 divide-y divide-mist border-y border-mist">
        {visible.map((note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8"
          >
            <span className="label w-28 shrink-0">{formatDate(note.date)}</span>
            <span className="flex-1">
              <h2 className="font-display text-lg font-medium tracking-tight transition-colors group-hover:text-roast">
                {note.title}
              </h2>
              <p className="mt-1 max-w-prose text-sm text-graphite">{note.excerpt}</p>
            </span>
          </Link>
        ))}
        {visible.length === 0 && (
          <p className="py-10 text-sm text-graphite">Nothing tagged &ldquo;{active}&rdquo; yet.</p>
        )}
      </div>
    </div>
  );
}
