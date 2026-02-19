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
    <div className="flex items-center gap-3 border-t border-sky-100 pt-3">
      <button
        type="button"
        onClick={() => setLiked((value) => !value)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition",
          liked ? "bg-sky-100 text-sky-700" : "bg-sky-50 text-[color:var(--muted)] hover:bg-sky-100"
        )}
      >
        <Heart size={16} className={cn(liked ? "fill-current" : "")} /> {likes}
      </button>

      <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-[color:var(--muted)]">
        <MessageCircle size={16} /> {commentsCount}
      </div>
    </div>
  );
}
