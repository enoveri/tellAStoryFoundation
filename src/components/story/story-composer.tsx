"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { createStory } from "@/lib/stories-client";

const storySchema = z.object({
  title: z.string().min(8, "Title should be at least 8 characters"),
  tag: z.string().min(2, "Add a short tag"),
  excerpt: z.string().min(20, "Give a short intro"),
  body: z.string().min(80, "Tell us a bit more of your story"),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function StoryComposer() {
  const router = useRouter();
  const [publishError, setPublishError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
  });

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const onSubmit = async (values: StoryFormValues) => {
    setPublishError(null);

    const result = await createStory({ ...values, imageFiles });
    if (result.error) {
      setPublishError(result.error);
      return;
    }

    if (result.storyId) {
      router.push(`/stories/${result.storyId}`);
      router.refresh();
      return;
    }

    reset();
  };

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
          Add pictures (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--primary-light)] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[color:var(--primary)]"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setImageFiles(files);

            setImagePreviews((currentPreviews) => {
              currentPreviews.forEach((preview) => URL.revokeObjectURL(preview));
              return files.map((file) => URL.createObjectURL(file));
            });
          }}
        />
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          The first image becomes the cover. All selected images appear inside the story.
        </p>
        {imagePreviews.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {imagePreviews.map((preview, index) => (
              <div
                key={preview}
                className="relative h-36 overflow-hidden rounded-xl border border-[color:var(--border)]"
              >
                <Image
                  src={preview}
                  alt={`Selected story image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {index === 0 ? (
                  <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Cover
                  </span>
                ) : null}
              </div>
            ))}
          </div>
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
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-fg)] shadow-sm transition hover:bg-[color:var(--primary-dark)]"
      >
        {isSubmitting ? "Publishing..." : "Publish story"}
      </button>

      {publishError ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {publishError}
        </p>
      ) : null}

      {isSubmitSuccessful ? (
        <div className="space-y-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--success-subtle)] p-4">
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--success-text)" }}
          >
            Story submitted! 🎉
          </p>
          <p className="text-xs" style={{ color: "var(--success-text)" }}>
            Your story has been published and is now visible in the community
            feed.
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
