import Link from "next/link";
import { PenSquare } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { StoryCard } from "@/components/story/story-card";
import { stories } from "@/lib/mock-data";

export default function FeedPage() {
  return (
    <MobileShell title="Community Stories" subtitle="Read, react, and encourage others.">
      {/* Stats + write shortcut */}
      <div className="flex items-center justify-between rounded-2xl border px-4 py-3"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <div>
          <p className="text-lg font-bold" style={{ color: "var(--foreground)" }}>{stories.length}</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>stories shared</p>
        </div>
        <Link
          href="/write"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm"
          style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
        >
          <PenSquare size={14} /> Share yours
        </Link>
      </div>

      {stories.length ? stories.map((story) => <StoryCard key={story.id} story={story} />) : null}
      {stories.length === 0 ? (
        <EmptyState title="No stories yet" description="The feed will appear here as soon as members start sharing." />
      ) : null}
    </MobileShell>
  );
}
