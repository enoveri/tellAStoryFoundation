"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Bold, Heading2, Italic, List } from "lucide-react";
import { createStory } from "@/lib/stories-client";

const storySchema = z.object({
  title: z.string().min(1, "Title is required"),
  tag: z.string().min(1, "Add a short tag"),
  excerpt: z.string().min(1, "Give a short intro"),
  body: z.string().min(1, "Tell us a bit more of your story"),
});

type StoryFormValues = z.infer<typeof storySchema>;

type StoryComposerProps = {
  initialStory?: {
    id: string;
    title: string;
    excerpt: string;
    body: string;
    tag: string;
    status: "draft" | "published";
  };
};

export function StoryComposer({ initialStory }: StoryComposerProps) {
  const router = useRouter();
  const [publishError, setPublishError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitMode, setSubmitMode] = useState<"draft" | "published">(
    initialStory?.status || "published",
  );
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: initialStory?.title || "",
      tag: initialStory?.tag || "",
      excerpt: initialStory?.excerpt || "",
      body: initialStory?.body || "",
    },
  });
  const bodyField = register("body");

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const wrapSelection = (prefix: string, suffix = prefix) => {
    const textarea = bodyRef.current;
    const current = getValues("body");

    if (!textarea) {
      setValue("body", `${current}\n${prefix}text${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = current.slice(start, end) || "text";
    const next = `${current.slice(0, start)}${prefix}${selected}${suffix}${current.slice(end)}`;

    setValue("body", next, { shouldDirty: true, shouldTouch: true });
  };

  const applyLinePrefix = (prefix: string) => {
    const current = getValues("body");
    const next = `${current}\n${prefix} `;
    setValue("body", next.trimStart(), {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit = async (values: StoryFormValues) => {
    setPublishError(null);

    if (submitMode === "published") {
      if (values.title.trim().length < 8) {
        setPublishError(
          "Title should be at least 8 characters before publishing.",
        );
        return;
      }

      if (values.excerpt.trim().length < 20) {
        setPublishError(
          "Give a short intro of at least 20 characters before publishing.",
        );
        return;
      }

      if (values.body.trim().length < 80) {
        setPublishError(
          "Story body should be at least 80 characters before publishing.",
        );
        return;
      }
    }

    const result = await createStory({
      storyId: initialStory?.id,
      ...values,
      imageFiles,
      status: submitMode,
    });
    if (result.error) {
      setPublishError(result.error);
      return;
    }

    if (result.storyId) {
      if (submitMode === "draft") {
        router.push("/profile");
      } else {
        router.push(`/stories/${result.storyId}`);
      }
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
              currentPreviews.forEach((preview) =>
                URL.revokeObjectURL(preview),
              );
              return files.map((file) => URL.createObjectURL(file));
            });
          }}
        />
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          The first image becomes the cover. All selected images appear inside
          the story.
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
        <div className="mb-2 mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => wrapSelection("**")}
            className="rounded-lg border border-[color:var(--border)] px-2 py-1 text-xs"
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("*")}
            className="rounded-lg border border-[color:var(--border)] px-2 py-1 text-xs"
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => applyLinePrefix("##")}
            className="rounded-lg border border-[color:var(--border)] px-2 py-1 text-xs"
            title="Heading"
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => applyLinePrefix("-")}
            className="rounded-lg border border-[color:var(--border)] px-2 py-1 text-xs"
            title="List"
          >
            <List size={14} />
          </button>
        </div>
        <textarea
          {...bodyField}
          ref={(el) => {
            bodyField.ref(el);
            bodyRef.current = el;
          }}
          rows={8}
          placeholder="Share your story from the heart..."
          className="mt-1 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm outline-none ring-[color:var(--border)] placeholder:text-[color:var(--muted)] focus:ring"
        />
        {errors.body ? (
          <p className="mt-1 text-xs text-rose-500">{errors.body.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setSubmitMode("draft")}
          className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] shadow-sm transition"
        >
          {isSubmitting && submitMode === "draft" ? "Saving..." : "Save draft"}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setSubmitMode("published")}
          className="w-full rounded-xl bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-fg)] shadow-sm transition hover:bg-[color:var(--primary-dark)]"
        >
          {isSubmitting && submitMode === "published"
            ? "Publishing..."
            : "Publish story"}
        </button>
      </div>

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
