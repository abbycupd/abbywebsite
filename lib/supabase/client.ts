import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True once NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
 * Used so builds (and the admin UI) can fail with a clear message instead of
 * a cryptic network error when Supabase hasn't been configured yet.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

let browserClient: SupabaseClient | null = null;

/**
 * Single shared Supabase client. Uses only the public anon key — safe for
 * the browser. All write permissions are enforced by Postgres RLS
 * (supabase/journal.sql), not by anything in this file.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      // Next.js patches fetch() in server components and, by default, caches
      // responses on disk in .next/cache for a year. For build-time renders
      // that meant `npm run dev` and local builds kept serving whatever was
      // published when the cache was first filled — so new posts were missing
      // and deleted ones lingered. Always ask Supabase for the current data.
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    });
  }
  return browserClient;
}
