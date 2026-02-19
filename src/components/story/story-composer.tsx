"use client";

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
    formState: { errors, isSubmitSuccessful },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
  });

  const onSubmit = () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-sky-100 bg-[color:var(--card)] p-4 shadow-sm">
      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">Story title</label>
        <input
          {...register("title")}
          placeholder="A moment that changed my path"
          className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 text-sm outline-none ring-sky-200 placeholder:text-sky-300 focus:ring"
        />
        {errors.title ? <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">Tag</label>
        <input
          {...register("tag")}
          placeholder="community"
          className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 text-sm outline-none ring-sky-200 placeholder:text-sky-300 focus:ring"
        />
        {errors.tag ? <p className="mt-1 text-xs text-rose-500">{errors.tag.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">Short intro</label>
        <textarea
          {...register("excerpt")}
          rows={3}
          placeholder="What happened and why it matters"
          className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 text-sm outline-none ring-sky-200 placeholder:text-sky-300 focus:ring"
        />
        {errors.excerpt ? <p className="mt-1 text-xs text-rose-500">{errors.excerpt.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-[color:var(--foreground)]">Your story</label>
        <textarea
          {...register("body")}
          rows={8}
          placeholder="Share your story from the heart..."
          className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 text-sm outline-none ring-sky-200 placeholder:text-sky-300 focus:ring"
        />
        {errors.body ? <p className="mt-1 text-xs text-rose-500">{errors.body.message}</p> : null}
      </div>

      <button type="submit" className="w-full rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800">
        Publish (UI demo)
      </button>

      {isSubmitSuccessful ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Great! Story captured in UI mode. We will connect real save later.
        </p>
      ) : null}
    </form>
  );
}
