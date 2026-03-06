"use client";

import { Share2 } from "lucide-react";

function truncate(value: string, length = 140) {
  if (value.length <= length) return value;
  return `${value.slice(0, length - 1).trimEnd()}...`;
}

export function ShareButton({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition"
      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      onClick={() => {
        if (navigator.share) {
          void navigator.share({
            title,
            text: description ? truncate(description) : undefined,
            url: window.location.href,
          });
        } else {
          const content = description
            ? `${title}\n${truncate(description)}\n${window.location.href}`
            : `${title}\n${window.location.href}`;
          void navigator.clipboard?.writeText(content);
        }
      }}
    >
      <Share2 size={16} /> Share this event
    </button>
  );
}
