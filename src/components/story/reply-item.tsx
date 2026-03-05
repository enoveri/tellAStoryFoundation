import Image from "next/image";
import type { Reply, User } from "@/lib/types";

type ReplyItemProps = {
  reply: Reply;
  user?: User;
};

export function ReplyItem({ reply, user }: ReplyItemProps) {
  const name = reply.userName || user?.name || "Anonymous";
  const avatar =
    reply.userAvatar || user?.avatar || "https://i.pravatar.cc/100";

  return (
    <article className="ml-10 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] p-3">
      <div className="mb-2 flex items-center gap-2">
        <Image
          src={avatar}
          alt={name}
          width={20}
          height={20}
          className="h-5 w-5 rounded-full"
        />
        <span className="text-xs font-semibold text-[color:var(--foreground)]">
          {name}
        </span>
        <span className="text-xs text-[color:var(--muted)]">
          {reply.createdAt}
        </span>
      </div>
      <p className="text-sm text-[color:var(--foreground)]/90">
        {reply.content}
      </p>
    </article>
  );
}
