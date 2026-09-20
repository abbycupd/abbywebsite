import Link from "next/link";
import { CommandPalette } from "@/components/command-palette";

export function SiteNav() {
  return (
    <header className="container-page flex items-center justify-between py-6">
      <Link href="/" className="font-display text-[15px] font-semibold tracking-tight">
        Abby Brennan
      </Link>
      <nav className="flex items-center gap-4">
        <a href="/#projects" className="label hidden hover:text-ink sm:inline">
          work
        </a>
        <a href="/notes" className="label hidden hover:text-ink sm:inline">
          notes
        </a>
        <a href="/#contact" className="label hidden hover:text-ink sm:inline">
          contact
        </a>
        <CommandPalette />
      </nav>
    </header>
  );
}
