import Link from "next/link";
import Image from "next/image";
import {
  Users,
  BookOpen,
  PenSquare,
  ShieldCheck,
  CalendarDays,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { loadAdminOverview, loadRecentMembers } from "@/lib/admin-store";
import { getCurrentUserProfile } from "@/lib/auth";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  href,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center rounded-2xl p-4 shadow-sm transition hover:opacity-90"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <Icon size={18} style={{ color: "var(--primary)" }} />
      <span
        className="mt-1 text-2xl font-extrabold"
        style={{ color: "var(--foreground)" }}
      >
        {value}
      </span>
      <span className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </span>
    </Link>
  );
}

// ─── Quick action row ─────────────────────────────────────────────────────────

function Action({
  icon: Icon,
  label,
  description,
  href,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl p-4 shadow-sm transition hover:opacity-90"
      style={{
        background: accent ? "var(--primary)" : "var(--card)",
        color: accent ? "var(--primary-fg)" : "var(--foreground)",
        border: accent ? "none" : "1px solid var(--border)",
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: accent ? "var(--primary-dark)" : "var(--primary-light)",
        }}
      >
        <Icon
          size={18}
          style={{ color: accent ? "var(--primary-fg)" : "var(--primary)" }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-xs opacity-70">{description}</p>
      </div>
      <ChevronRight size={16} className="shrink-0 opacity-60" />
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const currentUser = await getCurrentUserProfile();
  const isAdmin = currentUser?.role === "admin";

  const [overview, recentMembers] = await Promise.all([
    loadAdminOverview(),
    loadRecentMembers(4),
  ]);

  if (!isAdmin) {
    return (
      <MobileShell title="Admin" subtitle="Restricted">
        <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
          <ShieldCheck size={48} style={{ color: "var(--muted)" }} />
          <p className="font-semibold" style={{ color: "var(--foreground)" }}>
            Admin access required
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Your account doesn&apos;t have admin privileges.
          </p>
          <Link
            href="/profile"
            className="rounded-full px-5 py-2 text-sm font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            Go to Profile
          </Link>
        </div>
      </MobileShell>
    );
  }

  const memberCount = overview.membersCount;

  return (
    <MobileShell title="Admin Dashboard" subtitle="Platform management">
      <div className="space-y-6">
        {/* ── Stats ────────────────────────────────────────────────── */}
        <section className="px-4">
          <h2
            className="mb-3 text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Overview
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <StatCard
              icon={Users}
              value={overview.usersCount}
              label="Users"
              href="/admin/users"
            />
            <StatCard
              icon={Sparkles}
              value={overview.storiesCount}
              label="Stories"
              href="/feed"
            />
            <StatCard
              icon={BookOpen}
              value={overview.blogsCount}
              label="Blogs"
              href="/admin/blogs"
            />
            <StatCard
              icon={CalendarDays}
              value={overview.eventsCount}
              label="Events"
              href="/admin/events"
            />
          </div>
        </section>

        {/* ── Quick actions ─────────────────────────────────────────── */}
        <section className="space-y-3 px-4">
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--muted)" }}
          >
            Quick Actions
          </h2>
          <Action
            icon={PenSquare}
            label="Write New Blog Post"
            description="Publish a blog as the organisation"
            href="/blog/new"
            accent
          />
          <Action
            icon={BookOpen}
            label="Manage Blogs"
            description="Edit or remove existing posts"
            href="/admin/blogs"
          />
          <Action
            icon={Info}
            label="Edit About Page"
            description="Update mission, team, gallery &amp; partners"
            href="/admin/about"
          />
          <Action
            icon={Users}
            label="Manage Users"
            description={`${memberCount} members registered`}
            href="/admin/users"
          />
          <Action
            icon={CalendarDays}
            label="Manage Events"
            description="Create events and review applicants"
            href="/admin/events"
          />
        </section>

        {/* ── Recent users ─────────────────────────────────────────── */}
        <section className="px-4">
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              Recent Members
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-semibold"
              style={{ color: "var(--primary)" }}
            >
              See all
            </Link>
          </div>
          <div
            className="divide-y rounded-2xl border"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {recentMembers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                <Image
                  src={u.avatar}
                  alt={u.name}
                  width={36}
                  height={36}
                  className="rounded-full shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {u.name}
                  </p>
                  <p
                    className="text-xs capitalize"
                    style={{ color: "var(--muted)" }}
                  >
                    {u.role ?? "member"}
                    {u.joinedAt ? ` · joined ${u.joinedAt}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
