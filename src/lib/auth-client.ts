"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export async function signInWithGoogle() {
  const supabase = createSupabaseBrowserClient();

  const redirectTo = `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  return { error: error?.message || null };
}

export async function signInWithGoogleIdToken(idToken: string) {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });

  return { error: error?.message || null };
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
}) {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  return { error: error?.message || null };
}

export async function signUpWithEmail(input: {
  email: string;
  password: string;
  fullName?: string;
}) {
  const supabase = createSupabaseBrowserClient();

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: input.fullName || undefined,
      },
    },
  });

  return { error: error?.message || null };
}

export async function signOutUser() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  return { error: error?.message || null };
}
