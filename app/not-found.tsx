import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
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
