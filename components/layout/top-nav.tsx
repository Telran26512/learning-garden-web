"use client";

import Image from "next/image";
import Link from "next/link";
import {
  navItems,
  screenRoutes,
  type GoToScreen,
  type NavScreen,
  type Screen,
} from "@/lib/navigation/synapse-navigation";
import { cn } from "@/lib/utils/cn";

type TopNavProps = {
  active: Screen;
  goTo?: GoToScreen;
};

export function TopNav({ active, goTo }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-20 border-b hair bg-[rgba(250,247,239,0.92)] backdrop-blur">
      <div className="mx-auto flex h-[52px] max-w-[1200px] items-center gap-8 px-6">
        <NavLogo goTo={goTo} />
        <div className="flex h-[52px] items-center gap-7 text-[13px]">
          {navItems.map((item) => (
            <NavItem active={active === item.screen} goTo={goTo} item={item} key={item.screen} />
          ))}
        </div>
        <div className="flex-1" />
        <div className="inp hidden items-center gap-1.5 bg-white/45 px-2.5 py-1.5 text-[12px] text-[color:var(--muted)] md:flex">
          <span>⌕</span>
          <span>搜索概念、笔记、论文…</span>
          <span className="ml-5 rounded border hair bg-[var(--paper)] px-1 text-[11px]">⌘K</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar size="sm" />
          <div className="leading-tight">
            <div className="text-[12px] font-medium">Raymond</div>
            <div className="text-[10px] text-slate-400">Level 6</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLogo({ goTo }: { goTo?: GoToScreen }) {
  const className = "focus-ring flex items-center gap-2 rounded text-[15px] font-bold";
  const children = (
    <>
      <LogoMark />
      <span>Synapse</span>
    </>
  );

  if (goTo) {
    return (
      <button className={className} onClick={() => goTo("workspace")} type="button">
        {children}
      </button>
    );
  }

  return (
    <Link className={className} href={screenRoutes.workspace}>
      {children}
    </Link>
  );
}

function NavItem({
  active,
  goTo,
  item,
}: {
  active: boolean;
  goTo?: GoToScreen;
  item: { label: string; screen: NavScreen };
}) {
  const className = cn(
    "focus-ring relative flex h-[52px] items-center text-slate-600 transition hover:text-garden-700",
    active &&
      "font-semibold text-garden-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded after:bg-garden-700",
  );

  if (goTo) {
    return (
      <button className={className} onClick={() => goTo(item.screen)} type="button">
        {item.label}
      </button>
    );
  }

  return (
    <Link className={className} href={screenRoutes[item.screen]}>
      {item.label}
    </Link>
  );
}

export function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-garden-100 font-bold text-garden-700",
        size === "sm" ? "h-8 w-8 text-[12px]" : "mx-auto h-16 w-16 text-[22px]",
      )}
    >
      R
      <Image
        alt="Raymond profile avatar"
        className="absolute inset-0 h-full w-full object-cover"
        height={size === "sm" ? 32 : 64}
        priority={size === "sm"}
        src="/avatar.jpg"
        width={size === "sm" ? 32 : 64}
      />
    </div>
  );
}

function LogoMark() {
  return (
    <svg className="shrink-0" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="#2f9e57"
        d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
      />
      <path
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="1.5"
        fill="none"
        d="M16.5 6.6C12.6 9 10.6 12.9 10 18.4"
      />
      <path
        stroke="#2f9e57"
        strokeLinecap="round"
        strokeWidth="2.2"
        fill="none"
        d="M2.6 21c0-2.9 1.7-5.1 4.7-5.8"
      />
    </svg>
  );
}
