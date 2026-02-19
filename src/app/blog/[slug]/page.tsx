import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { BlogContent } from "@/components/blog/blog-content";
import { MobileShell } from "@/components/shared/mobile-shell";
import { findBlog } from "@/lib/mock-data";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = findBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <MobileShell title="Blog" subtitle={blog.publishedAt}>
      {/* Back */}
      <div className="px-1">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--primary)" }}>
          <ArrowLeft size={15} /> All Blogs
        </Link>
      </div>

      <article className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
        <div className="relative h-48 overflow-hidden rounded-xl">
          <Image src={blog.cover} alt={blog.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" />
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
          <CalendarDays size={12} style={{ color: "var(--primary)" }} />
          {blog.publishedAt} &bull; Tell A Story Foundation
        </div>
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{blog.title}</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{blog.summary}</p>
        <BlogContent markdown={blog.content} />
      </article>
    </MobileShell>
  );
}
