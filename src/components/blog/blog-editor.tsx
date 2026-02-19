"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const initialMarkdown = `## New Blog Draft\n\nWrite your blog content in markdown.\n\n- Share program highlights\n- Celebrate community wins\n- Invite supporters to act`;

export function BlogEditor() {
  const [title, setTitle] = useState("Community Update");
  const [summary, setSummary] = useState("A short summary of this blog post.");
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-2xl border border-sky-100 bg-[color:var(--card)] p-4 shadow-sm">
        <h2 className="text-base font-semibold text-[color:var(--foreground)]">Compose blog</h2>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-xl border border-sky-200 px-3 py-2 text-sm outline-none ring-sky-200 focus:ring"
          placeholder="Blog title"
        />
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={2}
          className="w-full rounded-xl border border-sky-200 px-3 py-2 text-sm outline-none ring-sky-200 focus:ring"
          placeholder="Short summary"
        />
        <textarea
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          rows={10}
          className="w-full rounded-xl border border-sky-200 px-3 py-2 text-sm outline-none ring-sky-200 focus:ring"
          placeholder="Write markdown content"
        />
        <button className="w-full rounded-xl bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white">
          Save Draft (UI demo)
        </button>
      </section>

      <section className="space-y-2 rounded-2xl border border-sky-100 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Live preview</p>
        <h3 className="text-lg font-semibold text-[color:var(--foreground)]">{title}</h3>
        <p className="text-sm text-[color:var(--muted)]">{summary}</p>
        <article className="space-y-2 text-sm leading-7 text-[color:var(--foreground)]/90">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </article>
      </section>
    </div>
  );
}
