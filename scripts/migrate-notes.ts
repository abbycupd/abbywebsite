// One-time migration: copies every post from the legacy data/notes.ts into
// the Supabase journal_posts table, preserving slug/title/date/excerpt/body/
// tags exactly, so existing /notes/<slug> URLs keep working unchanged.
//
// Idempotent — safe to run more than once. Uses `upsert` on the unique slug
// constraint with ignoreDuplicates, so a second run never creates
// duplicates; it just skips posts that are already there.
//
// Usage (run once, from the project root, after `supabase/journal.sql` has
// been run and you have an admin account — see README.md → "Notes CMS"):
//
//   1. Add these to .env.local (git-ignored) alongside the Supabase values:
//        ADMIN_EMAIL=you@example.com
//        ADMIN_PASSWORD=your-password
//   2. npm run migrate:notes
//
// The script reads .env.local itself (tsx doesn't — only Next.js does that
// automatically). Variables already set in your shell take precedence. The
// ADMIN_* values are only ever read here, by Node on your machine: they
// aren't NEXT_PUBLIC_, so Next.js never puts them in the browser bundle.
// Remove them from .env.local once the migration is done.
//
// It signs in as your admin account (the same account /admin uses) and
// inserts through the normal RLS-protected API — no service-role key is
// ever needed, created, or stored.

import { createClient } from "@supabase/supabase-js";
import { notes } from "../data/notes";
import { docFromParagraphs } from "../lib/notes/content";

/** Loads .env.local into process.env without overriding anything already
 * set in the shell. Uses Node's own parser (no `$VAR` expansion, so a
 * password containing `$` is read literally). */
function loadEnvLocal() {
  try {
    process.loadEnvFile(".env.local");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    // No .env.local — fall back to whatever the shell provides.
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!url || !anonKey || !email || !password) {
    console.error(
      "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD.\n" +
        "Add them to .env.local in the project root (see the usage comment at the top of this script)."
    );
    process.exit(1);
  }

  const supabase = createClient(url, anonKey);

  const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
  if (authError) {
    console.error(`Couldn't sign in as ${email}: ${authError.message}`);
    console.error("Make sure this account exists and has been marked as admin — see README.md.");
    process.exit(1);
  }
  console.log(`Signed in as ${email}.`);

  const rows = notes.map((note) => ({
    title: note.title,
    slug: note.slug,
    excerpt: note.excerpt,
    content: docFromParagraphs(note.body),
    tags: note.tags,
    status: "published" as const,
    published_at: new Date(note.date).toISOString(),
    created_at: new Date(note.date).toISOString(),
  }));

  const { data, error } = await supabase
    .from("journal_posts")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: true })
    .select("slug");

  if (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }

  console.log(`Done. ${data?.length ?? 0} post(s) inserted (existing slugs were skipped, not duplicated).`);
  console.log(`Total posts in data/notes.ts: ${notes.length}.`);
}

main();
