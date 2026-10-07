export type SaveState = "idle" | "unsaved" | "saving" | "saved" | "error";

export function SaveStatus({ state, errorMessage }: { state: SaveState; errorMessage?: string | null }) {
  if (state === "idle") return null;

  const label = {
    unsaved: "Unsaved changes",
    saving: "Saving…",
    saved: "Saved",
    error: errorMessage || "Couldn't save",
  }[state];

  const color = state === "error" ? "text-roast" : "text-graphite";

  return <p className={`label ${color}`}>{label}</p>;
}
