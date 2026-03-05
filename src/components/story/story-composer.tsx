"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const storySchema = z.object({
  title: z.string().min(8, "Title should be at least 8 characters"),
  tag: z.string().min(2, "Add a short tag"),
  excerpt: z.string().min(20, "Give a short intro"),
  body: z.string().min(80, "Tell us a bit more of your story"),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function StoryComposer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
  });

  const onSubmit = () => {};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm"
    >
      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">
          Story title
        </label>
        <input
          {...register("title")}
          placeholder="A moment that changed my path"
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm outline-none ring-[color:var(--border)] placeholder:text-[color:var(--muted)] focus:ring"
        />
        {errors.title ? (
          <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">
          Tag
        </label>
        <input
          {...register("tag")}
          placeholder="community"
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm outline-none ring-[color:var(--border)] placeholder:text-[color:var(--muted)] focus:ring"
        />
        {errors.tag ? (
          <p className="mt-1 text-xs text-rose-500">{errors.tag.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">
          Short intro
        </label>
        <textarea
          {...register("excerpt")}
          rows={3}
          placeholder="What happened and why it matters"
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm outline-none ring-[color:var(--border)] placeholder:text-[color:var(--muted)] focus:ring"
        />
        {errors.excerpt ? (
          <p className="mt-1 text-xs text-rose-500">{errors.excerpt.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">
          Your story
        </label>
        <textarea
          {...register("body")}
          rows={8}
          placeholder="Share your story from the heart..."
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm outline-none ring-[color:var(--border)] placeholder:text-[color:var(--muted)] focus:ring"
        />
        {errors.body ? (
          <p className="mt-1 text-xs text-rose-500">{errors.body.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-fg)] shadow-sm transition hover:bg-[color:var(--primary-dark)]"
      >
        Publish (UI demo)
      </button>

      {isSubmitSuccessful ? (
        <div className="space-y-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--success-subtle)] p-4">
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--success-text)" }}
          >
            Story submitted! 🎉
          </p>
          <p className="text-xs" style={{ color: "var(--success-text)" }}>
            Your story has been captured. It will go live once publishing is
            connected.
          </p>
          <div className="flex gap-3 pt-1">
            <Link
              href="/feed"
              className="rounded-full px-4 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-fg)",
              }}
            >
              View community stories
            </Link>
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full border px-4 py-1.5 text-xs font-semibold"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Write another
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
