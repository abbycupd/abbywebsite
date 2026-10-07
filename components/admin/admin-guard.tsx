"use client";

import type { ReactNode } from "react";
import { useAdminSession } from "@/lib/auth/use-admin-session";
import { LoginForm } from "@/components/admin/login-form";

/** Gates every /admin page. Unauthenticated visitors see a login form;
 * authenticated non-admins see a clear "not authorised" message (so a
 * random Supabase signup can never see or touch journal content — see
 * supabase/journal.sql for the matching RLS policies, which are the real
 * enforcement; this is just the UI reflecting them). */
export function AdminGuard({ children }: { children: ReactNode }) {
  const { status, signIn, signOut } = useAdminSession();

  if (status === "unconfigured") {
    return (
      <div className="container-page py-16">
        <p className="label mb-2">admin</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Supabase isn&rsquo;t configured</h1>
        <p className="mt-4 max-w-prose text-graphite">
          Add <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="font-mono text-sm">.env.local</code> (see{" "}
          <code className="font-mono text-sm">.env.local.example</code>) and restart the dev server.
        </p>
      </div>
    );
  }

  if (status === "checking") {
    return (
      <div className="container-page flex min-h-[50vh] items-center justify-center py-16">
        <p className="label">loading…</p>
      </div>
    );
  }

  if (status === "signed-out") {
    return <LoginForm onSubmit={signIn} />;
  }

  if (status === "forbidden") {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <p className="label mb-4">not authorised</p>
        <h1 className="max-w-md font-display text-2xl font-semibold tracking-tight">
          This account can&rsquo;t manage Notes.
        </h1>
        <button
          onClick={signOut}
          className="label mt-8 rounded-full border border-ink px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-cream"
        >
          sign out
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
