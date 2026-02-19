import type { ReactNode } from "react";
import { BottomNav } from "@/components/shared/bottom-nav";
import { TopBar } from "@/components/shared/top-bar";

type MobileShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function MobileShell({ title, subtitle, children }: MobileShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[color:var(--background)]">
      <TopBar title={title} subtitle={subtitle} />
      {/* pt-44 = ~176px clears the fixed topbar (logo 144px + py-2×2); pb-20 clears the fixed bottom nav */}
      <main className="flex-1 space-y-4 pt-44 pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
