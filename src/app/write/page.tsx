import { MobileShell } from "@/components/shared/mobile-shell";
import { StoryComposer } from "@/components/story/story-composer";

export default function WritePage() {
  return (
    <MobileShell title="Write Your Story" subtitle="Your voice can inspire someone today.">
      <StoryComposer />
      <p className="text-center text-xs text-[color:var(--muted)]">
        This is a UI-only demo. Authentication and live publishing will be connected next.
      </p>
    </MobileShell>
  );
}
