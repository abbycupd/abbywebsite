// Edit project copy, links, and status here.
// `screenshots` point at files you add under /public/projects/<slug>/.
// Until you add real ones, the site shows a labelled placeholder instead.

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  year: string;
  tech: string[];
  links: { label: string; href: string }[];
  story: string[];
  screenshots: string[]; // e.g. ["/projects/cupd/1.png"]
  logo?: string; // e.g. "/projects/cupd/logo.svg"
  accent?: string; // optional per-project accent, hex
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "cupd",
    name: "Cupd.",
    tagline: "coffee, captured.",
    description:
      "A social app for your coffee life. Capture and rate coffees, see what friends are drinking, and discover coffee worth drinking nearby.",
    status: "Launching 2026",
    year: "2025–",
    tech: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL", "Google Places API"],
    links: [
      { label: "cupd.co.uk", href: "https://cupd.co.uk" },
      { label: "App Store", href: "" },
    ],
    story: [
      "Cupd started as a way to stop forgetting which coffee I'd actually liked — the name of the roaster, the drink, the café, gone by the time I wanted to order it again.",
      "It grew from a personal log into something closer to Letterboxd for coffee: profiles and a social feed of what your friends are drinking, café discovery powered by location search, and a diary of what you've had, with photos attached to every post.",
      "It's built as a real product from the ground up — React Native and Expo on the front end, Supabase handling auth, storage, and data, Google Places for café discovery — now in beta with real users, alongside café outreach and marketing ahead of a full App Store launch.",
    ],
        screenshots: [
      "/projects/cupd/1.PNG",
      "/projects/cupd/2.PNG",
      "/projects/cupd/3.PNG",
      "/projects/cupd/4.PNG",
      "/projects/cupd/5.PNG",
    ],
    featured: true,
  },
  {
    slug: "studyni",
    name: "StudyNI",
    tagline: "know what to revise next.",
    description:
      "A revision platform for CCEA GCSE and A-Level students in Northern Ireland that uses past-paper patterns and your own progress to tell you what to study next, instead of handing you another pile of notes.",
    status: "In development",
    year: "2025–",
    tech: ["React Native", "Expo", "TypeScript", "Supabase"],
    links: [{ label: "studyni.com", href: "https://studyni.com" }],
    story: [
      "CCEA students revise from the same specifications and the same past papers every year, but almost nobody has turned that pattern into something a student can actually act on.",
      "StudyNI takes the specification, the history of what's come up in past papers, and a student's own coverage and confidence, and turns it into a straight answer to the question 'what should I revise next?'",
      "What started as a web-based CCEA exam prediction and revision platform is now expanding into a dedicated app using historical exam-paper data to surface topic frequency and likelihood, with personalised revision tools and AI-assisted study features planned from there.",
    ],
        screenshots: ["/projects/studyni/1.png", "/projects/studyni/2.png"],
    featured: true,
  },
  {
    slug: "brennan-digital",
    name: "Brennan Digital",
    tagline: "websites & digital work for real people.",
    description:
      "Web and design work for small businesses and individual clients — cafés, tradespeople, local founders — who need something built properly, not a template with their logo dropped on top.",
    status: "Ongoing",
    year: "2024–",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    links: [],
    story: [
      "Brennan Digital is where I build for other people rather than for myself: small, real projects for real clients rather than an agency-scale operation.",
      "Case studies will go here as client work is completed and cleared to share.",
    ],
    screenshots: [],
    featured: true,
  },
];

export type Experiment = {
  name: string;
  description: string;
  year: string;
  tags: string[];
  href?: string;
};

// The lower-commitment shelf — university work, small tools, prototypes.
// Add to this list any time without needing a full case study.
export const experiments: Experiment[] = [
  {
    name: "Two Pointer",
    description:
      "GAA club management software — pitch scheduling, attendance, fixtures, results, and club communications in one place.",
    year: "2026",
    tags: ["club software"],
  },
];