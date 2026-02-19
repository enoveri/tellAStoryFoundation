"use client";

import Image from "next/image";
import { Send } from "lucide-react";
import { useState } from "react";
import { CURRENT_USER } from "@/lib/session";

export function CommentComposer() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setText("");
    setSubmitted(true);
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
          src={CURRENT_USER.avatar}
          alt={CURRENT_USER.name}
          width={28}
          height={28}
          className="shrink-0 rounded-full"
        />
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {CURRENT_USER.name}
        </span>
      </div>

      {/* Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Share what this story meant to you…"
        className="w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none"
        style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "var(--background)" }}
      />

      {/* Submit */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {text.length > 0 ? `${text.length} chars` : "Be kind, be honest"}
        </span>
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition disabled:opacity-40"
          style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
        >
          <Send size={12} /> Post comment
        </button>
      </div>

      {/* Success */}
      {submitted && (
        <p
          className="rounded-lg px-3 py-2 text-xs font-medium"
          style={{ background: "var(--success-subtle)", color: "var(--success-text)" }}
        >
          Comment posted! (UI demo — will persist once auth is connected.)
        </p>
      )}
    </form>
  );
}
