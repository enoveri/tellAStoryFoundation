"use client";

import { blogs, events as mockEvents, users } from "@/lib/mock-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { Blog, User } from "@/lib/types";

export type AdminEvent = {
  id: string;
  title: string;
  description: string;
  eventLocation: string;
  startsAt: string;
  endsAt: string | null;
  coverImageUrl: string;
  isActive: boolean;
  applicantsCount: number;
};

export type EventApplicant = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  organisation?: string;
  notes?: string;
  createdAt: string;
};

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
      .select("id, full_name, avatar_url, role, bio, created_at, is_suspended")
      .order("created_at", { ascending: false })
      .returns<
        Array<{
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "member" | "ngo" | null;
          bio: string | null;
          created_at: string | null;
          is_suspended: boolean | null;
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
      isSuspended: item.is_suspended ?? false,
    }));
  } catch {
    return users;
  }
}

export async function deleteAdminBlog(blogId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", blogId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function promoteUserToAdmin(userId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function setUserSuspended(userId: string, suspend: boolean) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      is_suspended: suspend,
      suspended_at: suspend ? new Date().toISOString() : null,
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

function toIsoDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

export async function fetchAdminEvents(): Promise<AdminEvent[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, title, description, event_location, starts_at, ends_at, cover_image_url, is_active",
      )
      .order("starts_at", { ascending: true })
      .returns<
        Array<{
          id: string;
          title: string;
          description: string;
          event_location: string | null;
          starts_at: string;
          ends_at: string | null;
          cover_image_url: string | null;
          is_active: boolean;
        }>
      >();

    if (error || !data) {
      return mockEvents.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        eventLocation: event.location,
        startsAt: toIsoDate(`${event.date} ${event.time}`),
        endsAt: null,
        coverImageUrl: event.image,
        isActive: true,
        applicantsCount: 0,
      }));
    }

    const { data: applications } = await supabase
      .from("event_applications")
      .select("event_id")
      .returns<Array<{ event_id: string }>>();

    const counts = (applications || []).reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.event_id] = (acc[row.event_id] || 0) + 1;
        return acc;
      },
      {},
    );

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      eventLocation: item.event_location || "",
      startsAt: item.starts_at,
      endsAt: item.ends_at,
      coverImageUrl: item.cover_image_url || "",
      isActive: item.is_active,
      applicantsCount: counts[item.id] || 0,
    }));
  } catch {
    return mockEvents.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      eventLocation: event.location,
      startsAt: toIsoDate(`${event.date} ${event.time}`),
      endsAt: null,
      coverImageUrl: event.image,
      isActive: true,
      applicantsCount: 0,
    }));
  }
}

export async function saveAdminEvent(input: {
  id?: string;
  title: string;
  description: string;
  eventLocation: string;
  startsAt: string;
  endsAt?: string;
  coverImageUrl?: string;
  isActive: boolean;
}) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const payload = {
    title: input.title,
    description: input.description,
    event_location: input.eventLocation || null,
    starts_at: new Date(input.startsAt).toISOString(),
    ends_at: input.endsAt ? new Date(input.endsAt).toISOString() : null,
    cover_image_url: input.coverImageUrl || null,
    is_active: input.isActive,
    created_by: user?.id || null,
  };

  const mutation = input.id
    ? supabase.from("events").update(payload).eq("id", input.id)
    : supabase.from("events").insert(payload);

  const { error } = await mutation;
  return { error: error?.message || null };
}

export async function deleteAdminEvent(eventId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  return { error: error?.message || null };
}

export async function fetchEventApplicants(
  eventId: string,
): Promise<EventApplicant[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("event_applications")
    .select(
      "id, user_id, full_name, email, phone, organisation, notes, created_at",
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .returns<
      Array<{
        id: string;
        user_id: string;
        full_name: string;
        email: string;
        phone: string | null;
        organisation: string | null;
        notes: string | null;
        created_at: string;
      }>
    >();

  if (error || !data) {
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    userId: item.user_id,
    fullName: item.full_name,
    email: item.email,
    phone: item.phone || undefined,
    organisation: item.organisation || undefined,
    notes: item.notes || undefined,
    createdAt: item.created_at,
  }));
}
