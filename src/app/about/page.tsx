"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Users, BookOpen, Globe, Mail, ArrowRight, Handshake, ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { useAbout } from "@/context/about-context";
import { cn } from "@/lib/utils";

// Icons are fixed per array position (React components can't be serialised)
const pillarIcons = [Heart, Users, BookOpen, Globe];
const partnerIcons = [Handshake, Globe, BookOpen, Users];

// ─── Tab content ──────────────────────────────────────────────────────────────

function TabAbout() {
  const { data } = useAbout();
  return (
    <div className="space-y-5">
      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">What we stand for</h3>
        {data.pillars.map(({ title, body }, i) => {
          const Icon = pillarIcons[i % pillarIcons.length];
          return (
            <div key={title} className="flex gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary-light)]">
                <Icon size={18} className="text-[color:var(--primary)]" />
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
                <p className="text-xs leading-relaxed text-[color:var(--muted)]">{body}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Meet the team</h3>
        <div className="grid grid-cols-3 gap-3">
          {data.team.map(({ id, name, role, img }) => (
            <div key={id} className="flex flex-col items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 text-center shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={name} className="h-14 w-14 rounded-full border-2 border-[color:var(--primary-mid)] object-cover" />
              <p className="text-xs font-semibold leading-tight text-[color:var(--foreground)]">{name}</p>
              <p className="text-[10px] leading-tight text-[color:var(--muted)]">{role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 rounded-2xl px-5 py-5 text-center shadow-md" style={{ background: "var(--inverse)" }}>
        <p className="mb-1 font-bold" style={{ color: "var(--inverse-fg)" }}>Get in touch</p>
        <p className="mb-4 text-sm" style={{ color: "var(--inverse-muted)" }}>Partner with us, share your story, or support our mission.</p>
        <a href="mailto:hello@tellastory.org" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--inverse-fg)] px-5 py-2 text-sm font-semibold text-[color:var(--inverse)] hover:bg-[color:var(--primary-subtle)]">
          <Mail size={14} /> hello@tellastory.org
        </a>
      </section>
    </div>
  );
}

function TabGallery() {
  const { data } = useAbout();
  return (
    <div className="space-y-4 px-4">
      <p className="text-sm text-[color:var(--muted)]">Moments from our workshops, story circles, and community events.</p>
      <div className="grid grid-cols-2 gap-2">
        {data.gallery.map(({ id, src, alt }) => (
          <div key={id} className="relative aspect-square overflow-hidden rounded-2xl">
            <Image src={src} alt={alt} fill className="object-cover transition hover:scale-105" sizes="180px" />
          </div>
        ))}
      </div>
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--primary)] hover:underline">
        See more in our blog <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function TabPartnership() {
  const { data } = useAbout();
  return (
    <div className="space-y-5">
      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Ways to partner</h3>
        {data.partnershipTypes.map(({ id, title, body }, i) => {
          const Icon = partnerIcons[i % partnerIcons.length];
          return (
            <div key={id} className="flex gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--success-subtle)]">
                <Icon size={18} className="text-[color:var(--success)]" />
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
                <p className="text-xs leading-relaxed text-[color:var(--muted)]">{body}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Current partners</h3>
        <div className="grid grid-cols-2 gap-3">
          {data.partners.map(({ id, name, kind, logo }) => (
            <div key={id} className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={name} className="h-10 w-10 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[color:var(--foreground)]">{name}</p>
                <p className="text-[10px] text-[color:var(--muted)]">{kind}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 px-5 py-5 text-white shadow-md">
        <p className="mb-1 font-bold">Become a partner</p>
        <p className="mb-4 text-sm text-emerald-100">Let&apos;s build something meaningful together.</p>
        <a href="mailto:partnerships@tellastory.org" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[color:var(--success-text)] hover:bg-[color:var(--success-subtle)]">
          <Handshake size={14} /> partnerships@tellastory.org
        </a>
      </section>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const tabs = [
  { id: "about",       label: "About Us" },
  { id: "gallery",     label: "Gallery" },
  { id: "partnership", label: "Partnership" },
] as const;

type TabId = typeof tabs[number]["id"];

export default function AboutPage() {
  const [active, setActive] = useState<TabId>("about");
  const { data } = useAbout();

  return (
    <MobileShell title="About Us" subtitle="Tell A Story Foundation">
      {/* Back to profile */}
      <div className="px-4 pt-1">
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: "var(--primary)" }}>
          <ArrowLeft size={15} /> Back to Profile
        </Link>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-100 via-cyan-50 to-white px-5 py-6 text-center">
        <h2 className="mb-1 text-xl font-bold text-[color:var(--foreground)]">{data.heroTitle}</h2>
        <p className="mx-auto max-w-xs text-sm text-[color:var(--muted)]">{data.heroSubtitle}</p>
      </section>

      {/* Tab bar */}
      <div className="sticky top-[72px] z-10 flex gap-0 border-b border-[color:var(--border)] bg-[color:var(--background)] px-4 pt-1">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "px-4 py-2 text-sm font-semibold transition",
              active === id
                ? "border-b-2 border-[color:var(--primary)] text-[color:var(--primary)]"
                : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active tab */}
      <div key={active} className="animate-fade-in py-4">
        {active === "about"       && <TabAbout />}
        {active === "gallery"     && <TabGallery />}
        {active === "partnership" && <TabPartnership />}
      </div>
    </MobileShell>
  );
}
