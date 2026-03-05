"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toggleStoryLike } from "@/lib/stories-client";
import { cn } from "@/lib/utils";

type InteractionBarProps = {
  storyId?: string;
  initialLikes: number;
  commentsCount: number;
};

export function InteractionBar({
  storyId,
  initialLikes,
  commentsCount,
}: InteractionBarProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isSaving, setIsSaving] = useState(false);

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
    </div>
  );
}
