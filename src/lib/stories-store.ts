import { findStory, stories as mockStories } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { Comment, Reply, Story, User } from "@/lib/types";

type StoryRow = {
  id: string;
  author_id: string;
  title: string;
  summary: string | null;
  body: string;
  cover_image_url: string | null;
  like_count: number | null;
  comment_count: number | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type CommentRow = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  parent_id: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type StoryTagRow = {
  story_id: string;
  tag: string;
};

type StoryImageRow = {
  story_id: string;
  image_url: string;
  sort_order: number;
};

type SavedStoryRow = {
  story_id: string;
  created_at: string;
};

function toRelativeTime(dateValue: string): string {
  const date = new Date(dateValue);
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const mins = Math.max(1, Math.floor(diffMs / minute));
    return `${mins}m ago`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.floor(diffMs / hour));
    return `${hours}h ago`;
  }

  const days = Math.max(1, Math.floor(diffMs / day));
  return `${days}d ago`;
}

function mapAuthor(authorId: string, profile: StoryRow["profiles"]): User {
  return {
    id: authorId,
    name: profile?.full_name || "Community Member",
    avatar: profile?.avatar_url || "https://i.pravatar.cc/100",
    role: "member",
  };
}

function mapStoryRow(row: StoryRow, tags: string[] = [], images: string[] = []): Story {
  const coverImage =
    row.cover_image_url ||
    images[0] ||
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop";

  return {
    id: row.id,
    authorId: row.author_id,
    author: mapAuthor(row.author_id, row.profiles),
    title: row.title,
    excerpt: row.summary || row.body.slice(0, 120),
    body: row.body,
    image: coverImage,
    images: images.length > 0 ? images : [coverImage],
    status: row.status,
    tags,
    likes: row.like_count ?? 0,
    commentsCount: row.comment_count ?? 0,
    createdAt: toRelativeTime(row.created_at),
    comments: [],
  };
}

function mapComments(rows: CommentRow[]): Comment[] {
  const byParent = new Map<string, Reply[]>();
  const roots: Comment[] = [];

  rows.forEach((row) => {
    if (row.parent_id) {
      const reply: Reply = {
        id: row.id,
        userId: row.author_id,
        content: row.body,
        createdAt: toRelativeTime(row.created_at),
        userName: row.profiles?.full_name || "Community Member",
        userAvatar: row.profiles?.avatar_url || "https://i.pravatar.cc/100",
      };

      const existing = byParent.get(row.parent_id) || [];
      existing.push(reply);
      byParent.set(row.parent_id, existing);
      return;
    }

    roots.push({
      id: row.id,
      userId: row.author_id,
      content: row.body,
      createdAt: toRelativeTime(row.created_at),
      userName: row.profiles?.full_name || "Community Member",
      userAvatar: row.profiles?.avatar_url || "https://i.pravatar.cc/100",
      replies: [],
    });
  });

  return roots.map((comment) => ({
    ...comment,
    replies: byParent.get(comment.id) || [],
  }));
}

function mapMockStories(): Story[] {
  return mockStories.map((story) => ({
    ...story,
    images: story.images?.length ? story.images : [story.image],
    commentsCount: story.comments.length,
  }));
}

export async function loadStories(): Promise<Story[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("stories")
      .select(
        "id, author_id, title, summary, body, cover_image_url, like_count, comment_count, status, created_at, profiles:author_id(full_name, avatar_url)",
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .returns<StoryRow[]>();

    if (error || !data || data.length === 0) {
      return mapMockStories();
    }

    const storyIds = data.map((story) => story.id);
    const { data: tagsRows } = await supabase
      .from("story_tags")
      .select("story_id, tag")
      .in("story_id", storyIds)
      .returns<StoryTagRow[]>();

    const tagsByStory = new Map<string, string[]>();
    (tagsRows || []).forEach((row) => {
      const existing = tagsByStory.get(row.story_id) || [];
      existing.push(row.tag);
      tagsByStory.set(row.story_id, existing);
    });

    const { data: storyImageRows } = await supabase
      .from("story_images")
      .select("story_id, image_url, sort_order")
      .in("story_id", storyIds)
      .order("sort_order", { ascending: true })
      .returns<StoryImageRow[]>();

    const imagesByStory = new Map<string, string[]>();
    (storyImageRows || []).forEach((row) => {
      const existing = imagesByStory.get(row.story_id) || [];
      existing.push(row.image_url);
      imagesByStory.set(row.story_id, existing);
    });

    return data.map((row) =>
      mapStoryRow(
        row,
        tagsByStory.get(row.id) || [],
        imagesByStory.get(row.id) || [],
      ),
    );
  } catch {
    return mapMockStories();
  }
}

