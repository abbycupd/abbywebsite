import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { DraggableNote } from "@/components/draggable-note";
import { ProjectsSection } from "@/components/projects-section";
import { ExperimentsSection } from "@/components/experiments-section";
import { AboutSection } from "@/components/about-section";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { NotesPreview } from "@/components/notes-preview";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <div className="relative">
          <DraggableNote />
          <Hero />
        </div>
        <ProjectsSection />
        <ExperimentsSection />
        <AboutSection />
        <ExperienceTimeline />
        <NotesPreview />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
