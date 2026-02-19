import Image from "next/image";
import { notFound } from "next/navigation";
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
      <article className="space-y-4 rounded-2xl border border-sky-100 bg-[color:var(--card)] p-4 shadow-sm">
        <div className="relative h-48 overflow-hidden rounded-xl">
          <Image src={blog.cover} alt={blog.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 420px" />
        </div>
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{blog.title}</h2>
        <BlogContent markdown={blog.content} />
      </article>
    </MobileShell>
  );
}