export async function loadStoryById(
  storyId: string,
): Promise<Story | undefined> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: storyRow, error: storyError } = await supabase
      .from("stories")
      .select(
        "id, author_id, title, summary, body, cover_image_url, like_count, comment_count, status, created_at, profiles:author_id(full_name, avatar_url)",
      )
      .eq("id", storyId)
      .maybeSingle<StoryRow>();

    if (storyError || !storyRow) {
      return findStory(storyId);
    }

    const { data: commentRows } = await supabase
      .from("comments")
      .select(
        "id, author_id, body, created_at, parent_id, profiles:author_id(full_name, avatar_url)",
      )
      .eq("story_id", storyId)
      .order("created_at", { ascending: true })
      .returns<CommentRow[]>();

    const { data: tagRows } = await supabase
      .from("story_tags")
      .select("story_id, tag")
      .eq("story_id", storyId)
      .returns<StoryTagRow[]>();

    const { data: storyImageRows } = await supabase
      .from("story_images")
      .select("story_id, image_url, sort_order")
      .eq("story_id", storyId)
      .order("sort_order", { ascending: true })
      .returns<StoryImageRow[]>();

    const comments = commentRows ? mapComments(commentRows) : [];
    const storyTags = (tagRows || []).map((row) => row.tag);
    const storyImages = (storyImageRows || []).map((row) => row.image_url);
    const story = mapStoryRow(storyRow, storyTags, storyImages);

    return {
      ...story,
      comments,
      commentsCount: comments.length,
    };
  } catch {
    return findStory(storyId);
  }
}

export async function loadSavedStories(): Promise<Story[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: savedRows, error: savedError } = await supabase
      .from("saved_stories")
      .select("story_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<SavedStoryRow[]>();

    if (savedError || !savedRows || savedRows.length === 0) {
      return [];
    }

    const storyIds = savedRows.map((row) => row.story_id);
    const { data: storyRows, error: storiesError } = await supabase
      .from("stories")
      .select(
        "id, author_id, title, summary, body, cover_image_url, like_count, comment_count, status, created_at, profiles:author_id(full_name, avatar_url)",
      )
      .in("id", storyIds)
      .returns<StoryRow[]>();

    if (storiesError || !storyRows || storyRows.length === 0) {
      return [];
    }

    const { data: tagsRows } = await supabase
      .from("story_tags")
      .select("story_id, tag")
      .in("story_id", storyIds)
      .returns<StoryTagRow[]>();

    const tagsByStory = new Map<string, string[]>();
    (tagsRows || []).forEach((row) => {
      const existing = tagsByStory.get(row.story_id) || [];
      existing.push(row.tag);
      tagsByStory.set(row.story_id, existing);
    });

    const { data: storyImageRows } = await supabase
      .from("story_images")
      .select("story_id, image_url, sort_order")
      .in("story_id", storyIds)
      .order("sort_order", { ascending: true })
      .returns<StoryImageRow[]>();

    const imagesByStory = new Map<string, string[]>();
    (storyImageRows || []).forEach((row) => {
      const existing = imagesByStory.get(row.story_id) || [];
      existing.push(row.image_url);
      imagesByStory.set(row.story_id, existing);
    });

    const storyMap = new Map<string, Story>(
      storyRows.map((row) => [
        row.id,
        mapStoryRow(
          row,
          tagsByStory.get(row.id) || [],
          imagesByStory.get(row.id) || [],
        ),
      ]),
    );

    return savedRows
      .map((row) => storyMap.get(row.story_id))
      .filter((story): story is Story => !!story);
  } catch {
    return [];
  }
}

export async function loadEditableStory(storyId: string): Promise<
  | {
      id: string;
      title: string;
      excerpt: string;
      body: string;
      tag: string;
      status: "draft" | "published";
    }
  | null
> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: story } = await supabase
      .from("stories")
      .select("id, title, summary, body, status")
      .eq("id", storyId)
      .maybeSingle<{
        id: string;
        title: string;
        summary: string | null;
        body: string;
        status: "draft" | "published" | "archived";
      }>();

    if (!story) {
      return null;
    }

    const { data: tagRow } = await supabase
      .from("story_tags")
      .select("tag")
      .eq("story_id", storyId)
      .limit(1)
      .maybeSingle<{ tag: string }>();

    return {
      id: story.id,
      title: story.title,
      excerpt: story.summary || "",
      body: story.body,
      tag: tagRow?.tag || "",
      status: story.status === "published" ? "published" : "draft",
    };
  } catch {
    return null;
  }
}
