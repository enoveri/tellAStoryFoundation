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

export function GoogleOneTap() {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!googleClientId || isLoading || user) {
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
        });
      }

      if (!active || !window.google) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          const result = await signInWithGoogleIdToken(credential);
          if (!result.error) {
            router.push("/profile");
            router.refresh();
          }
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
            "Google One Tap not displayed:",
            notification.getNotDisplayedReason(),
          );
        }

        if (notification.isSkippedMoment()) {
          console.info(
            "Google One Tap skipped:",
            notification.getSkippedReason(),
          );
        }

        if (notification.isDismissedMoment()) {
          console.info(
            "Google One Tap dismissed:",
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
