/** Maps common Supabase/Postgres/network failures to messages that are safe
 * and useful to show directly in the admin UI, instead of a raw error. */
export function toFriendlyError(error: unknown, context?: string): string {
  const raw = extractMessage(error);
  const code = extractCode(error);

  if (code === "23505" || /duplicate key value/i.test(raw)) {
    return "That URL (slug) is already used by another post. Try a different title, or edit the slug field.";
  }
  if (code === "42501" || /row-level security/i.test(raw)) {
    return "You don't have permission to do that. Make sure you're signed in with the admin account.";
  }
  if (/Invalid login credentials/i.test(raw)) {
    return "Incorrect email or password.";
  }
  if (/Failed to fetch|NetworkError|ECONNREFUSED|fetch failed/i.test(raw)) {
    return "Couldn't reach the database. Check your connection and try again.";
  }
  if (/JWT|expired/i.test(raw) && /session|token/i.test(raw)) {
    return "Your session has expired. Please sign in again.";
  }

  return context ? `${context}: ${raw || "something went wrong."}` : raw || "Something went wrong. Please try again.";
}

function extractMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message ?? "");
  }
  return "";
}

function extractCode(error: unknown): string | undefined {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
}
