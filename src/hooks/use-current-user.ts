"use client";

import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { CurrentUserProfile } from "@/lib/auth";

type UseCurrentUserResult = {
  user: CurrentUserProfile | null;
  isLoading: boolean;
};

export function useCurrentUser(): UseCurrentUserResult {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [user, setUser] = useState<CurrentUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!authUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role, bio")
        .eq("id", authUser.id)
        .maybeSingle<{
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "member" | "ngo" | null;
          bio: string | null;
        }>();

      if (!mounted) return;

      setUser({
        id: authUser.id,
        name:
          profile?.full_name ||
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "Member",
        avatar:
          profile?.avatar_url ||
          authUser.user_metadata?.avatar_url ||
          "https://i.pravatar.cc/100",
        role: profile?.role || "member",
        bio: profile?.bio || undefined,
        email: authUser.email,
      });
      setIsLoading(false);
    };

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, isLoading };
}
