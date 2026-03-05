"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Settings,
  LogOut,
  ShieldCheck,
  PenSquare,
  BookOpen,
  Heart,
  ChevronRight,
  Info,
} from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { StoryCard } from "@/components/story/story-card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { stories } from "@/lib/mock-data";

// ─── Role badge ───────────────────────────────────────────────────────────────

const roleMeta: Record<string, { label: string; bg: string; text: string }> = {
  admin: { label: "Admin", bg: "var(--inverse)", text: "var(--inverse-fg)" },
  ngo: { label: "NGO", bg: "var(--success)", text: "var(--success-subtle)" },
  member: {
    label: "Member",
    bg: "var(--primary-light)",
    text: "var(--primary)",
  },
};

function RoleBadge({ role }: { role?: string }) {
  const meta = roleMeta[role ?? "member"];
  return (
    <span
      className="rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide"
      style={{ background: meta.bg, color: meta.text }}
    >
      {meta.label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <MobileShell title="Profile" subtitle="Loading account">
        <div
          className="p-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          Loading your account...
        </div>
      </MobileShell>
    );
  }

  if (!user) {
    return (
      <MobileShell title="Profile" subtitle="Sign in required">
        <div
          className="p-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          Please sign in to view your profile.
        </div>
      </MobileShell>
    );
  }

  const isAdmin = user.role === "admin";

  const myStories = stories.filter((s) => s.authorId === user.id);
  const totalLikes = myStories.reduce((sum, s) => sum + s.likes, 0);

  return (
    <MobileShell title="Profile" subtitle={user.name}>
      <div className="space-y-5">
        {/* ── Hero card ──────────────────────────────────────────────── */}
        <section
          className="mx-4 rounded-3xl px-5 py-6 shadow-md"
          style={{ background: "var(--inverse)" }}
        >
          <div className="flex items-start gap-4">
            <Image
              src={user.avatar}
              alt={user.name}
              width={72}
              height={72}
              className="rounded-2xl border-2 object-cover shrink-0"
              style={{ borderColor: "var(--primary-mid)" }}
            />
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-lg font-bold"
                style={{ color: "var(--inverse-fg)" }}
              >
                {user.name}
              </p>
              {user.bio ? (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--inverse-muted)" }}
                >
                  {user.bio}
                </p>
              ) : null}
              <div className="mt-2">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { icon: PenSquare, value: myStories.length, label: "Stories" },
              { icon: Heart, value: totalLikes, label: "Likes" },
              { icon: BookOpen, value: 1, label: "Blogs" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-2xl py-3 px-2"
                style={{ background: "var(--inverse-border)" }}
              >
                <Icon size={14} style={{ color: "var(--inverse-muted)" }} />
                <span
                  className="mt-1 text-xl font-extrabold"
                  style={{ color: "var(--inverse-fg)" }}
                >
                  {value}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: "var(--inverse-muted)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Link
              href="/profile/settings"
              className="flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition"
              style={{
                background: "var(--inverse-fg)",
                color: "var(--inverse)",
              }}
            >
              <Settings size={14} /> Edit Profile
            </Link>
            <button
              className="flex items-center justify-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold opacity-60"
              style={{
                borderColor: "var(--inverse-border)",
                color: "var(--inverse-fg)",
              }}
              onClick={() =>
                alert("Sign-out will work once Google Auth is connected.")
              }
            >
              <LogOut size={14} />
            </button>
          </div>
        </section>

        {/* ── Admin panel entry ─────────────────────────────────────── */}
        {isAdmin && (
          <section className="px-4">
            <Link
              href="/admin"
              className="flex items-center gap-4 rounded-2xl p-4 shadow-sm transition hover:opacity-90"
              style={{
                background: "var(--primary)",
                color: "var(--primary-fg)",
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "var(--primary-dark)" }}
              >
                <ShieldCheck size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Admin Dashboard</p>
                <p className="text-xs opacity-80">
                  Manage users, blogs & platform content
                </p>
              </div>
              <ChevronRight size={18} className="shrink-0 opacity-70" />
            </Link>
          </section>
        )}

        {/* ── My stories ────────────────────────────────────────────── */}
        <section className="space-y-3 px-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-base font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              My Stories
            </h2>
            <Link
              href="/write"
              className="text-sm font-medium"
              style={{ color: "var(--primary)" }}
            >
              + Write new
            </Link>
          </div>
          {myStories.length > 0 ? (
            myStories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <div
              className="rounded-2xl border border-dashed p-6 text-center text-sm"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              You haven&apos;t shared a story yet.{" "}
              <Link
                href="/write"
                className="font-semibold underline"
                style={{ color: "var(--primary)" }}
              >
                Write your first
              </Link>
            </div>
          )}
        </section>

        {/* ── Settings shortcut ─────────────────────────────────────── */}
        <section className="px-4 pb-2">
          <Link
            href="/profile/settings"
            className="flex items-center justify-between rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} style={{ color: "var(--muted)" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Account Settings
              </span>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted)" }} />
          </Link>
        </section>

        {/* ── About the NGO ─────────────────────────────────────────── */}
        <section className="px-4 pb-4">
          <Link
            href="/about"
            className="flex items-center justify-between rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <div className="flex items-center gap-3">
              <Info size={18} style={{ color: "var(--primary)" }} />
              <div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  About Tell A Story
                </span>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Mission, team, partners &amp; gallery
                </p>
              </div>
            </div>
            <ChevronRight size={16} style={{ color: "var(--muted)" }} />
          </Link>
        </section>
      </div>
    </MobileShell>
  );
}
