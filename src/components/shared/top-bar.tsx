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
        "fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-3 border-b border-sky-100/90 bg-[color:var(--card)]/95 px-3 py-2 backdrop-blur transition-transform duration-300",
        dir === "down" ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <Image
        src="/tas-logo.png"
        alt="Tell A Story Foundation"
        width={144}
        height={144}
        priority
        className="shrink-0"
      />
      <div className="text-right">
        <h1 className="text-sm font-semibold leading-tight text-[color:var(--foreground)]">{title}</h1>
        {subtitle ? <p className="text-xs text-[color:var(--muted)]">{subtitle}</p> : null}
      </div>
    </header>
  );
}
