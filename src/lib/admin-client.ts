"use client";

import { blogs, users } from "@/lib/mock-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { Blog, User } from "@/lib/types";

function formatDate(value: string | null): string {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatJoinedAt(value: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export async function fetchAdminBlogs(): Promise<Blog[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, cover_image_url, published_at, markdown_content",
      )
      .order("published_at", { ascending: false, nullsFirst: false })
      .returns<
        Array<{
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          cover_image_url: string | null;
          published_at: string | null;
          markdown_content: string;
        }>
      >();

    if (error || !data || data.length === 0) {
      return blogs;
    }

    return data.map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      summary: item.excerpt || "",
      cover:
        item.cover_image_url ||
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
      publishedAt: formatDate(item.published_at),
      content: item.markdown_content,
    }));
  } catch {
    return blogs;
  }
}

export async function fetchAdminUsers(): Promise<User[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, bio, created_at")
      .order("created_at", { ascending: false })
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
      return users;
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
    return users;
  }
}
