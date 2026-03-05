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

function mapStoryRow(row: StoryRow, tags: string[] = []): Story {
  return {
    id: row.id,
    authorId: row.author_id,
    author: mapAuthor(row.author_id, row.profiles),
    title: row.title,
    excerpt: row.summary || row.body.slice(0, 120),
    body: row.body,
    image:
      row.cover_image_url ||
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop",
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
    commentsCount: story.comments.length,
  }));
}

export async function loadStories(): Promise<Story[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("stories")
      .select(
        "id, author_id, title, summary, body, cover_image_url, like_count, comment_count, created_at, profiles:author_id(full_name, avatar_url)",
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

    return data.map((row) => mapStoryRow(row, tagsByStory.get(row.id) || []));
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
        "id, author_id, title, summary, body, cover_image_url, like_count, comment_count, created_at, profiles:author_id(full_name, avatar_url)",
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

    const comments = commentRows ? mapComments(commentRows) : [];
    const storyTags = (tagRows || []).map((row) => row.tag);
    const story = mapStoryRow(storyRow, storyTags);

    return {
      ...story,
      comments,
      commentsCount: comments.length,
    };
  } catch {
    return findStory(storyId);
  }
}
