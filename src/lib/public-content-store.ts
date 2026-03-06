import {
  blogs as mockBlogs,
  events as mockEvents,
} from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { Blog, Event } from "@/lib/types";

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

function formatTime(value: string | null): string {
  if (!value) return "TBD";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function inferEventType(title: string): Event["type"] {
  const normalized = title.toLowerCase();
  if (normalized.includes("workshop")) return "workshop";
  if (normalized.includes("webinar") || normalized.includes("online")) return "webinar";
  if (normalized.includes("fundraiser") || normalized.includes("gala")) return "fundraiser";
  return "community";
}

export async function loadPublicBlogs(limit?: number): Promise<Blog[]> {
  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_image_url, published_at, markdown_content")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query.returns<
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
      return mockBlogs;
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
    return mockBlogs;
  }
}

export async function loadPublicBlogBySlug(slug: string): Promise<Blog | undefined> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_image_url, published_at, markdown_content, status")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        cover_image_url: string | null;
        published_at: string | null;
        markdown_content: string;
        status: "draft" | "published" | "archived";
      }>();

    if (error || !data) {
      return mockBlogs.find((blog) => blog.slug === slug);
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      summary: data.excerpt || "",
      cover:
        data.cover_image_url ||
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
      publishedAt: formatDate(data.published_at),
      content: data.markdown_content,
    };
  } catch {
    return mockBlogs.find((blog) => blog.slug === slug);
  }
}

export async function loadPublicEvents(limit?: number): Promise<Event[]> {
  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("events")
      .select("id, title, description, event_location, starts_at, cover_image_url")
      .eq("is_active", true)
      .order("starts_at", { ascending: true });

    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const { data, error } = await query.returns<
      Array<{
        id: string;
        title: string;
        description: string;
        event_location: string | null;
        starts_at: string;
        cover_image_url: string | null;
      }>
    >();

    if (error || !data || data.length === 0) {
      return mockEvents;
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: formatDate(item.starts_at),
      time: formatTime(item.starts_at),
      location: item.event_location || "Location TBD",
      type: inferEventType(item.title),
      image:
        item.cover_image_url ||
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop",
    }));
  } catch {
    return mockEvents;
  }
}

export async function loadPublicEventById(eventId: string): Promise<Event | undefined> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, event_location, starts_at, cover_image_url, is_active")
      .eq("id", eventId)
      .eq("is_active", true)
      .maybeSingle<{
        id: string;
        title: string;
        description: string;
        event_location: string | null;
        starts_at: string;
        cover_image_url: string | null;
        is_active: boolean;
      }>();

    if (error || !data) {
      return mockEvents.find((event) => event.id === eventId);
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      date: formatDate(data.starts_at),
      time: formatTime(data.starts_at),
      location: data.event_location || "Location TBD",
      type: inferEventType(data.title),
      image:
        data.cover_image_url ||
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop",
    };
  } catch {
    return mockEvents.find((event) => event.id === eventId);
  }
}
