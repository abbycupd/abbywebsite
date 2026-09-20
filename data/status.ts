// The rotating "currently" indicator near the top of the homepage.
// Add, remove, or reorder lines freely — the UI just loops through them.

export const currentStatus: string[] = [
  "launching Cupd.",
  "working at CME Group",
  "studying Computer Science at Queens",
];

// The small "internet status" strip further down the page.
// Keep these true and current — don't leave stale ones in.
export const internetStatus = {
  building: "Cupd. — a social app for your coffee life",
  learning: "how to ship things faster without cutting corners",
  obsessedWith: "good coffee and better onboarding flows",
};

// Shown as a small "now playing" detail — update by hand whenever you like,
// this isn't a live Spotify connection.
export const nowPlaying = {
  track: "the 1",
  artist: "Taylor Swift",
};

// Small, real, editable counters. Update the numbers yourself —
// nothing on this site invents statistics.
export const counters = [
  { label: "products shipped", value: 0 },
  { label: "years coding", value: 0 },
];
