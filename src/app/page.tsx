import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { StoryCard } from "@/components/story/story-card";
import { stories } from "@/lib/mock-data";

export default function Home() {
  return (
    <MobileShell title="Home" subtitle="Welcome to Tell A Story">
      <section className="space-y-5">
        <section className="rounded-3xl bg-gradient-to-br from-sky-200 via-cyan-100 to-slate-100 p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--foreground)]">
            <HeartHandshake size={14} /> Tell A Story NGO
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-[color:var(--foreground)]">
            Share your story. Inspire someone else.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]/85">
            A safe, warm community where people write their journeys, support each other through comments, and amplify hope.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white"
            >
              Explore stories <ArrowRight size={16} />
            </Link>
            <Link href="/write" className="inline-flex rounded-full border border-[color:var(--foreground)]/20 px-4 py-2 text-sm font-semibold">
              Write yours
            </Link>
          </div>
        </section>

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

        <section className="rounded-2xl border border-sky-100 bg-[color:var(--card)] p-4 text-sm text-[color:var(--muted)]">
          Authentication, profile management, and database connectivity are intentionally deferred for this phase. The focus here is polished UI/UX.
        </section>
      </section>
    </MobileShell>
  );
}
