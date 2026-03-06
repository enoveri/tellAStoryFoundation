"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { signInWithGoogleIdToken } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/use-current-user";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (params: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            nonce?: string;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
            itp_support?: boolean;
            context?: "signin" | "signup" | "use";
          }) => void;
          prompt: (
            callback?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
              getNotDisplayedReason: () => string;
              getSkippedReason: () => string;
              getDismissedReason: () => string;
            }) => void,
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function createNonce(length = 32): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  let nonce = "";
  for (let i = 0; i < randomValues.length; i += 1) {
    nonce += charset[randomValues[i] % charset.length];
  }

  return nonce;
}

async function sha256Base64Url(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const binary = String.fromCharCode(...new Uint8Array(digest));
  const base64 = btoa(binary);

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function GoogleOneTap() {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!googleClientId) {
      console.warn(
        "[OneTap] Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. One Tap will not initialize.",
      );
      return;
    }

    if (isLoading || user) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (window.location.pathname.startsWith("/auth/callback")) {
      return;
    }

    let active = true;

    const load = async () => {
      if (!window.google) {
        let script = document.getElementById(
          "google-gsi-script",
        ) as HTMLScriptElement | null;

        if (!script) {
          script = document.createElement("script");
          script.id = "google-gsi-script";
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }

        await new Promise<void>((resolve) => {
          if (window.google) {
            resolve();
            return;
          }

          script.onload = () => resolve();
          script.onerror = () => {
            console.error("[OneTap] Failed to load Google GSI script.");
            resolve();
          };
        });
      }

      if (!active || !window.google) {
        console.info("[OneTap] Google API not available after script load.");
        return;
      }

      const rawNonce = createNonce();
      const hashedNonce = await sha256Base64Url(rawNonce);

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        nonce: hashedNonce,
        callback: async ({ credential }) => {
          if (!credential) {
            console.error("[OneTap] Credential callback returned empty token.");
            return;
          }

          const result = await signInWithGoogleIdToken(credential, rawNonce);
          if (result.error) {
            console.error("[OneTap] Supabase ID token sign-in failed:", result.error);
            return;
          }

          console.info("[OneTap] Sign-in successful, redirecting to profile.");
          router.push("/profile");
          router.refresh();
        },
        auto_select: true,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        itp_support: true,
        context: "signin",
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.info(
            "[OneTap] Not displayed:",
            notification.getNotDisplayedReason(),
          );
        }

        if (notification.isSkippedMoment()) {
          console.info(
            "[OneTap] Skipped:",
            notification.getSkippedReason(),
          );
        }

        if (notification.isDismissedMoment()) {
          console.info(
            "[OneTap] Dismissed:",
            notification.getDismissedReason(),
          );
        }
      });
    };

    void load();

    return () => {
      active = false;
      window.google?.accounts.id.cancel();
    };
  }, [isLoading, router, user]);

  return null;
}
