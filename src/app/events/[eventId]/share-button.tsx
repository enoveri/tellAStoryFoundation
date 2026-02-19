"use client";

import { Share2 } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition"
      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      onClick={() => {
        if (navigator.share) {
          navigator.share({ title, url: window.location.href });
        } else {
          navigator.clipboard?.writeText(window.location.href);
        }
      }}
    >
      <Share2 size={16} /> Share this event
    </button>
  );
}
