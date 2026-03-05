import { MobileShell } from "@/components/shared/mobile-shell";
import { StoryComposer } from "@/components/story/story-composer";

export default function WritePage() {
  return (
    <MobileShell
      title="Write Your Story"
      subtitle="Your voice can inspire someone today."
    >
      <StoryComposer />
      <p className="text-center text-xs text-[color:var(--muted)]">
        Published stories appear in the community feed immediately.
      </p>
    </MobileShell>
  );
}
