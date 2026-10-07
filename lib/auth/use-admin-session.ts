"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { toFriendlyError } from "@/lib/notes/errors";

export type AdminStatus =
  | "unconfigured" // Supabase env vars missing
  | "checking"
  | "signed-out"
  | "forbidden" // signed in, but not the admin
  | "admin";

export function useAdminSession() {
  const [status, setStatus] = useState<AdminStatus>(isSupabaseConfigured ? "checking" : "unconfigured");
  const [user, setUser] = useState<User | null>(null);

  const checkIsAdmin = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setUser(null);
      setStatus("signed-out");
      return;
    }
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus("unconfigured");
      return;
    }
    const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", nextUser.id).maybeSingle();

    setUser(nextUser);
    if (error || !data?.is_admin) {
      setStatus("forbidden");
      return;
    }
    setStatus("admin");
  }, []);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setStatus("unconfigured");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      checkIsAdmin(data.session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      checkIsAdmin(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [checkIsAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: "Supabase isn't configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: toFriendlyError(error) };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return { status, user, signIn, signOut };
}
