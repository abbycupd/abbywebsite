"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { noteViewerHref } from "@/lib/notes/urls";

const NOTE_PATH = /^\/notes\/([^/]+)\/?$/;

// GitHub Pages serves this file for any URL that doesn't exist as a static
// file. /notes/<slug> only exists as a file for posts that were published at
// the last build (see app/notes/[slug]), so a clean URL for anything newer
// lands here — e.g. someone typing it, or an old share link to a post whose
// slug has since been rebuilt away. We forward those to the live viewer
// (/notes/view?slug=…, see lib/notes/urls.ts), which shows the post if it's
// published and a "not found" message if it isn't.
//
// Deliberately reading `window.location.pathname` directly (not
// next/navigation's usePathname) — this file is reached via a hard page load
// of a static 404.html with no server behind it, and window.location is the
// one source that is unambiguously the real address bar in that case.
export default function NotFound() {
  const router = useRouter();
  const [pathname, setPathname] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const noteSlug = pathname?.match(NOTE_PATH)?.[1];

  useEffect(() => {
    if (!noteSlug) return;
    let slug = noteSlug;
    try {
      slug = decodeURIComponent(noteSlug);
    } catch {
      // Malformed escape — pass it through as-is; the viewer will say "not found".
    }
    router.replace(noteViewerHref(slug));
  }, [noteSlug, router]);

  if (noteSlug) return null;

  // Before the pathname check above resolves (first render, pre-hydration
  // or pathname still null), render nothing rather than briefly flashing
  // the generic 404 message for what might turn out to be a real note.
  if (pathname === null) return null;

  return (
    <>
      <SiteNav />
      <main id="main" className="container-page flex min-h-[60vh] flex-col justify-center py-16">
        <p className="label mb-4">404</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Nothing brewing here.
        </h1>
        <p className="mt-4 max-w-prose text-graphite">
          Whatever you were looking for isn&rsquo;t at this address. It might have moved, or it might
          never have existed — a bit like most of my side projects before week two.
        </p>
        <Link
          href="/"
          className="label mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          back to the homepage
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
