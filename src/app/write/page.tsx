import { MobileShell } from "@/components/shared/mobile-shell";
import { StoryComposer } from "@/components/story/story-composer";
import { loadEditableStory } from "@/lib/stories-store";

type WritePageProps = {
  searchParams: Promise<{ storyId?: string }>;
};

export default async function WritePage({ searchParams }: WritePageProps) {
  const { storyId } = await searchParams;
  const editableStory = storyId ? await loadEditableStory(storyId) : null;

  return (
    <MobileShell
      title={editableStory ? "Edit Story" : "Write Your Story"}
      subtitle={
        editableStory
          ? "Update your story and publish when ready."
          : "Your voice can inspire someone today."
      }
    >
      <StoryComposer initialStory={editableStory || undefined} />
      <p className="text-center text-xs text-[color:var(--muted)]">
        Drafts stay private to you until you publish.
      </p>
    </MobileShell>
  );
}
