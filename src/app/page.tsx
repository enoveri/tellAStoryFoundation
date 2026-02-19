import Link from "next/link";
import { MobileShell } from "@/components/shared/mobile-shell";
import { HeroCarousel } from "@/components/shared/hero-carousel";
import { StoryCard } from "@/components/story/story-card";
import { stories } from "@/lib/mock-data";

export default function Home() {
  return (
    <MobileShell title="Home" subtitle="Welcome to Tell A Story">
      <section className="space-y-5">
        <HeroCarousel />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Featured stories</h2>
            <Link href="/feed" className="text-sm font-medium text-[color:var(--muted)]">
              View all
            </Link>
          </div>
          {stories.slice(0, 2).map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </section>
      </section>
    </MobileShell>
  );
}
