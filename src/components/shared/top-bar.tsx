"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { CURRENT_USER } from "@/lib/session";

type TopBarProps = {
  title: string;
  subtitle?: string;
};

export function TopBar({ title, subtitle }: TopBarProps) {
  const dir = useScrollDirection();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-20 flex items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--card)]/95 px-4 py-0 backdrop-blur transition-transform duration-300",
        dir === "down" ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* Logo */}
      <Image
        src="/tas-logo.png"
        alt="Tell A Story Foundation"
        width={72}
        height={72}
        priority
        className="shrink-0"
      />

      {/* Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold leading-tight text-[color:var(--foreground)]">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-[color:var(--muted)]">{subtitle}</p> : null}
      </div>

      {/* Profile avatar */}
      <Link href="/profile" className="shrink-0" title={CURRENT_USER.name}>
        <Image
          src={CURRENT_USER.avatar}
          alt={CURRENT_USER.name}
          width={34}
          height={34}
          className="rounded-full border-2 border-[color:var(--primary-mid)] object-cover"
        />
      </Link>
    </header>
  );
}
