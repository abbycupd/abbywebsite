import { NowPlaying } from "@/components/now-playing";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="container-page border-t border-mist py-8 text-graphite">
      <div className="mb-5">
        <NowPlaying />
      </div>
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="label">built by abby, obviously.</p>
        <p className="label">
          © {year} Abby Brennan ·{" "}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            source
          </a>
        </p>
      </div>
    </footer>
  );
}
