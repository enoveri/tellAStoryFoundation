"use client";

import { useState } from "react";
import { User, Bell, Shield, Trash2, ChevronLeft, Check } from "lucide-react";
import Link from "next/link";
import { MobileShell } from "@/components/shared/mobile-shell";
import { useCurrentUser } from "@/hooks/use-current-user";

function Toggle({
  label,
  defaultOn = false,
}: {
  label: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="flex w-full items-center justify-between py-3"
    >
      <span className="text-sm" style={{ color: "var(--foreground)" }}>
        {label}
      </span>
      <span
        className="relative inline-flex h-6 w-11 items-center rounded-full transition"
        style={{ background: on ? "var(--primary)" : "var(--border)" }}
      >
        <span
          className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
          style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
        />
      </span>
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-4 space-y-1">
      <h3
        className="mb-3 text-xs font-bold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {title}
      </h3>
      <div
        className="divide-y rounded-2xl border px-4"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        {children}
      </div>
    </section>
  );
}

export default function SettingsPage() {
  const { user, isLoading } = useCurrentUser();
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <MobileShell title="Settings" subtitle="Loading account">
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
      <MobileShell title="Settings" subtitle="Sign in required">
        <div
          className="p-8 text-center text-sm"
          style={{ color: "var(--muted)" }}
        >
          Please sign in to update account settings.
        </div>
      </MobileShell>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <MobileShell title="Settings" subtitle="Account & preferences">
      <div className="space-y-6 pb-4">
        {/* Back link */}
        <div className="px-4 pt-1">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            <ChevronLeft size={16} /> Back to Profile
          </Link>
        </div>

        {/* ── Account ─────────────────────────────────────────────── */}
        <Section title="Account">
          <div className="flex items-center gap-3 py-3">
            <User size={16} style={{ color: "var(--muted)" }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Display name
              </p>
              <input
                defaultValue={user.name}
                className="w-full bg-transparent text-sm font-medium outline-none"
                style={{ color: "var(--foreground)" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <User size={16} style={{ color: "var(--muted)" }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Email (Google linked)
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {user.email ||
                  `${user.name.toLowerCase().replace(" ", ".")}@tellastory.org`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <User size={16} style={{ color: "var(--muted)" }} />
            <div className="min-w-0 flex-1">
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Bio
              </p>
              <input
                defaultValue={user.bio ?? ""}
                placeholder="A short bio about you"
                className="w-full bg-transparent text-sm font-medium outline-none"
                style={{ color: "var(--foreground)" }}
              />
            </div>
          </div>
        </Section>

        {/* ── Notifications ────────────────────────────────────────── */}
        <Section title="Notifications">
          <Toggle label="New comments on my stories" defaultOn={true} />
          <Toggle label="New likes on my stories" defaultOn={true} />
          <Toggle label="Weekly digest email" defaultOn={false} />
          <Toggle label="Event reminders" defaultOn={true} />
        </Section>

        {/* ── Privacy ──────────────────────────────────────────────── */}
        <Section title="Privacy">
          <Toggle label="Make my profile public" defaultOn={true} />
          <Toggle label="Allow comments on my stories" defaultOn={true} />
          <Toggle label="Show my stories in the feed" defaultOn={true} />
        </Section>

        {/* Save button */}
        <div className="px-4">
          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold shadow-sm transition"
            style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
          >
            {saved ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* ── Danger zone ──────────────────────────────────────────── */}
        <Section title="Danger Zone">
          <button
            className="flex w-full items-center gap-3 py-3 text-sm font-medium text-rose-600"
            onClick={() =>
              alert(
                "Account deletion will be available once auth is connected.",
              )
            }
          >
            <Trash2 size={16} /> Delete my account
          </button>
        </Section>

        <p
          className="px-4 text-center text-xs"
          style={{ color: "var(--muted)" }}
        >
          Account is linked via Supabase Auth (Google).
        </p>
      </div>
    </MobileShell>
  );
}
