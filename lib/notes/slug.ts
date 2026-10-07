/** Turns a post title into a URL-safe slug, e.g. "There Are More Men in
 * Tech. So What?" -> "there-are-more-men-in-tech-so-what". */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
