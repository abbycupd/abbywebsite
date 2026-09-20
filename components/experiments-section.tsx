import { experiments } from "@/data/projects";

export function ExperimentsSection() {
  return (
    <section id="experiments" className="container-page py-20 sm:py-28">
      <p className="label mb-2">extras</p>
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Off the menu
      </h2>
      <p className="mt-3 max-w-prose text-[15px] text-graphite">
        Smaller things — university work, prototypes, tools I built for myself — that don&rsquo;t need
        a full case study.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {experiments.map((item) => {
          const inner = (
            <>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold tracking-tight">{item.name}</h3>
                <span className="label shrink-0">{item.year}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span key={t} className="label rounded-full border border-mist px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            </>
          );

          return item.href ? (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-dashed border-mist p-5 transition-colors hover:border-ink/30"
            >
              {inner}
            </a>
          ) : (
            <div key={item.name} className="rounded-xl border border-dashed border-mist p-5">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
