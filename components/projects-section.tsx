"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { projects, type Project } from "@/data/projects";

function ScreenshotPlaceholder({ project }: { project: Project }) {
  return (
    <div
      className="flex aspect-[16/10] w-full items-center justify-center rounded-lg border border-dashed border-mist bg-cream"
      role="img"
      aria-label={`Placeholder — add a screenshot of ${project.name} here`}
    >
      <span className="label text-center text-graphite">
        add a screenshot
        <br />
        /public/projects/{project.slug}/
      </span>
    </div>
  );
}

function ScreenshotGallery({ project }: { project: Project }) {
  if (project.screenshots.length === 0) {
    return <ScreenshotPlaceholder project={project} />;
  }

  return (
    <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
      {project.screenshots.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`${project.name} screenshot`}
          className="h-72 w-auto shrink-0 snap-center rounded-lg border border-mist object-cover sm:h-80"
        />
      ))}
    </div>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.button
      layoutId={`card-${project.slug}`}
      onClick={onOpen}
      className="group flex flex-col items-start rounded-xl border border-mist bg-paper p-6 text-left transition-colors hover:border-ink/25 sm:p-7"
    >
      <div className="flex w-full items-start justify-between gap-4">
        <motion.h3
          layoutId={`title-${project.slug}`}
          className="font-display text-2xl font-semibold tracking-tight"
        >
          {project.name}
        </motion.h3>
        <ArrowUpRight
          size={18}
          className="mt-1 shrink-0 text-graphite transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
        />
      </div>
      <p className="label mt-1">{project.tagline}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-graphite">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 3).map((t) => (
          <span key={t} className="label rounded-full border border-mist px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>
      <p className="label mt-5 text-roast">{project.status}</p>
    </motion.button>
  );
}

function ExpandedProject({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto">
      <motion.div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />
      <div className="relative flex min-h-full items-start justify-center px-4 py-10 sm:py-16">
        <motion.div
          layoutId={`card-${project.slug}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} case study`}
          className="relative w-full max-w-2xl rounded-xl border border-mist bg-paper p-7 shadow-2xl sm:p-10"
        >
          <button
            onClick={onClose}
            aria-label="Close case study"
            className="absolute right-5 top-5 rounded-full border border-mist bg-cream p-2 text-graphite hover:text-ink"
          >
            <X size={16} />
          </button>

          <motion.h3
            layoutId={`title-${project.slug}`}
            className="pr-10 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {project.name}
          </motion.h3>
          <p className="label mt-1">{project.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="label rounded-full bg-cream px-2.5 py-1 text-roast">
              {project.status}
            </span>
            <span className="label">{project.year}</span>
          </div>

          <div className="mt-7">
            <ScreenshotGallery project={project} />
          </div>

          <div className="mt-8 space-y-4">
            {project.story.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-graphite">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <p className="label mb-2">built with</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="label rounded-full border border-mist px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {project.links.filter((l) => l.href).length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links
                .filter((l) => l.href)
                .map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label inline-flex items-center gap-1.5 rounded-full border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-cream"
                  >
                    {l.label}
                    <ArrowUpRight size={13} />
                  </a>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const featured = projects.filter((p) => p.featured);
  const openProject = featured.find((p) => p.slug === openSlug) ?? null;

  useEffect(() => {
    if (!openProject) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlug(null);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [openProject]);

  return (
    <section id="projects" className="container-page py-20 sm:py-28">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="label mb-2">selected work</p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Things I&rsquo;m building
          </h2>
        </div>
      </div>

      <div id="cupd" className="grid gap-5 sm:grid-cols-2">
        {featured.map((project) => (
          <div key={project.slug} className={project.slug === "cupd" ? "sm:col-span-2" : ""}>
            <ProjectCard project={project} onOpen={() => setOpenSlug(project.slug)} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openProject && (
          <ExpandedProject key={openProject.slug} project={openProject} onClose={() => setOpenSlug(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}