import { MobileShell } from "@/components/shared/mobile-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { StoryCard } from "@/components/story/story-card";
import { stories } from "@/lib/mock-data";

export default function FeedPage() {
  return (
    <MobileShell title="Community Stories" subtitle="Read, react, and encourage others.">
      {stories.length ? stories.map((story) => <StoryCard key={story.id} story={story} />) : null}
      {stories.length === 0 ? (
        <EmptyState title="No stories yet" description="The feed will appear here as soon as members start sharing." />
      ) : null}
    </MobileShell>
  );
}
