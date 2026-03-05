import { MobileShell } from "@/components/shared/mobile-shell";
import { BlogCard } from "@/components/blog/blog-card";
import { blogs } from "@/lib/mock-data";
import { getCurrentUserProfile } from "@/lib/auth";
import Link from "next/link";

export default async function BlogPage() {
  const currentUser = await getCurrentUserProfile();
  const isAdmin = currentUser?.role === "admin";
  return (
    <MobileShell
      title="Tell A Story Blogs"
      subtitle="Official updates and insights from the NGO."
    >
      {isAdmin && (
        <Link
          href="/blog/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white shadow-sm"
        >
          ✏️ Write NGO Blog
        </Link>
      )}
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </MobileShell>
  );
}
