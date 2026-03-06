"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

async function syncStoryCounts(storyId: string) {
  const supabase = createSupabaseBrowserClient();

  const [{ count: likesCount }, { count: commentsCount }] = await Promise.all([
    supabase
      .from("story_likes")
      .select("*", { count: "exact", head: true })
      .eq("story_id", storyId),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("story_id", storyId)
      .is("parent_id", null),
  ]);

  await supabase
    .from("stories")
    .update({
      like_count: likesCount ?? 0,
      comment_count: commentsCount ?? 0,
    })
    .eq("id", storyId);

  return {
    likes: likesCount ?? 0,
    comments: commentsCount ?? 0,
  };
}

export async function toggleStoryLike(storyId: string, shouldLike: boolean) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Please sign in to react to stories.",
      likes: null,
      liked: false,
    };
  }

  if (shouldLike) {
    const { error } = await supabase.from("story_likes").upsert({
      story_id: storyId,
      user_id: user.id,
    });

    if (error) {
      return { error: error.message, likes: null, liked: false };
    }
  } else {
    const { error } = await supabase
      .from("story_likes")
      .delete()
      .eq("story_id", storyId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message, likes: null, liked: true };
    }
  }

  const counts = await syncStoryCounts(storyId);

  return {
    error: null,
    likes: counts.likes,
    liked: shouldLike,
  };
}

export async function createStoryComment(storyId: string, content: string) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to comment.", comments: null };
  }

  const { error } = await supabase.from("comments").insert({
    story_id: storyId,
    author_id: user.id,
    body: content,
    parent_id: null,
  });

  if (error) {
    return { error: error.message, comments: null };
  }

  const counts = await syncStoryCounts(storyId);
  return { error: null, comments: counts.comments };
}

export async function createStory(input: {
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  imageFiles?: File[];
}) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to publish a story.", storyId: null };
  }

  const imageUrls: string[] = [];

  for (const [index, file] of (input.imageFiles || []).entries()) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectPath = `${user.id}/${Date.now()}-${index}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("story-media")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return {
        error: `Image upload failed: ${uploadError.message}`,
        storyId: null,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("story-media")
      .getPublicUrl(objectPath);

    imageUrls.push(publicUrlData.publicUrl);
  }

  const coverImageUrl = imageUrls[0] || null;

  const { data: story, error: storyError } = await supabase
    .from("stories")
    .insert({
      author_id: user.id,
      title: input.title,
      summary: input.excerpt,
      body: input.body,
      cover_image_url: coverImageUrl,
      status: "published",
    })
    .select("id")
    .single<{ id: string }>();

  if (storyError || !story) {
    return {
      error: storyError?.message || "Failed to publish story.",
      storyId: null,
    };
  }

  if (imageUrls.length > 0) {
    const { error: storyImagesError } = await supabase.from("story_images").insert(
      imageUrls.map((imageUrl, index) => ({
        story_id: story.id,
        image_url: imageUrl,
        sort_order: index,
      })),
    );

    if (storyImagesError) {
      return {
        error: `Story published but gallery failed to save: ${storyImagesError.message}`,
        storyId: story.id,
      };
    }
  }

  const normalizedTag = input.tag.trim().toLowerCase();
  if (normalizedTag) {
    const { error: tagError } = await supabase.from("story_tags").insert({
      story_id: story.id,
      tag: normalizedTag,
    });

    if (tagError) {
      return {
        error: `Story created but tag failed to save: ${tagError.message}`,
        storyId: story.id,
      };
    }
  }

  return { error: null, storyId: story.id };
}
