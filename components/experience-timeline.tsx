import { experience } from "@/data/experience";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="container-page py-20 sm:py-28">
      <p className="label mb-10">experience</p>
      <ol className="divide-y divide-mist border-y border-mist">
        {experience.map((item) => {
          const content = (
            <>
              <div className="label w-full shrink-0 sm:w-40">
                {item.start} — {item.end}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold tracking-tight">{item.org}</h3>
                <p className="text-sm text-graphite">{item.role}</p>
                <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-graphite">
                  {item.description}
                </p>
              </div>
            </>
          );

          return (
            <li
              key={`${item.org}-${item.role}`}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-8"
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 flex-col gap-2 sm:flex-row sm:gap-8"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
