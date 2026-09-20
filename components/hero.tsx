import { profile } from "@/data/profile";
import { StatusIndicator } from "@/components/status-indicator";
import { LaptopShowcase } from "@/components/laptop-showcase";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="container-page grid min-h-[78vh] items-center gap-10 py-16 lg:grid-cols-[1fr_auto]">
      <div className="flex flex-col justify-center">
        <p className="label mb-5">{profile.tagline}</p>
        <h1 className="text-balance max-w-3xl font-display text-[clamp(2.3rem,6vw,4.2rem)] font-semibold leading-[1.05] tracking-tight text-ink">
          {profile.headline}
        </h1>
        <p className="mt-6 max-w-lg text-lg text-graphite">{profile.subhead}</p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <StatusIndicator />
        </div>

        <a
          href="#projects"
          className="label mt-16 inline-flex w-fit items-center gap-2 text-graphite transition-colors hover:text-ink"
        >
          see what I&rsquo;m building
          <ArrowDown size={14} />
        </a>
      </div>

      <div className="flex justify-center lg:justify-self-end">
        <LaptopShowcase />
      </div>
    </section>
  );
}
