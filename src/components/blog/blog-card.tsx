import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/lib/types";

type BlogCardProps = {
  blog: Blog;
};

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-sky-100 bg-[color:var(--card)] shadow-sm">
      <div className="relative h-40">
        <Image src={blog.cover} alt={blog.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted)]">{blog.publishedAt}</p>
        <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{blog.title}</h2>
        <p className="text-sm text-[color:var(--muted)]">{blog.summary}</p>
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex rounded-full bg-sky-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-sky-800"
        >
          Read blog
        </Link>
      </div>
    </article>
  );
}
