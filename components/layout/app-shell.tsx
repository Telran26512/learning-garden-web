"use client";

import type { ReactNode } from "react";
import { TopNav } from "@/components/layout/top-nav";
import type { GoToScreen, Screen } from "@/lib/navigation/synapse-navigation";

type AppShellProps = {
  active: Screen;
  children: ReactNode;
  footerNote?: string;
  goTo?: GoToScreen;
};

export function AppShell({
  active,
  children,
  footerNote = "Synapse · Learning Garden frontend foundation",
  goTo,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[13px] text-[color:var(--ink)]">
      <TopNav active={active} goTo={goTo} />
      <main className="mx-auto max-w-[1200px] px-5 sm:px-6">{children}</main>
      <footer className="py-6 text-center text-[11px] text-[color:var(--muted)]">{footerNote}</footer>
    </div>
  );
}
