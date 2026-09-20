// Every contact/social link on the site is pulled from here.

export const contact = {
  email: "hello@abbybrennan.co.uk", // change to your real address — still a placeholder
  cvHref: "", // e.g. "/cv-abby-brennan.pdf" once you add the file to /public
  links: [
    // ⚠️ double-check this — you weren't sure of the exact GitHub username
    { label: "GitHub", href: "https://github.com/abbycupd", handle: "@abbycupd" },
    { label: "LinkedIn", href: "https://linkedin.com/in/abbybrennan7", handle: "abbybrennan7" },
    { label: "Cupd.", href: "https://cupd.co.uk", handle: "cupd.co.uk" },
    { label: "StudyNI", href: "https://studyni.com", handle: "studyni.com" },
  ],
};

export type Contact = typeof contact;
