"use client";

import { useEffect, useRef } from "react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  busyLabel,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  /** Shown on the confirm button while `busy` (defaults to confirmLabel). */
  busyLabel?: string;
  /** While true, both buttons are disabled and the dialog can't be dismissed,
   * so a slow request can't be fired twice or abandoned half-way. */
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dismissRef = useRef(onCancel);
  dismissRef.current = busy ? () => {} : onCancel;

  // Focus the safe option by default, and let Escape cancel.
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6"
      onClick={() => dismissRef.current()}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-mist bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-graphite">{description}</p>
        {error && (
          <p role="alert" className="label mt-4 rounded-md border border-roast/40 bg-roast/5 px-3 py-2 text-roast">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={busy}
            className="label rounded-full border border-mist px-4 py-2 text-graphite transition-colors hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            aria-busy={busy}
            className="label rounded-full border border-roast bg-roast px-4 py-2 text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? busyLabel ?? confirmLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
