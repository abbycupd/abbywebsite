"use client";

import { useState, type FormEvent } from "react";

export function LoginForm({ onSubmit }: { onSubmit: (email: string, password: string) => Promise<{ error: string | null }> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await onSubmit(email, password);
    setSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <p className="label mb-2 text-center">abby brennan / admin</p>
        <h1 className="mb-8 text-center font-display text-2xl font-semibold tracking-tight">
          Sign in to write
        </h1>

        <label className="label mb-1.5 block">email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-mist bg-paper px-3 py-2 text-ink outline-none focus-visible:border-roast"
        />

        <label className="label mb-1.5 block">password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-md border border-mist bg-paper px-3 py-2 text-ink outline-none focus-visible:border-roast"
        />

        {error && <p className="label mb-4 text-roast">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="label w-full rounded-full border border-ink bg-ink px-4 py-2.5 text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "signing in…" : "sign in"}
        </button>
      </form>
    </div>
  );
}
