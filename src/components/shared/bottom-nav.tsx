"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Info, PenSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/feed", label: "Stories", icon: Sparkles },
  { href: "/write", label: "Write", icon: PenSquare },
  { href: "/blog", label: "Blogs", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-sky-100 bg-[color:var(--card)] px-1 py-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-xs font-medium transition",
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
