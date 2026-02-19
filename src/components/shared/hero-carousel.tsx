"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, HeartHandshake, Users, BookOpen, ImageIcon, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Slide data ──────────────────────────────────────────────────────────────

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", alt: "Community gathering" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop", alt: "Children reading" },
  { src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop", alt: "Workshop session" },
  { src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop", alt: "Story circle" },
];

const stats = [
  { icon: Users,    value: "4,200+",  label: "Lives touched" },
  { icon: BookOpen, value: "1,800+",  label: "Stories shared" },
  { icon: HeartHandshake, value: "320+", label: "Workshops held" },
  { icon: ImageIcon, value: "18",     label: "Countries reached" },
];

// ─── Individual slides ────────────────────────────────────────────────────────

function SlideHero() {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary-text)]">
          <HeartHandshake size={13} /> Tell A Story NGO
        </div>
        <h2 className="text-2xl font-bold leading-snug text-[color:var(--foreground)]">
          Share your story.<br />Inspire someone else.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--foreground)]/80">
          A safe community where people write their journeys, support each other, and amplify hope.
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href="/feed" className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-[color:var(--primary-fg)] shadow-sm hover:bg-[color:var(--primary-dark)]">
          Explore stories <ArrowRight size={14} />
        </Link>
        <Link href="/write" className="inline-flex rounded-full border border-[color:var(--primary)] bg-white/60 px-4 py-2 text-sm font-semibold text-[color:var(--primary-text)] hover:bg-white/80">
          Write yours
        </Link>
      </div>
    </div>
  );
}

function SlideGallery() {
  return (
    <div className="flex h-full flex-col p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">Our Gallery</p>
      <h2 className="mb-3 text-lg font-bold text-[color:var(--foreground)]">Moments that matter</h2>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {galleryImages.map(({ src, alt }) => (
          <div key={alt} className="relative overflow-hidden rounded-xl">
            <Image src={src} alt={alt} fill className="object-cover" sizes="150px" />
          </div>
        ))}
      </div>
      <Link href="/blog" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--primary)] hover:underline">
        View full gallery <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function SlideStats() {
  return (
    <div className="flex h-full flex-col justify-center p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">Our Impact</p>
      <h2 className="mb-4 text-lg font-bold text-[color:var(--foreground)]">Stories change lives — the numbers prove it</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center rounded-2xl bg-white/60 py-3 px-2 text-center shadow-sm">
            <Icon size={18} className="mb-1 text-[color:var(--primary)]" />
            <span className="text-xl font-extrabold text-[color:var(--primary)]">{value}</span>
            <span className="mt-0.5 text-xs text-[color:var(--muted)]">{label}</span>
          </div>
        ))}
      </div>
      <Link href="/about" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--primary)] hover:underline">
        Learn more about us <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function SlideFounder() {
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--primary)]">From Our Founder</p>
        <Quote size={24} className="mb-2 text-[color:var(--primary-mid)]" />
        <p className="text-sm leading-relaxed text-[color:var(--foreground)]/90 italic">
          "I started Tell A Story Foundation because I believe every person carries a story worth hearing.
          When we listen to each other — truly listen — we begin to see our shared humanity.
          This platform is that listening space, built for you."
        </p>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Image
          src="https://i.pravatar.cc/150?img=47"
          alt="Founder"
          width={44}
          height={44}
          className="rounded-full border-2 border-[color:var(--border)] object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">Amara Nwosu</p>
          <p className="text-xs text-[color:var(--muted)]">Founder & Executive Director</p>
        </div>
        <Link href="/about" className="ml-auto inline-flex items-center gap-1 rounded-full bg-[color:var(--primary-light)] px-3 py-1.5 text-xs font-semibold text-[color:var(--primary)] hover:bg-[color:var(--primary-mid)]">
          Meet the team <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ─── Slide config ─────────────────────────────────────────────────────────────

const slides = [
  { id: "hero",    bg: "from-sky-200 via-cyan-100 to-slate-100",  Component: SlideHero },
  { id: "gallery", bg: "from-violet-100 via-purple-50 to-white",   Component: SlideGallery },
  { id: "stats",   bg: "from-emerald-100 via-teal-50 to-sky-50",   Component: SlideStats },
  { id: "founder", bg: "from-amber-50 via-orange-50 to-white",      Component: SlideFounder },
];

const AUTO_ADVANCE_MS = 5000;

// ─── Carousel ─────────────────────────────────────────────────────────────────

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((idx: number) => {
    setActive((idx + slides.length) % slides.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => goTo(active + 1), AUTO_ADVANCE_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, goTo]);

  // Swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(active + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const { bg, Component } = slides[active];

  return (
    <div
      className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br", bg)}
      style={{ minHeight: 260 }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide content */}
      <div className="animate-fade-in">
        <Component />
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-5 bg-[color:var(--primary)]" : "w-1.5 bg-[color:var(--primary-light)]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
