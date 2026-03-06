import Link from "next/link";
import { Bookmark, PenSquare } from "lucide-react";

import { MobileShell } from "@/components/shared/mobile-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { StoryCard } from "@/components/story/story-card";
import { loadSavedStories } from "@/lib/stories-store";

export default async function SavedStoriesPage() {
  const stories = await loadSavedStories();

  return (
    <MobileShell title="Saved Stories" subtitle="Your personal reading list">
      <div
        className="mx-4 flex items-center justify-between rounded-2xl border px-4 py-3"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div className="flex items-center gap-2">
          <Bookmark size={16} style={{ color: "var(--primary)" }} />
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            {stories.length} saved
          </p>
        </div>
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm"
          style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
        >
          <PenSquare size={14} /> Explore
        </Link>
      </div>

      {stories.length > 0
        ? stories.map((story) => <StoryCard key={story.id} story={story} />)
        : null}

      {stories.length === 0 ? (
        <EmptyState
          title="No saved stories yet"
          description="Tap Save on a story to keep it here for later."
        />
      ) : null}
    </MobileShell>
  );
}
