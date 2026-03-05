import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type CurrentUserProfile = {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member" | "ngo";
  bio?: string;
  email?: string;
};

export async function getCurrentAuthUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function requireAuth(redirectTo = "/") {
  const user = await getCurrentAuthUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const authUser = data.user;

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

  return {
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
  };
}
