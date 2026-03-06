"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Search,
  Shield,
  UserCheck,
  UserX,
  MoreVertical,
} from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import {
  fetchAdminUsers,
  promoteUserToAdmin,
  setUserSuspended,
} from "@/lib/admin-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { User } from "@/lib/types";

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
      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ background: meta.bg, color: meta.text }}
    >
      {meta.label}
    </span>
  );
}

export default function AdminUsersPage() {
  const { user, isLoading } = useCurrentUser();
  const isAdmin = user?.role === "admin";
  const [query, setQuery] = useState("");
  const [actionUser, setActionUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const nextUsers = await fetchAdminUsers();

      if (!mounted) return;
      setUsers(nextUsers);
      setIsUsersLoading(false);
    };

    if (isAdmin) {
      void load();
      return;
    }

    setIsUsersLoading(false);

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const reloadUsers = async () => {
    const nextUsers = await fetchAdminUsers();
    setUsers(nextUsers);
  };

  const handlePromote = async (target: User) => {
    const ok = confirm(`Promote ${target.name} to admin?`);
    if (!ok) return;

    setPendingUserId(target.id);
    setStatus(null);
    const result = await promoteUserToAdmin(target.id);

    if (result.error) {
      setStatus(`Action failed: ${result.error}`);
      setPendingUserId(null);
      return;
    }

    await reloadUsers();
    setPendingUserId(null);
    setActionUser(null);
    setStatus(`${target.name} is now an admin.`);
  };

  const handleSuspendToggle = async (target: User) => {
    const suspend = !target.isSuspended;
    const ok = confirm(
      suspend ? `Suspend ${target.name}?` : `Unsuspend ${target.name}?`,
    );

    if (!ok) return;

    setPendingUserId(target.id);
    setStatus(null);
    const result = await setUserSuspended(target.id, suspend);

    if (result.error) {
      setStatus(`Action failed: ${result.error}`);
      setPendingUserId(null);
      return;
    }

    await reloadUsers();
    setPendingUserId(null);
    setActionUser(null);
    setStatus(
      suspend
        ? `${target.name} was suspended.`
        : `${target.name} was unsuspended.`,
    );
  };

  if (isLoading) {
    return (
      <MobileShell title="Users" subtitle="Checking access">
        <div
          className="p-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          Loading your account...
        </div>
      </MobileShell>
    );
  }

  if (!isAdmin) {
    return (
      <MobileShell title="Users" subtitle="Admin only">
        <div
          className="p-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          You don&apos;t have permission to view this page.
          <Link
            href="/profile"
            className="ml-1 font-semibold underline"
            style={{ color: "var(--primary)" }}
          >
            Go back
          </Link>
        </div>
      </MobileShell>
    );
  }

  if (isUsersLoading) {
    return (
      <MobileShell title="Users" subtitle="Loading users">
        <div
          className="p-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          Loading user records...
        </div>
      </MobileShell>
    );
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      (u.role ?? "member").includes(query.toLowerCase()),
  );

  return (
    <MobileShell title="Manage Users" subtitle={`${users.length} registered`}>
      <div className="space-y-4">
        {status ? (
          <div
            className="mx-4 rounded-xl border px-3 py-2 text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            {status}
          </div>
        ) : null}

        {/* Back */}
        <div className="px-4 pt-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            <ChevronLeft size={16} /> Admin Dashboard
          </Link>
        </div>

        {/* Search */}
        <div className="px-4">
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <Search size={15} style={{ color: "var(--muted)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or role…"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--foreground)" }}
            />
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2 px-4">
          {["all", "admin", "ngo", "member"].map((r) => {
            const count =
              r === "all"
                ? users.length
                : users.filter((u) => u.role === r).length;
            return (
              <button
                key={r}
                onClick={() => setQuery(r === "all" ? "" : r)}
                className="rounded-full px-3 py-1 text-xs font-semibold capitalize transition"
                style={{
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                }}
              >
                {r} ({count})
              </button>
            );
          })}
        </div>

        {/* User list */}
        <div
          className="divide-y mx-4 rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
        >
          {filtered.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <Image
                src={u.avatar}
                alt={u.name}
                width={40}
                height={40}
                className="rounded-full shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {u.name}
                  </p>
                  <RoleBadge role={u.role} />
                  {u.isSuspended ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{ background: "#fee2e2", color: "#991b1b" }}
                    >
                      Suspended
                    </span>
                  ) : null}
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {u.bio ?? "No bio"} · {u.joinedAt}
                </p>
              </div>
              <button
                onClick={() =>
                  setActionUser(actionUser?.id === u.id ? null : u)
                }
                className="shrink-0 rounded-full p-1.5 transition hover:opacity-70"
                style={{ color: "var(--muted)" }}
              >
                <MoreVertical size={16} />
              </button>

              {/* Inline action panel */}
              {actionUser?.id === u.id && (
                <div
                  className="absolute right-8 z-10 flex flex-col rounded-2xl border shadow-lg overflow-hidden"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  {u.role !== "admin" && (
                    <button
                      disabled={pendingUserId === u.id}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:opacity-70"
                      onClick={() => {
                        void handlePromote(u);
                      }}
                      style={{ color: "var(--foreground)" }}
                    >
                      <Shield size={14} /> Make admin
                    </button>
                  )}
                  <button
                    disabled={pendingUserId === u.id}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:opacity-70"
                    onClick={() => {
                      void handleSuspendToggle(u);
                    }}
                    style={{ color: "var(--foreground)" }}
                  >
                    <UserX size={14} />
                    {u.isSuspended ? "Unsuspend" : "Suspend"}
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:opacity-70"
                    onClick={() => setActionUser(null)}
                    style={{ color: "var(--muted)" }}
                  >
                    <UserCheck size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p
              className="p-6 text-center text-sm"
              style={{ color: "var(--muted)" }}
            >
              No users match &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        <p
          className="px-4 pb-2 text-center text-xs"
          style={{ color: "var(--muted)" }}
        >
          User management updates are applied directly to Supabase.
        </p>
      </div>
    </MobileShell>
  );
}
