"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type InteractionBarProps = {
  initialLikes: number;
  commentsCount: number;
};

export function InteractionBar({ initialLikes, commentsCount }: InteractionBarProps) {
  const [liked, setLiked] = useState(false);
  const likes = useMemo(() => initialLikes + (liked ? 1 : 0), [initialLikes, liked]);

  return (
    <div className="flex items-center gap-3 border-t border-[color:var(--border)] pt-3">
      <button
        type="button"
        onClick={() => setLiked((value) => !value)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition",
          liked ? "bg-[color:var(--primary-light)] text-[color:var(--primary)]" : "bg-[color:var(--primary-subtle)] text-[color:var(--muted)] hover:bg-[color:var(--primary-light)]"
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
