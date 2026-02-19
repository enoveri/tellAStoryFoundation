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
      {/* pt-16 clears the fixed topbar (logo 56px + py-1×2 ≈ 64px); pb-14 clears the fixed bottom nav */}
      <main className="flex-1 space-y-4 pt-[72px] pb-14">{children}</main>
      <BottomNav />
    </div>
  );
}
