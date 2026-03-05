"use client";

import Image from "next/image";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { ReplyItem } from "@/components/story/reply-item";
import { findUser } from "@/lib/mock-data";
import type { Comment } from "@/lib/types";

type CommentThreadProps = {
  comments: Comment[];
};

export function CommentThread({ comments }: CommentThreadProps) {
  const [expanded, setExpanded] = useState(true);

  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--border)] p-4 text-sm text-[color:var(--muted)]">
        No comments yet. Be the first to encourage this storyteller.
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--primary-light)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--foreground)]"
      >
        <MessageSquarePlus size={14} /> {expanded ? "Hide" : "Show"}{" "}
        conversation
      </button>

      {expanded
        ? comments.map((comment) => {
            const user = findUser(comment.userId);
            return (
              <article
                key={comment.id}
                className="space-y-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={user?.avatar ?? "https://i.pravatar.cc/100"}
                    alt={user?.name ?? "User"}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">
                    {user?.name ?? "Anonymous"}
                  </span>
                  <span className="text-xs text-[color:var(--muted)]">
                    {comment.createdAt}
                  </span>
                </div>
                <p className="text-sm text-[color:var(--foreground)]/90">
                  {comment.content}
                </p>
                <div className="space-y-2">
                  {comment.replies.map((reply) => (
                    <ReplyItem
                      key={reply.id}
                      reply={reply}
                      user={findUser(reply.userId)}
                    />
                  ))}
                </div>
              </article>
            );
          })
        : null}
    </section>
  );
}
