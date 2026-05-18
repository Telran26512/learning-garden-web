import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpenText,
  Compass,
  LayoutDashboard,
  PencilLine,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/", label: "工作台", icon: LayoutDashboard },
  { href: "/community", label: "社区", icon: Compass },
  { href: "/workspace", label: "学习空间", icon: BookOpenText },
  { href: "/studio", label: "创作", icon: PencilLine },
  { href: "/admin", label: "管理", icon: ShieldCheck },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-semibold text-white">
              LG
            </span>
            <span>
              <span className="block text-sm font-semibold">
                AI Learning Garden
              </span>
              <span className="block text-xs text-[var(--muted)]">
                math · code · papers
              </span>
            </span>
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="flex flex-wrap gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                      href={item.href}
                    >
                      <Icon aria-hidden="true" size={16} strokeWidth={2} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
