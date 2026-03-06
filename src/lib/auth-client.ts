"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

function extractNonceFromIdToken(idToken: string): string | null {
  try {
    const [, payload] = idToken.split(".");
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(padded)) as { nonce?: unknown };

    return typeof decoded.nonce === "string" && decoded.nonce.length > 0
      ? decoded.nonce
      : null;
  } catch {
    return null;
  }
}

async function sha256Base64Url(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const binary = String.fromCharCode(...new Uint8Array(digest));
  const base64 = btoa(binary);

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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

export async function signInWithGoogleIdToken(idToken: string, nonce?: string) {
  const supabase = createSupabaseBrowserClient();

  const candidates: string[] = [];
  if (nonce) {
    candidates.push(nonce);
    candidates.push(await sha256Base64Url(nonce));
  }

  const tokenNonce = extractNonceFromIdToken(idToken);
  if (tokenNonce) {
    candidates.push(tokenNonce);
  }

  const uniqueCandidates = [...new Set(candidates.filter(Boolean))];
  let lastError: string | null = null;

  if (uniqueCandidates.length > 0) {
    for (const nonceCandidate of uniqueCandidates) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
        nonce: nonceCandidate,
      });

      if (!error) {
        return { error: null };
      }

      lastError = error.message;
      if (!/nonce/i.test(error.message)) {
        return { error: error.message };
      }
    }
  }

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
    nonce,
  });

  return { error: error?.message || lastError };
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
