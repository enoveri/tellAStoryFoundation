"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Users, BookOpen, Globe, Mail, ArrowRight, Handshake } from "lucide-react";
import { MobileShell } from "@/components/shared/mobile-shell";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const pillars = [
  { icon: Heart,    title: "Our Mission",     body: "Tell A Story Foundation creates safe spaces where individuals share their lived experiences — turning personal journeys into community power." },
  { icon: Users,    title: "Community First", body: "We believe every voice matters. Our platform connects storytellers across communities, fostering empathy, healing, and mutual support." },
  { icon: BookOpen, title: "Story as Tool",   body: "We use storytelling as a tool for advocacy, mental health, and social change — because stories shift hearts before systems do." },
  { icon: Globe,    title: "Global Reach",    body: "Operating from Africa and reaching the world, we amplify voices that are rarely heard and celebrate the diversity of human experience." },
];

const team = [
  { name: "Amara Nwosu", role: "Founder & Executive Director", img: "https://i.pravatar.cc/150?img=47" },
  { name: "Kelvin Osei", role: "Head of Community",            img: "https://i.pravatar.cc/150?img=12" },
  { name: "Maya Patel",  role: "Content & Blog Lead",          img: "https://i.pravatar.cc/150?img=32" },
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", alt: "Community gathering" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop", alt: "Children reading" },
  { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop", alt: "Workshop session" },
  { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop", alt: "Story circle" },
  { src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=300&fit=crop", alt: "Outdoor event" },
  { src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop", alt: "Safe space workshop" },
];

const partners = [
  { name: "Ubuntu Education Fund",   kind: "NGO Partner",       logo: "https://i.pravatar.cc/80?img=1" },
  { name: "Africa Storytelling Lab", kind: "Creative Partner",  logo: "https://i.pravatar.cc/80?img=2" },
  { name: "Youth Voices Initiative", kind: "Community Partner", logo: "https://i.pravatar.cc/80?img=3" },
  { name: "Healing Words Trust",     kind: "Wellness Partner",  logo: "https://i.pravatar.cc/80?img=4" },
];

const partnershipTypes = [
  { icon: Handshake, title: "NGO & Community",  body: "Co-host story circles, workshops, and safe-space events in your community." },
  { icon: Globe,     title: "Corporate Sponsor", body: "Fund programmes, sponsor events, and align your brand with human-centred storytelling." },
  { icon: BookOpen,  title: "Academic Partner",  body: "Collaborate on research, curriculum, and storytelling-as-therapy programmes." },
  { icon: Users,     title: "Media & Content",   body: "Amplify our stories through your platforms and reach wider audiences together." },
];

// ─── Tab content ──────────────────────────────────────────────────────────────

function TabAbout() {
  return (
    <div className="space-y-5">
      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">What we stand for</h3>
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary-light)]">
              <Icon size={18} className="text-[color:var(--primary)]" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
              <p className="text-xs leading-relaxed text-[color:var(--muted)]">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Meet the team</h3>
        <div className="grid grid-cols-3 gap-3">
          {team.map(({ name, role, img }) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 text-center shadow-sm">
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
  return (
    <div className="space-y-4 px-4">
      <p className="text-sm text-[color:var(--muted)]">Moments from our workshops, story circles, and community events.</p>
      <div className="grid grid-cols-2 gap-2">
        {galleryImages.map(({ src, alt }) => (
          <div key={alt} className="relative aspect-square overflow-hidden rounded-2xl">
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
  return (
    <div className="space-y-5">
      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Ways to partner</h3>
        {partnershipTypes.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--success-subtle)]">
              <Icon size={18} className="text-[color:var(--success)]" />
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
              <p className="text-xs leading-relaxed text-[color:var(--muted)]">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3 px-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--muted)]">Current partners</h3>
        <div className="grid grid-cols-2 gap-3">
          {partners.map(({ name, kind, logo }) => (
            <div key={name} className="flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 shadow-sm">
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

  return (
    <MobileShell title="About Us" subtitle="Tell A Story Foundation">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-100 via-cyan-50 to-white px-5 py-6 text-center">
        <h2 className="mb-1 text-xl font-bold text-[color:var(--foreground)]">Creating Change Through Stories</h2>
        <p className="mx-auto max-w-xs text-sm text-[color:var(--muted)]">
          A non-profit using storytelling to inspire, heal, and transform communities everywhere.
        </p>
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
