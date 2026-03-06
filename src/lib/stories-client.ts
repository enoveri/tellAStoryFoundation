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

export async function createStoryReply(
  storyId: string,
  parentCommentId: string,
  content: string,
) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to reply.", comments: null };
  }

  const { error } = await supabase.from("comments").insert({
    story_id: storyId,
    author_id: user.id,
    body: content,
    parent_id: parentCommentId,
  });

  if (error) {
    return { error: error.message, comments: null };
  }

  const counts = await syncStoryCounts(storyId);
  return { error: null, comments: counts.comments };
}

export async function toggleCommentLike(
  commentId: string,
  shouldLike: boolean,
) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Please sign in to react to comments.",
      likes: null,
      liked: false,
    };
  }

  if (shouldLike) {
    const { error } = await supabase.from("comment_likes").upsert({
      comment_id: commentId,
      user_id: user.id,
    });

    if (error) {
      return { error: error.message, likes: null, liked: false };
    }
  } else {
    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", user.id);

    if (error) {
      return { error: error.message, likes: null, liked: true };
    }
  }

  const { count } = await supabase
    .from("comment_likes")
    .select("*", { count: "exact", head: true })
    .eq("comment_id", commentId);

  return {
    error: null,
    likes: count ?? 0,
    liked: shouldLike,
  };
}

export async function toggleSaveStory(storyId: string, shouldSave: boolean) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Please sign in to save stories.",
      saved: false,
    };
  }

  if (shouldSave) {
    const { error } = await supabase.from("saved_stories").upsert({
      story_id: storyId,
      user_id: user.id,
    });

    return { error: error?.message || null, saved: !error };
  }

  const { error } = await supabase
    .from("saved_stories")
    .delete()
    .eq("story_id", storyId)
    .eq("user_id", user.id);

  return { error: error?.message || null, saved: false };
}

export async function isStorySaved(storyId: string) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { saved: false };
  }

  const { data } = await supabase
    .from("saved_stories")
    .select("story_id")
    .eq("story_id", storyId)
    .eq("user_id", user.id)
    .maybeSingle();

  return { saved: !!data };
}

export async function createStory(input: {
  storyId?: string;
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  imageFiles?: File[];
  status?: "draft" | "published";
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

  const payload: {
    author_id: string;
    title: string;
    summary: string;
    body: string;
    status: "draft" | "published";
    cover_image_url?: string;
  } = {
    author_id: user.id,
    title: input.title,
    summary: input.excerpt,
    body: input.body,
    status: input.status || "published",
  };

  if (coverImageUrl) {
    payload.cover_image_url = coverImageUrl;
  }

  const storyMutation = input.storyId
    ? supabase
        .from("stories")
        .update(payload)
        .eq("id", input.storyId)
        .select("id")
        .single<{ id: string }>()
    : supabase
        .from("stories")
        .insert(payload)
        .select("id")
        .single<{ id: string }>();

  const { data: story, error: storyError } = await storyMutation;

  if (storyError || !story) {
    return {
      error: storyError?.message || "Failed to publish story.",
      storyId: null,
    };
  }

  if (imageUrls.length > 0) {
    if (input.storyId) {
      await supabase.from("story_images").delete().eq("story_id", story.id);
    }

    const { error: storyImagesError } = await supabase
      .from("story_images")
      .insert(
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
    if (input.storyId) {
      await supabase.from("story_tags").delete().eq("story_id", story.id);
    }

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

export type ManagedStory = {
  id: string;
  title: string;
  summary: string;
  body: string;
  coverImageUrl: string | null;
  status: "draft" | "published" | "archived";
  createdAt: string;
  tag: string;
};

export async function fetchMyStories(): Promise<ManagedStory[]> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("stories")
    .select("id, title, summary, body, cover_image_url, status, created_at")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .returns<
      Array<{
        id: string;
        title: string;
        summary: string | null;
        body: string;
        cover_image_url: string | null;
        status: "draft" | "published" | "archived";
        created_at: string;
      }>
    >();

  if (!data) {
    return [];
  }

  const storyIds = data.map((story) => story.id);
  const { data: tags } = await supabase
    .from("story_tags")
    .select("story_id, tag")
    .in("story_id", storyIds)
    .returns<Array<{ story_id: string; tag: string }>>();

  const tagMap = new Map<string, string>();
  (tags || []).forEach((row) => {
    if (!tagMap.has(row.story_id)) {
      tagMap.set(row.story_id, row.tag);
    }
  });

  return data.map((story) => ({
    id: story.id,
    title: story.title,
    summary: story.summary || "",
    body: story.body,
    coverImageUrl: story.cover_image_url,
    status: story.status,
    createdAt: story.created_at,
    tag: tagMap.get(story.id) || "",
  }));
}

export async function deleteStory(storyId: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("stories").delete().eq("id", storyId);
  return { error: error?.message || null };
}
