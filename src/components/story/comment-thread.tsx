"use client";

import Image from "next/image";
import {
  Heart,
  MessageSquarePlus,
  Reply as ReplyIcon,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReplyItem } from "@/components/story/reply-item";
import { findUser } from "@/lib/mock-data";
import { createStoryReply, toggleCommentLike } from "@/lib/stories-client";
import type { Comment } from "@/lib/types";

type CommentThreadProps = {
  storyId: string;
  comments: Comment[];
};

export function CommentThread({ storyId, comments }: CommentThreadProps) {
  const [expanded, setExpanded] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [activeLikes, setActiveLikes] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  const getLikeCount = (id: string, fallback = 0) =>
    typeof likeCounts[id] === "number" ? likeCounts[id] : fallback;

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
            const name = comment.userName || user?.name || "Anonymous";
            const avatar =
              comment.userAvatar || user?.avatar || "https://i.pravatar.cc/100";
            return (
              <article
                key={comment.id}
                className="space-y-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={avatar}
                    alt={name}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm font-semibold text-[color:var(--foreground)]">
                    {name}
                  </span>
                  <span className="text-xs text-[color:var(--muted)]">
                    {comment.createdAt}
                  </span>
                </div>
                <p className="text-sm text-[color:var(--foreground)]/90">
                  {comment.content}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-[color:var(--muted)]"
                    onClick={async () => {
                      const next = !activeLikes[comment.id];
                      const result = await toggleCommentLike(comment.id, next);
                      if (!result.error) {
                        setActiveLikes((prev) => ({
                          ...prev,
                          [comment.id]: result.liked,
                        }));
                        if (typeof result.likes === "number") {
                          setLikeCounts((prev) => ({
                            ...prev,
                            [comment.id]: result.likes,
                          }));
                        }
                      }
                    }}
                  >
                    <Heart
                      size={13}
                      className={
                        activeLikes[comment.id]
                          ? "fill-current text-[color:var(--primary)]"
                          : ""
                      }
                    />
                    {getLikeCount(comment.id, comment.likes || 0)}
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-[color:var(--muted)]"
                    onClick={() => {
                      setReplyingTo((current) =>
                        current === comment.id ? null : comment.id,
                      );
                    }}
                  >
                    <ReplyIcon size={13} /> Reply
                  </button>
                </div>

                {replyingTo === comment.id ? (
                  <form
                    className="mt-2 flex items-center gap-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!replyDraft.trim()) {
                        return;
                      }

                      const result = await createStoryReply(
                        storyId,
                        comment.id,
                        replyDraft.trim(),
                      );

                      if (!result.error) {
                        setReplyDraft("");
                        setReplyingTo(null);
                        router.refresh();
                      }
                    }}
                  >
                    <input
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      placeholder="Write a reply"
                      className="w-full rounded-lg border border-[color:var(--border)] px-2 py-1 text-xs"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-fg)]"
                    >
                      <Send size={12} />
                    </button>
                  </form>
                ) : null}

                <div className="space-y-2">
                  {comment.replies.map((reply) => (
                    <ReplyItem
                      key={reply.id}
                      reply={reply}
                      user={findUser(reply.userId)}
                      likes={getLikeCount(reply.id, reply.likes || 0)}
                      liked={!!activeLikes[reply.id]}
                      onLike={async () => {
                        const next = !activeLikes[reply.id];
                        const result = await toggleCommentLike(reply.id, next);
                        if (!result.error) {
                          setActiveLikes((prev) => ({
                            ...prev,
                            [reply.id]: result.liked,
                          }));
                          if (typeof result.likes === "number") {
                            setLikeCounts((prev) => ({
                              ...prev,
                              [reply.id]: result.likes,
                            }));
                          }
                        }
                      }}
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
