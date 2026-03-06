"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export type EventApplicationInput = {
  eventId: string;
  fullName: string;
  email: string;
  phone?: string;
  organisation?: string;
  notes?: string;
};

export type EventApplicationRecord = {
  id: string;
  event_id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  notes: string | null;
  created_at: string;
};

export async function uploadEventCoverImage(file: File): Promise<{
  url: string | null;
  error: string | null;
}> {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { url: null, error: "Please sign in to upload images." };
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectPath = `events/${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("story-media")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: `Upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("story-media")
      .getPublicUrl(objectPath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch {
    return { url: null, error: "Could not upload image. Please try again." };
  }
}

export async function submitEventApplication(input: EventApplicationInput) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to register for an event." };
  }

  const payload = {
    event_id: input.eventId,
    user_id: user.id,
    full_name: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    organisation: input.organisation?.trim() || null,
    notes: input.notes?.trim() || null,
  };

  const { error } = await supabase
    .from("event_applications")
    .upsert(payload, { onConflict: "event_id,user_id" });

  return { error: error?.message || null };
}

export async function getMyEventApplication(eventId: string): Promise<{
  application: EventApplicationRecord | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { application: null, error: null };
  }

  const { data, error } = await supabase
    .from("event_applications")
    .select(
      "id, event_id, user_id, full_name, email, phone, organisation, notes, created_at",
    )
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle<EventApplicationRecord>();

  return {
    application: data || null,
    error: error?.message || null,
  };
}
