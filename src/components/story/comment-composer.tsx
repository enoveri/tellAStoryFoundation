"use client";

import Image from "next/image";
import { Send } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createStoryComment } from "@/lib/stories-client";

export function CommentComposer({ storyId }: { storyId?: string }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user } = useCurrentUser();

  const displayName = user?.name || "Guest";
  const displayAvatar = user?.avatar || "https://i.pravatar.cc/100";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError(null);

    if (storyId) {
      setIsSaving(true);
      const result = await createStoryComment(storyId, text.trim());

      if (result.error) {
        setError(result.error);
        setIsSaving(false);
        return;
      }
    }

    setText("");
    setSubmitted(true);
    setIsSaving(false);
    router.refresh();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border p-4"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      {/* Author row */}
      <div className="flex items-center gap-2">
        <Image
          src={displayAvatar}
          alt={displayName}
          width={28}
          height={28}
          className="shrink-0 rounded-full"
        />
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {displayName}
        </span>
      </div>

      {/* Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Share what this story meant to you…"
        className="w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none"
        style={{
          borderColor: "var(--border)",
          color: "var(--foreground)",
          background: "var(--background)",
        }}
      />

      {/* Submit */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {text.length > 0 ? `${text.length} chars` : "Be kind, be honest"}
        </span>
        <button
          type="submit"
          disabled={!text.trim() || isSaving}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-40"
          style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
        >
          <Send size={12} /> {isSaving ? "Posting..." : "Post comment"}
        </button>
      </div>

      {error ? (
        <p
          className="rounded-lg px-3 py-2 text-xs font-medium"
          style={{ background: "#fee2e2", color: "#991b1b" }}
        >
          {error}
        </p>
      ) : null}

      {/* Success */}
      {submitted && (
        <p
          className="rounded-lg px-3 py-2 text-xs font-medium"
          style={{
            background: "var(--success-subtle)",
            color: "var(--success-text)",
          }}
        >
          Comment posted! (UI demo — will persist once auth is connected.)
        </p>
      )}
    </form>
  );
}
