import { ArrowUpRight } from "lucide-react";
import { contact } from "@/data/contact";

export function ContactSection() {
  return (
    <section id="contact" className="container-page py-20 sm:py-32">
      <p className="label mb-4">get in touch</p>
      <h2 className="text-balance max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Have an idea? Want to build something? Want to talk coffee?
      </h2>

      <a
        href={`mailto:${contact.email}`}
        className="group mt-8 inline-flex items-center gap-2 border-b-2 border-ink pb-1 font-display text-xl font-medium tracking-tight transition-colors hover:text-roast hover:border-roast sm:text-2xl"
      >
        {contact.email}
        <ArrowUpRight size={20} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>

      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
        {contact.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex items-center gap-1 text-graphite hover:text-ink"
          >
            {link.label}
            <ArrowUpRight size={12} />
          </a>
        ))}
        {contact.cvHref && (
          <a href={contact.cvHref} className="label inline-flex items-center gap-1 text-graphite hover:text-ink">
            Download CV
            <ArrowUpRight size={12} />
          </a>
        )}
      </div>
    </section>
  );
}
