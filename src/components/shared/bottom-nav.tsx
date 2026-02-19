"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, PenSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Stories", icon: Sparkles },
  { href: "/write", label: "Write", icon: PenSquare },
  { href: "/blog", label: "Blogs", icon: BookOpen },
];

export function BottomNav() {
  const pathname = usePathname();
  const dir = useScrollDirection();

  return (
    <nav className={cn(
      "fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-sky-100 bg-[color:var(--card)] px-2 py-2 transition-transform duration-300",
      dir === "down" ? "translate-y-full" : "translate-y-0"
    )}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition",
              isActive
                ? "bg-sky-100 text-[color:var(--foreground)]"
                : "text-[color:var(--muted)] hover:bg-sky-50"
            )}
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
