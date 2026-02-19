import Link from "next/link";
import { MobileShell } from "@/components/shared/mobile-shell";
import { HeroCarousel } from "@/components/shared/hero-carousel";
import { StoryCard } from "@/components/story/story-card";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Testimonials } from "@/components/home/testimonials";
import { ContactHome } from "@/components/home/contact-home";
import { stories } from "@/lib/mock-data";

export default function Home() {
  return (
    <MobileShell title="Home" subtitle="Welcome to Tell A Story">
      <section className="space-y-6">
        <HeroCarousel />

        {/* Featured stories */}
        <section className="space-y-3 px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top stories</h2>
            <Link href="/feed" className="text-sm font-medium text-[color:var(--muted)] hover:text-sky-700">
              View all
            </Link>
          </div>
          {stories.slice(0, 2).map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </section>

        <UpcomingEvents />

        <Testimonials />

        <ContactHome />
      </section>
    </MobileShell>
  );
}
