"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { SynapseLogo } from "@/components/ui/synapse-logo";
import { WORKSPACE_NAV_ITEMS } from "../data/nav-items";

type WorkspaceHeaderProps = {
  activeItem?: (typeof WORKSPACE_NAV_ITEMS)[number];
  avatarImageSrc?: string;
  displayName: string;
  mode?: "reading" | "working";
  shortName: string;
  onLogout: () => void | Promise<void>;
};

const commandItems = [
  { href: "/app?view=editor", label: "打开 Studio" },
  { href: "/app?view=explore", label: "打开 Explore" },
  { href: "/app?view=portfolio", label: "打开 Portfolio" },
  { href: "/app?view=editor", label: "新建 Concept" },
  { href: "/app", label: "查看今日任务" },
  { href: "/app?view=explore", label: "探索热门 Track" },
  { href: "/app?view=portfolio&tab=tracks", label: "查看公开 Track" },
] as const;

const notifications = [
  "Vaswani 2017 已完成 embedding",
  "RoFormer 阅读进入 Explore 推荐",
  "attention.py 资源同步完成",
];

export function WorkspaceHeader({
  activeItem = "Workspace",
  avatarImageSrc,
  displayName,
  mode = "working",
  shortName,
  onLogout,
}: WorkspaceHeaderProps) {
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [noticeCount, setNoticeCount] = useState(notifications.length);
  // §1 用户名超过 12 个字符时收敛，避免 admin-vip 一类名称被强制换行。
  const displayLabel =
    displayName.length > 12 ? `${displayName.slice(0, 10)}...` : displayName;
  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return commandItems;
    }

    return commandItems.filter((item) =>
      item.label.toLowerCase().includes(normalized),
    );
  }, [query]);
  const reading = mode === "reading";
  const headerTone = reading
    ? {
        active:
          "border-[var(--syn-accent)] bg-[var(--syn-accent-soft)] text-[var(--syn-reading-ink)]",
        border: "border-[var(--syn-hairline-light)]",
        button:
          "border-[var(--syn-hairline-light)] text-[var(--syn-reading-secondary)] hover:border-[var(--syn-accent)] hover:text-[var(--syn-accent)]",
        header:
          "border-[var(--syn-hairline-light)] bg-[var(--syn-reading-bg)]/95 text-[var(--syn-reading-ink)]",
        input:
          "border-[var(--syn-hairline-light)] bg-transparent text-[var(--syn-reading-ink)] placeholder:text-[var(--syn-reading-muted)]",
        inactive:
          "border-transparent text-[var(--syn-reading-secondary)] hover:text-[var(--syn-reading-ink)]",
        menu: "border-[var(--syn-hairline-light)] bg-[var(--syn-reading-surface)] text-[var(--syn-reading-secondary)]",
      }
    : {
        active:
          "border-[var(--syn-accent)] bg-transparent text-[var(--syn-working-ink)]",
        border: "border-[var(--syn-hairline-dark)]",
        button:
          "border-[var(--syn-hairline-dark)] text-[var(--syn-working-secondary)] hover:border-[var(--syn-accent)] hover:text-[var(--syn-working-ink)]",
        header:
          "border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)]/95 text-[var(--syn-working-ink)]",
        input:
          "border-[var(--syn-hairline-dark)] bg-transparent text-[var(--syn-working-ink)] placeholder:text-[var(--syn-working-muted)]",
        inactive:
          "border-transparent text-[var(--syn-working-secondary)] hover:text-[var(--syn-working-ink)]",
        menu: "border-[var(--syn-hairline-dark)] bg-[var(--syn-working-surface)] text-[var(--syn-working-secondary)]",
      };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl ${headerTone.header}`}
    >
      <div className="flex min-h-14 items-center gap-4 px-4 sm:px-6">
        <Link
          className="flex min-w-max items-center gap-2.5 text-[16px] font-semibold"
          href="/"
          aria-label="Synapse 首页"
        >
          <span className="text-[var(--syn-accent)]">
            <SynapseLogo size={24} />
          </span>
          <span>Synapse</span>
        </Link>
        <nav
          className="hidden h-14 items-center gap-4 overflow-x-auto text-[14px] xl:gap-6 lg:flex"
          aria-label="Primary"
        >
          {WORKSPACE_NAV_ITEMS.map((item) => {
            const href =
              item === "Studio"
                ? "/app?view=editor"
                : item === "Portfolio"
                  ? "/app?view=portfolio"
                  : item === "Explore"
                    ? "/app?view=explore"
                    : item === "Community"
                      ? "/app?view=community"
                      : item === "Workspace"
                        ? "/app"
                        : "/app";
            const isActive = item === activeItem;

            return (
              <Link
                className={[
                  "flex h-9 items-center border-b px-1 outline-none transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--syn-accent)]",
                  isActive ? headerTone.active : headerTone.inactive,
                ].join(" ")}
                href={href}
                key={item}
              >
                {item}
              </Link>
            );
          })}
        </nav>
        <div
          className={`relative ml-auto hidden w-full max-w-[300px] items-center rounded-[var(--syn-radius)] border px-3 md:flex xl:max-w-[360px] 2xl:max-w-[620px] ${headerTone.input}`}
        >
          <span className="mr-2 text-[13px]">⌕</span>
          <input
            className="h-10 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-text-muted"
            onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="跳转 / 搜索"
            type="search"
            value={query}
          />
          <kbd
            className={`rounded-[3px] border px-1.5 py-0.5 text-[11px] ${headerTone.border}`}
          >
            ⌘K
          </kbd>
          {searchFocused ? (
            <div
              className={`absolute left-0 right-0 top-12 z-40 rounded-[var(--syn-radius)] border p-2 ${headerTone.menu}`}
            >
              {filteredCommands.length ? (
                filteredCommands.map((item) => (
                  <Link
                    className="block w-full rounded-[3px] px-2 py-2 text-left text-[12px] transition hover:text-[var(--syn-accent)]"
                    href={item.href}
                    key={item.label}
                    onClick={() => {
                      setQuery(item.label);
                      setSearchFocused(false);
                    }}
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <div className="px-2 py-2 text-[12px] text-text-muted">
                  没有匹配结果
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <button
              className={`inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-[var(--syn-radius)] border bg-transparent px-3 text-[13px] font-medium transition ${headerTone.button}`}
              onClick={() => setNewMenuOpen((open) => !open)}
              type="button"
            >
              <span className="text-[12px] leading-none">+</span>
              <span>新建</span>
            </button>
            {newMenuOpen ? (
              <HeaderMenu className={headerTone.menu}>
                {["Concept", "Paper Note", "Experiment"].map((item) => (
                  <Link
                    className="block rounded-[3px] px-2 py-2 text-[12px] transition hover:text-[var(--syn-accent)]"
                    href="/app?view=editor"
                    key={item}
                    onClick={() => setNewMenuOpen(false)}
                  >
                    新建 {item}
                  </Link>
                ))}
              </HeaderMenu>
            ) : null}
          </div>
          <div className="relative">
            <button
              className={`relative grid size-10 place-items-center rounded-[var(--syn-radius)] border bg-transparent text-[16px] transition ${headerTone.button}`}
              type="button"
              aria-label="通知"
              onClick={() => {
                setNotificationOpen((open) => !open);
                setNoticeCount(0);
              }}
            >
              <BellIcon />
              {noticeCount ? (
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
              ) : null}
            </button>
            {notificationOpen ? (
              <HeaderMenu className={headerTone.menu}>
                <div className="px-2 py-1 text-[11px] text-text-muted">
                  通知
                </div>
                {notifications.map((item) => (
                  <button
                    className="block w-full rounded-[3px] px-2 py-2 text-left text-[12px] transition hover:text-[var(--syn-accent)]"
                    key={item}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </HeaderMenu>
            ) : null}
          </div>
          <button
            className={`flex h-10 items-center gap-2 rounded-[var(--syn-radius)] border bg-transparent px-2 pr-3 text-[13px] font-medium transition ${headerTone.button}`}
            onClick={() => setUserMenuOpen((open) => !open)}
            title="账号菜单"
            type="button"
          >
            {avatarImageSrc ? (
              <span className="relative size-7 overflow-hidden rounded-full bg-[#111118]">
                <Image
                  alt={`${displayName} avatar`}
                  className="object-cover"
                  fill
                  sizes="28px"
                  src={avatarImageSrc}
                />
              </span>
            ) : (
              <span className="grid size-7 place-items-center rounded-[var(--syn-radius)] bg-[var(--syn-accent)] text-[12px] font-semibold text-white">
                {shortName}
              </span>
            )}
            <span className="inline-block max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px]">
              {displayLabel}
            </span>
          </button>
          {userMenuOpen ? (
            <div
              className={`absolute right-6 top-14 z-40 w-40 rounded-[var(--syn-radius)] border p-1 ${headerTone.menu}`}
            >
              <button
                className="block w-full rounded-[3px] px-2 py-2 text-left text-[12px] transition hover:text-[var(--syn-accent)]"
                type="button"
              >
                个人资料
              </button>
              <button
                className="block w-full rounded-[3px] px-2 py-2 text-left text-[12px] transition hover:text-[var(--syn-accent)]"
                type="button"
              >
                设置
              </button>
              <button
                className="block w-full rounded px-2 py-2 text-left text-[12px] text-danger transition hover:bg-danger/10"
                onClick={onLogout}
                type="button"
              >
                退出登录
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function HeaderMenu({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <div
      className={`absolute right-0 top-12 z-40 w-52 rounded-[var(--syn-radius)] border p-1 ${className}`}
    >
      {children}
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 text-text-soft"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M6.75 10.2c0-3.23 2.07-5.7 5.25-5.7s5.25 2.47 5.25 5.7v2.76l1.5 2.62H5.25l1.5-2.62V10.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.75 18.2c.42.83 1.2 1.3 2.25 1.3s1.83-.47 2.25-1.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}
