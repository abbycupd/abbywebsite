import { profile } from "@/data/profile";

export function AboutSection() {
  return (
    <section id="about" className="container-page py-20 sm:py-28">
      <div className="grid gap-10 sm:grid-cols-[180px_1fr] sm:gap-16">
        <p className="label">about</p>
        <div className="max-w-prose space-y-5">
          {profile.about.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-display text-2xl font-medium leading-snug tracking-tight sm:text-[1.7rem]"
                  : "text-[15px] leading-relaxed text-graphite sm:text-base"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
