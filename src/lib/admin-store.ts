import { blogs, events, stories, users } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type AdminOverview = {
  usersCount: number;
  storiesCount: number;
  blogsCount: number;
  eventsCount: number;
  membersCount: number;
};

export type AdminMember = {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "member" | "ngo";
  bio?: string;
  joinedAt?: string;
};

function formatJoinedAt(value: string | null): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function fallbackOverview(): AdminOverview {
  return {
    usersCount: users.length,
    storiesCount: stories.length,
    blogsCount: blogs.length,
    eventsCount: events.length,
    membersCount: users.filter((user) => user.role !== "admin").length,
  };
}

export async function loadAdminOverview(): Promise<AdminOverview> {
  try {
    const supabase = await createSupabaseServerClient();

    const [usersRes, storiesRes, blogsRes, eventsRes, membersRes] =
      await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("stories").select("id", { count: "exact", head: true }),
        supabase
          .from("blog_posts")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        supabase
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .neq("role", "admin"),
      ]);

    return {
      usersCount: usersRes.count ?? 0,
      storiesCount: storiesRes.count ?? 0,
      blogsCount: blogsRes.count ?? 0,
      eventsCount: eventsRes.count ?? 0,
      membersCount: membersRes.count ?? 0,
    };
  } catch {
    return fallbackOverview();
  }
}

export async function loadRecentMembers(limit = 4): Promise<AdminMember[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, bio, created_at")
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<
        Array<{
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "member" | "ngo" | null;
          bio: string | null;
          created_at: string | null;
        }>
      >();

    if (error || !data || data.length === 0) {
      return users.slice(0, limit).map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role || "member",
        bio: user.bio,
        joinedAt: user.joinedAt,
      }));
    }

    return data.map((item) => ({
      id: item.id,
      name: item.full_name || "Member",
      avatar: item.avatar_url || "https://i.pravatar.cc/100",
      role: item.role || "member",
      bio: item.bio || undefined,
      joinedAt: formatJoinedAt(item.created_at),
    }));
  } catch {
    return users.slice(0, limit).map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      role: user.role || "member",
      bio: user.bio,
      joinedAt: user.joinedAt,
    }));
  }
}
