import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { CommentThread } from "@/components/story/comment-thread";
import { CommentComposer } from "@/components/story/comment-composer";
import { InteractionBar } from "@/components/story/interaction-bar";
import { findStory, findUser } from "@/lib/mock-data";

type StoryDetailPageProps = {
  params: Promise<{ storyId: string }>;
};

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const { storyId } = await params;
  const story = findStory(storyId);

  if (!story) {
    notFound();
  }

  const author = findUser(story.authorId);

  return (
    <MobileShell
      title="Story"
      subtitle={author ? `By ${author.name}` : "By community member"}
    >
      {/* Back */}
      <div className="px-1">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1 text-sm font-medium"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft size={15} /> Community Stories
        </Link>
      </div>

      <article className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
        {/* Cover */}
        <div className="relative h-52 overflow-hidden rounded-xl">
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[color:var(--primary-subtle)] px-2 py-0.5 text-xs font-medium text-[color:var(--muted)]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
          {story.title}
        </h2>

        {/* Author meta */}
        {author && (
          <div className="flex items-center gap-3 border-b border-[color:var(--border)] pb-4">
            <Image
              src={author.avatar}
              alt={author.name}
              width={36}
              height={36}
              className="shrink-0 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                {author.name}
              </p>
              {author.bio && (
                <p className="text-xs text-[color:var(--muted)]">
                  {author.bio}
                </p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-1 text-xs text-[color:var(--muted)]">
              <CalendarDays size={11} />
              {story.createdAt}
            </div>
          </div>
        )}

        {/* Body */}
        <p className="whitespace-pre-line text-sm leading-7 text-[color:var(--foreground)]/90">
          {story.body}
        </p>

        <InteractionBar
          initialLikes={story.likes}
          commentsCount={story.comments.length}
        />
      </article>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-[color:var(--foreground)]">
          Conversation{" "}
          <span className="text-sm font-normal text-[color:var(--muted)]">
            ({story.comments.length})
          </span>
        </h3>
        <CommentComposer />
        <CommentThread comments={story.comments} />
      </section>
    </MobileShell>
  );
}
