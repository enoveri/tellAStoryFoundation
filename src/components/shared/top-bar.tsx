"use client";

import Image from "next/image";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

type TopBarProps = {
  title: string;
  subtitle?: string;
};

export function TopBar({ title, subtitle }: TopBarProps) {
  const dir = useScrollDirection();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-20 flex items-center gap-3 border-b border-sky-100/90 bg-[color:var(--card)]/95 px-4 py-1 backdrop-blur transition-transform duration-300",
        dir === "down" ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* Logo */}
      <Image
        src="/tas-logo.png"
        alt="Tell A Story Foundation"
        width={56}
        height={56}
        priority
        className="shrink-0"
      />

      {/* Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold leading-tight text-[color:var(--foreground)]">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-[color:var(--muted)]">{subtitle}</p> : null}
      </div>

      {/* Profile avatar */}
      <Image
        src="https://i.pravatar.cc/150?img=47"
        alt="My profile"
        width={34}
        height={34}
        className="shrink-0 rounded-full border-2 border-sky-200 object-cover"
      />
    </header>
  );
}
