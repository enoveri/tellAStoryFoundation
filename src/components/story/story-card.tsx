import Image from "next/image";
import Link from "next/link";
import { InteractionBar } from "@/components/story/interaction-bar";
import { findUser } from "@/lib/mock-data";
import type { Story } from "@/lib/types";

type StoryCardProps = {
  story: Story;
};

export function StoryCard({ story }: StoryCardProps) {
  const author = findUser(story.authorId);

  return (
    <article className="space-y-3 rounded-2xl border border-sky-100 bg-[color:var(--card)] p-3 shadow-sm">
      <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--foreground)]">{author?.name ?? "Anonymous"}</span>
        <span>{story.createdAt}</span>
      </div>

      <div className="relative h-44 overflow-hidden rounded-xl">
        <Image src={story.image} alt={story.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold leading-tight text-[color:var(--foreground)]">{story.title}</h2>
        <p className="line-clamp-2 text-sm text-[color:var(--muted)]">{story.excerpt}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {story.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-[color:var(--muted)]">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/stories/${story.id}`}
          className="rounded-full bg-[color:var(--foreground)] px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Read story
        </Link>
      </div>

      <InteractionBar initialLikes={story.likes} commentsCount={story.comments.length} />
    </article>
  );
}
