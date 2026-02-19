import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { HeroCarousel } from "@/components/shared/hero-carousel";
import { StoryCard } from "@/components/story/story-card";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Testimonials } from "@/components/home/testimonials";
import { ContactHome } from "@/components/home/contact-home";
import { stories, blogs } from "@/lib/mock-data";

export default function Home() {
  return (
    <MobileShell title="Home" subtitle="Welcome to Tell A Story">
      <section className="space-y-6">
        <HeroCarousel />

        {/* Top stories */}
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

        {/* Blog previews */}
        <section className="space-y-3 px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">From the blog</h2>
            <Link href="/blog" className="text-sm font-medium text-[color:var(--muted)] hover:text-sky-700">
              View all
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl border border-sky-100 bg-[color:var(--card)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-32 w-full">
                  <Image src={blog.cover} alt={blog.title} fill className="object-cover" sizes="256px" />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600">{blog.publishedAt}</p>
                  <p className="text-sm font-semibold leading-tight text-[color:var(--foreground)] line-clamp-2">{blog.title}</p>
                  <p className="text-xs leading-relaxed text-[color:var(--muted)] line-clamp-2">{blog.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-sky-700">
                    Read more <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
            {/* View all card */}
            <Link
              href="/blog"
              className="flex w-32 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-sky-200 bg-sky-50 text-center text-xs font-semibold text-sky-700 hover:bg-sky-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
                <ArrowRight size={14} />
              </div>
              All blogs
            </Link>
          </div>
        </section>

        <Testimonials />

        <ContactHome />
      </section>
    </MobileShell>
  );
}
