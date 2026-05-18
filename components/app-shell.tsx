import type { ReactNode } from "react";
import Link from "next/link";
import {
  CircleHelp,
  Home,
  LibraryBig,
  PanelLeft,
  Search,
  Settings2,
  SquareTerminal,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/workspace", label: "Workspace" },
  { href: "/studio", label: "Studio" },
  { href: "/admin", label: "Admin" },
];

const sidebarGroups = [
  {
    title: "Get started",
    items: [
      { key: "overview", label: "Overview", href: "/", icon: Home },
      { key: "roadmap", label: "Roadmap", href: "/workspace", icon: PanelLeft },
      {
        key: "concepts",
        label: "Concepts",
        href: "/workspace",
        icon: LibraryBig,
      },
    ],
  },
  {
    title: "Learning modules",
    items: [
      { key: "math", label: "Math derivations", href: "/workspace" },
      {
        key: "code",
        label: "Runnable code",
        href: "/studio",
        icon: SquareTerminal,
      },
      { key: "papers", label: "Papers", href: "/studio" },
      { key: "review", label: "Review", href: "/workspace" },
    ],
  },
  {
    title: "Community",
    items: [
      { key: "public-notes", label: "Public notes", href: "/community" },
      { key: "profiles", label: "Profiles", href: "/community" },
      {
        key: "discussions",
        label: "Discussions",
        href: "/community",
        icon: CircleHelp,
      },
    ],
  },
];

const mobileSidebarItems = [
  { key: "overview", label: "Overview", href: "/" },
  { key: "roadmap", label: "Roadmap", href: "/workspace" },
  { key: "concepts", label: "Concepts", href: "/workspace" },
  { key: "code", label: "Code", href: "/studio" },
  { key: "public-notes", label: "Community", href: "/community" },
];

type AppShellProps = {
  activePath?: "/" | "/community" | "/workspace" | "/studio" | "/admin";
  children: ReactNode;
  sidebarActive?: string;
};

export function AppShell({
  activePath = "/",
  children,
  sidebarActive = "overview",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur">
        <div className="grid min-h-[72px] grid-cols-1 items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_auto] lg:px-8">
          <Link
            className="inline-flex w-fit items-center text-xl font-semibold tracking-[-0.01em]"
            href="/"
          >
            AI Learning Garden
          </Link>

          <nav
            aria-label="Primary navigation"
            className="w-full min-w-0 lg:w-auto lg:justify-self-center"
          >
            <ul className="flex max-w-full flex-wrap gap-1.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className={`inline-flex min-h-10 items-center rounded-xl px-3.5 text-sm font-medium transition hover:bg-[var(--panel-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                      activePath === item.href
                        ? "bg-[var(--panel-active)] text-black"
                        : "text-zinc-700"
                    }`}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden flex-wrap items-center gap-3 sm:flex lg:justify-end">
            <div className="flex min-h-11 w-full max-w-[280px] items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 text-sm text-[var(--muted)] sm:w-[280px]">
              <Search aria-hidden="true" size={17} strokeWidth={2} />
              <span>Search learning notes</span>
            </div>
            <Link
              className="primary-action inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-semibold transition hover:bg-zinc-800 active:translate-y-px"
              href="/workspace"
            >
              Start learning
            </Link>
            <Link
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition hover:bg-[var(--panel-soft)] hover:text-black"
              href="/admin"
              title="Settings"
            >
              <Settings2 aria-hidden="true" size={18} />
              <span className="sr-only">Settings</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="grid px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="min-w-0 border-b border-[var(--line)] py-4 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:border-b-0 lg:py-8 lg:pr-8">
          <nav
            aria-label="Compact documentation sections"
            className="flex gap-2 overflow-x-auto pb-1 lg:hidden"
          >
            {mobileSidebarItems.map((item) => (
              <Link
                className={`inline-flex min-h-9 shrink-0 items-center rounded-full px-3.5 text-sm transition ${
                  sidebarActive === item.key
                    ? "bg-[var(--panel-active)] font-medium text-black"
                    : "bg-[var(--panel-soft)] text-zinc-700"
                }`}
                href={item.href}
                key={item.key}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <nav
            aria-label="Documentation sections"
            className="hidden lg:block lg:space-y-8"
          >
            {sidebarGroups.map((group) => (
              <section className="min-w-[178px] lg:min-w-0" key={group.title}>
                <h2 className="px-3 text-sm font-semibold text-zinc-900">
                  {group.title}
                </h2>
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = sidebarActive === item.key;

                    return (
                      <li key={item.key}>
                        <Link
                          className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm transition hover:bg-[var(--panel-soft)] ${
                            active
                              ? "bg-[var(--panel-active)] font-medium text-black"
                              : "text-zinc-700"
                          }`}
                          href={item.href}
                        >
                          {Icon ? (
                            <Icon
                              aria-hidden="true"
                              size={15}
                              strokeWidth={2}
                            />
                          ) : null}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 lg:border-l lg:border-[var(--line)] lg:pl-14 xl:pl-20">
          {children}
        </div>
      </div>
    </div>
  );
}
