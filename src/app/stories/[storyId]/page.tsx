import { notFound } from "next/navigation";
import Image from "next/image";
import { MobileShell } from "@/components/shared/mobile-shell";
import { CommentThread } from "@/components/story/comment-thread";
import { InteractionBar } from "@/components/story/interaction-bar";
import { findStory, findUser } from "@/lib/mock-data";

type StoryDetailPageProps = {
  params: Promise<{ storyId: string }>;
};

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { storyId } = await params;
  const story = findStory(storyId);

  if (!story) {
    notFound();
  }

  const author = findUser(story.authorId);

  return (
    <MobileShell title="Story Detail" subtitle={author ? `By ${author.name}` : "By community member"}>
      <article className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
        <div className="relative h-52 overflow-hidden rounded-xl">
          <Image src={story.image} alt={story.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" />
        </div>
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{story.title}</h2>
        <p className="text-sm leading-7 text-[color:var(--foreground)]/90">{story.body}</p>
        <InteractionBar initialLikes={story.likes} commentsCount={story.comments.length} />
      </article>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-[color:var(--foreground)]">Conversation</h3>
        <CommentThread comments={story.comments} />
      </section>
    </MobileShell>
  );
}
