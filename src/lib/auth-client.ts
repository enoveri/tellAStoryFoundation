"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export async function signInWithGoogle(nextPath = "/profile") {
  const supabase = createSupabaseBrowserClient();

  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

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

export async function signOutUser() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  return { error: error?.message || null };
}
