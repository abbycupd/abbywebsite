// The timeline on the homepage. Dates use "Mon YYYY" — "Present" is fine
// for the end date of something ongoing. Sort order is preserved as written
// (newest first is conventional, but it's your call).

export type ExperienceItem = {
  org: string;
  role: string;
  start: string; // e.g. "Sep 2024"
  end: string; // e.g. "Present"
  description: string;
  href?: string;
};

export const experience: ExperienceItem[] = [
  {
    org: "CME Group",
    role: "Systems Resilience Intern — Operational Resilience",
    start: "Jul 2026",
    end: "Present",
    description:
      "Building automation for operational resilience and taking part in disaster recovery failovers of critical systems from on-prem infrastructure to Google Cloud.",
  },
  {
    org: "Queen's University Belfast",
    role: "BSc Computer Science",
    start: "2024",
    end: "Present",
    description: "Undergraduate degree in Computer Science.",
  },
  {
    org: "Cupd.",
    role: "Founder",
    start: "2025",
    end: "Present",
    description: "Designing and building a social coffee discovery app, end to end.",
    href: "https://cupd.co.uk",
  },
  {
    org: "StudyNI",
    role: "Founder",
    start: "2025",
    end: "Present",
    description: "Building a revision platform for CCEA students in Northern Ireland.",
    href: "https://studyni.com",
  },
  {
    org: "Brennan Digital",
    role: "Founder",
    start: "2024",
    end: "Present",
    description: "Web and design work for small businesses and clients.",
  },
  {
    org: "Cyclical Apparel",
    role: "Founder",
    start: "Jan 2024",
    end: "Present",
    description:
      "Founded and ran an independent apparel brand, handling everything from e-commerce development and product launches to branding, marketing, and operations.",
  },
];
