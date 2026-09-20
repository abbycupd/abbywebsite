import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { notes } from "@/data/notes";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const note = notes.find((n) => n.slug === params.slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: {
      title: note.title,
      description: note.excerpt,
      type: "article",
      publishedTime: note.date,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NotePage({ params }: { params: { slug: string } }) {
  const note = notes.find((n) => n.slug === params.slug);
  if (!note) notFound();

  return (
    <>
      <SiteNav />
      <main id="main" className="container-page py-16">
        <Link
          href="/notes"
          className="label mb-10 inline-flex items-center gap-1.5 text-graphite hover:text-ink"
        >
          <ArrowLeft size={13} />
          all notes
        </Link>

        <article className="max-w-prose">
          <p className="label mb-3">{formatDate(note.date)}</p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {note.title}
          </h1>

          <div className="mt-8 space-y-5">
            {note.body.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-graphite sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-1.5">
            {note.tags.map((t) => (
              <span key={t} className="label rounded-full border border-mist px-2.5 py-1">
                {t}
              </span>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
