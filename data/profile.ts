// Edit this file to change your name, headline, and bio copy.
// Nothing here touches component code.

export const profile = {
  name: "Abby Brennan",
  tagline: "computer science & coffee",

  // Shown as the first line on the homepage.
  headline: "I build the things I keep wishing already existed.",

  // The smaller line underneath the headline.
  subhead: "Computer Science student, software builder & founder.",

  // Short line used in <meta name="description">, link previews, etc.
  seoDescription:
    "Abby Brennan is a Computer Science student and software builder, building Cupd. and StudyNI.",

  // The About section. Keep it short — this is not a CV.
  about: [
    "I'm Abby, a Computer Science student who has a habit of turning random ideas into actual products.",
    "Most of what I build starts as a problem I keep running into myself, a coffee I forgot the name of, a revision list that never quite told me what to study next. I'd rather ship a rough version of that idea than leave it as a note in my phone.",
    "I study Computer Science at Queen's University Belfast, I'm currently gaining professional technology experience, and outside of coursework I split my time between product design, writing code, and figuring out how to get the two to agree with each other.",
  ],

  // Used for the Person structured data (JSON-LD) and Open Graph.
  jobTitle: "Computer Science Student & Software Builder",
  education: "BSc Computer Science, Queen's University Belfast",
};

export type Profile = typeof profile;
