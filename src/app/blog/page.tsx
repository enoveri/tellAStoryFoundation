import { MobileShell } from "@/components/shared/mobile-shell";
import { BlogCard } from "@/components/blog/blog-card";
import { blogs } from "@/lib/mock-data";
import Link from "next/link";

export default function BlogPage() {
  return (
    <MobileShell title="Tell A Story Blogs" subtitle="Official updates and insights from the NGO.">
      <Link
        href="/blog/new"
        className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white"
      >
        Write NGO Blog
      </Link>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </MobileShell>
  );
}
