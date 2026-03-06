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
          }) => void;
          prompt: () => void;
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

    let active = true;

    const load = async () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        await new Promise<void>((resolve) => {
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
            router.refresh();
          }
        },
        auto_select: true,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt();
    };

    void load();

    return () => {
      active = false;
      window.google?.accounts.id.cancel();
    };
  }, [isLoading, router, user]);

  return null;
}
