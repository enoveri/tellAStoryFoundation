import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { MobileShell } from "@/components/shared/mobile-shell";
import { CommentThread } from "@/components/story/comment-thread";
import { CommentComposer } from "@/components/story/comment-composer";
import { InteractionBar } from "@/components/story/interaction-bar";
import { loadStoryById } from "@/lib/stories-store";

type StoryDetailPageProps = {
  params: Promise<{ storyId: string }>;
};

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://tellastoryfoundation.org"
  );
}

function truncate(value: string, length = 170) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).trimEnd()}...`;
}

export async function generateMetadata({
  params,
}: StoryDetailPageProps): Promise<Metadata> {
  const { storyId } = await params;
  const story = await loadStoryById(storyId);

  if (!story) {
    return {
      title: "Story not found | Tell A Story",
      description: "This story could not be found.",
    };
  }

  const description = truncate(story.excerpt || story.body || "Community story");
  const image = story.images?.[0] || story.image;
  const url = `${getBaseUrl()}/stories/${story.id}`;

  return {
    title: `${story.title} | Tell A Story`,
    description,
    alternates: {
      canonical: `/stories/${story.id}`,
    },
    openGraph: {
      type: "article",
      title: story.title,
      description,
      url,
      images: [
        {
          url: image,
          alt: story.title,
          width: 1200,
          height: 630,
        },
      ],
      siteName: "Tell A Story",
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description,
      images: [image],
    },
  };
}

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const { storyId } = await params;
  const story = await loadStoryById(storyId);

  if (!story) {
    notFound();
  }

  const author = story.author;
  const storyImages = story.images?.length ? story.images : [story.image];

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

      <article className="space-y-4 border-y border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
        {/* Story images */}
        <div className="-mx-4 space-y-3">
          {storyImages.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="overflow-hidden border-y border-[color:var(--border)] bg-black/5"
            >
              <Image
                src={imageUrl}
                alt={`${story.title} image ${index + 1}`}
                width={1600}
                height={1000}
                className="h-auto w-full object-contain"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          ))}
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
        <div className="prose prose-sm max-w-none text-[color:var(--foreground)]/90">
          <ReactMarkdown>{story.body}</ReactMarkdown>
        </div>

        <InteractionBar
          storyId={story.id}
          initialLikes={story.likes}
          commentsCount={story.commentsCount ?? story.comments.length}
          storyTitle={story.title}
          storyExcerpt={story.excerpt}
        />
      </article>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-[color:var(--foreground)]">
          Conversation{" "}
          <span className="text-sm font-normal text-[color:var(--muted)]">
            ({story.commentsCount ?? story.comments.length})
          </span>
        </h3>
        <CommentComposer storyId={story.id} />
        <CommentThread storyId={story.id} comments={story.comments} />
      </section>
    </MobileShell>
  );
}
