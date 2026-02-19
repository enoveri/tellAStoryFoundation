"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, PenSquare, Trash2, Eye } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { blogs } from "@/lib/mock-data";
import { CURRENT_USER } from "@/lib/session";

export default function AdminBlogsPage() {
  const isAdmin = CURRENT_USER.role === "admin";

  if (!isAdmin) {
    return (
      <MobileShell title="Blogs" subtitle="Admin only">
        <div className="p-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          Admin access required.{" "}
          <Link href="/profile" className="font-semibold underline" style={{ color: "var(--primary)" }}>Go back</Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell title="Manage Blogs" subtitle={`${blogs.length} published`}>
      <div className="space-y-4">

        {/* Back + New */}
        <div className="flex items-center justify-between px-4 pt-1">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--primary)" }}>
            <ChevronLeft size={16} /> Admin Dashboard
          </Link>
          <Link
            href="/blog/new"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            <PenSquare size={13} /> New post
          </Link>
        </div>

        {/* Blog list */}
        <div className="space-y-3 px-4">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="overflow-hidden rounded-2xl border shadow-sm"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="relative h-32 w-full">
                <Image src={blog.cover} alt={blog.title} fill className="object-cover" sizes="400px" />
                <span
                  className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: "var(--success)", color: "var(--success-subtle)" }}
                >
                  Published
                </span>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>{blog.publishedAt}</p>
                <h2 className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>{blog.title}</h2>
                <p className="text-sm line-clamp-2" style={{ color: "var(--muted)" }}>{blog.summary}</p>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border py-2 text-xs font-semibold transition"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    <Eye size={12} /> View
                  </Link>
                  <Link
                    href={`/blog/new?edit=${blog.slug}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition"
                    style={{ background: "var(--primary-light)", color: "var(--primary)" }}
                  >
                    <PenSquare size={12} /> Edit
                  </Link>
                  <button
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition"
                    style={{ background: "#fff1f2", color: "#e11d48" }}
                    onClick={() => alert("Delete will work once backend is connected.")}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="px-4 pb-2">
          <Link
            href="/blog/new"
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-sm"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            <PenSquare size={15} /> Write a new blog post
          </Link>
        </div>

      </div>
    </MobileShell>
  );
}
