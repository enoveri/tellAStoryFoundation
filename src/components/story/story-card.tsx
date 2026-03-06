"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { InteractionBar } from "@/components/story/interaction-bar";
import type { Story } from "@/lib/types";

type StoryCardMenuAction = {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
};

type StoryCardProps = {
  story: Story;
  menuActions?: StoryCardMenuAction[];
};

export function StoryCard({ story, menuActions = [] }: StoryCardProps) {
  const author = story.author;
  const [menuOpen, setMenuOpen] = useState(false);
  const previewText = story.body?.trim() || story.excerpt;

  return (
    <article className="overflow-hidden border-y border-[color:var(--border)] bg-[color:var(--card)] shadow-sm">
      <div className="flex items-center justify-between px-3 pt-3 text-xs text-[color:var(--muted)]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[color:var(--foreground)]">
            {author?.name ?? "Anonymous"}
          </span>
          <span>{story.createdAt}</span>
        </div>
        {menuActions.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              className="rounded-full p-1 text-[color:var(--muted)] hover:bg-[color:var(--primary-subtle)]"
              aria-label="Story actions"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-7 z-10 min-w-36 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-1 shadow-lg">
                {menuActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      action.onClick();
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition hover:bg-[color:var(--primary-subtle)]"
                    style={{
                      color:
                        action.tone === "danger"
                          ? "#dc2626"
                          : "var(--foreground)",
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="space-y-1 px-3 pt-3">
        <h2 className="text-lg font-semibold leading-tight text-[color:var(--foreground)]">
          {story.title}
        </h2>
        <p className="line-clamp-5 whitespace-pre-line text-sm text-[color:var(--muted)]">
          {previewText}
        </p>
        <Link
          href={`/stories/${story.id}`}
          className="inline-block text-sm font-semibold"
          style={{ color: "var(--primary)" }}
        >
          ...more
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 px-3 pt-2">
        {story.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[color:var(--primary-subtle)] px-2 py-0.5 text-xs font-medium text-[color:var(--muted)]"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="relative mt-3 h-56 w-full overflow-hidden">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      <div className="px-3 pb-3">
        <InteractionBar
          storyId={story.id}
          initialLikes={story.likes}
          commentsCount={story.commentsCount ?? story.comments.length}
          storyTitle={story.title}
          storyExcerpt={story.excerpt}
        />
      </div>
    </article>
  );
}
