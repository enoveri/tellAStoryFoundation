"use client";

import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  isStorySaved,
  toggleSaveStory,
  toggleStoryLike,
} from "@/lib/stories-client";
import { cn } from "@/lib/utils";

type InteractionBarProps = {
  storyId?: string;
  initialLikes: number;
  commentsCount: number;
  storyTitle?: string;
  storyExcerpt?: string;
};

function truncate(value: string, length = 140) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).trimEnd()}...`;
}

export function InteractionBar({
  storyId,
  initialLikes,
  commentsCount,
  storyTitle,
  storyExcerpt,
}: InteractionBarProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isTogglingSave, setIsTogglingSave] = useState(false);

  useEffect(() => {
    if (!storyId) {
      return;
    }

    void isStorySaved(storyId).then((result) => {
      setSaved(result.saved);
    });
  }, [storyId]);

  return (
    <div className="flex items-center gap-3 border-t border-[color:var(--border)] pt-3">
      <button
        type="button"
        disabled={isSaving}
        onClick={async () => {
          if (!storyId) {
            setLiked((value) => !value);
            setLikes((count) => count + (liked ? -1 : 1));
            return;
          }

          setIsSaving(true);
          const nextLiked = !liked;
          const result = await toggleStoryLike(storyId, nextLiked);

          if (!result.error) {
            setLiked(result.liked);
            if (typeof result.likes === "number") {
              setLikes(result.likes);
            }
          }

          setIsSaving(false);
        }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition",
          liked
            ? "bg-[color:var(--primary-light)] text-[color:var(--primary)]"
            : "bg-[color:var(--primary-subtle)] text-[color:var(--muted)] hover:bg-[color:var(--primary-light)]",
          isSaving ? "opacity-60" : "",
        )}
      >
        <Heart size={16} className={cn(liked ? "fill-current" : "")} /> {likes}
      </button>

      <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-subtle)] px-3 py-1.5 text-sm font-medium text-[color:var(--muted)]">
        <MessageCircle size={16} /> {commentsCount}
      </div>

      <button
        type="button"
        disabled={!storyId || isTogglingSave}
        onClick={async () => {
          if (!storyId) {
            return;
          }

          setIsTogglingSave(true);
          const result = await toggleSaveStory(storyId, !saved);
          if (!result.error) {
            setSaved(result.saved);
          }
          setIsTogglingSave(false);
        }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition",
          saved
            ? "bg-[color:var(--primary-light)] text-[color:var(--primary)]"
            : "bg-[color:var(--primary-subtle)] text-[color:var(--muted)] hover:bg-[color:var(--primary-light)]",
          isTogglingSave ? "opacity-60" : "",
        )}
      >
        <Bookmark size={16} className={cn(saved ? "fill-current" : "")} />
        {saved ? "Saved" : "Save"}
      </button>

      <button
        type="button"
        disabled={!storyId}
        onClick={async () => {
          if (!storyId) {
            return;
          }

          const shareUrl = `${window.location.origin}/stories/${storyId}`;

          if (navigator.share) {
            try {
              const previewText = storyExcerpt
                ? truncate(storyExcerpt)
                : "Read this story";
              await navigator.share({
                title: storyTitle || "Story",
                text: previewText,
                url: shareUrl,
              });
              return;
            } catch {
              // Fallback to clipboard below.
            }
          }

          if (navigator.clipboard) {
            const previewText = storyExcerpt
              ? truncate(storyExcerpt)
              : "Read this story";
            const content = `${storyTitle || "Story"}\n${previewText}\n${shareUrl}`;
            await navigator.clipboard.writeText(content);
          }
        }}
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-subtle)] px-3 py-1.5 text-sm font-medium text-[color:var(--muted)] transition hover:bg-[color:var(--primary-light)]"
      >
        <Share2 size={16} /> Share
      </button>
    </div>
  );
}
