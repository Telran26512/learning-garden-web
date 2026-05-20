import Link from "next/link";
import { SynapseLogo } from "@/components/synapse/synapse-logo";
import { WORKSPACE_NAV_ITEMS } from "./data/nav-items";

type WorkspaceHeaderProps = {
  displayName: string;
  shortName: string;
  onLogout: () => void;
};

export function WorkspaceHeader({
  displayName,
  shortName,
  onLogout,
}: WorkspaceHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-base/95 backdrop-blur-xl">
      <div className="flex min-h-14 items-center gap-4 px-4 sm:px-6">
        <Link
          className="flex min-w-max items-center gap-2.5 text-[16px] font-semibold text-white"
          href="/"
          aria-label="Synapse 首页"
        >
          <span className="text-white">
            <SynapseLogo size={24} />
          </span>
          <span>Synapse</span>
        </Link>
        <nav
          className="hidden h-14 items-stretch gap-6 overflow-x-auto text-[14px] lg:flex"
          aria-label="Primary"
        >
          {WORKSPACE_NAV_ITEMS.map((item) =>
            item === "Workspace" ? (
              <Link
                className="flex items-center border-b-2 border-white px-0 text-white transition"
                href="/app"
                key={item}
              >
                {item}
              </Link>
            ) : (
              <button
                className="border-b-2 border-transparent px-0 text-text-muted transition hover:text-white"
                key={item}
                type="button"
              >
                {item}
              </button>
            ),
          )}
        </nav>
        <div className="ml-auto hidden w-full max-w-[360px] items-center rounded-md border border-border-subtle bg-black px-3 text-text-muted md:flex xl:max-w-[520px] 2xl:max-w-[620px]">
          <span className="mr-2 text-[13px]">⌕</span>
          <input
            className="h-10 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-text-muted"
            placeholder="跳转 / 搜索"
            type="search"
          />
          <kbd className="rounded border border-border-strong px-1.5 py-0.5 text-[11px] text-text-secondary">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-md border border-border-strong bg-transparent px-3 text-[13px] font-medium text-text-soft transition hover:bg-surface-hover sm:inline-flex"
            type="button"
          >
            <span className="text-[12px] leading-none">+</span>
            <span>新建</span>
          </button>
          <button
            className="relative grid size-10 place-items-center rounded-md border border-border-strong bg-transparent text-[16px] transition hover:bg-surface-hover"
            type="button"
            aria-label="通知"
          >
            <BellIcon />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
          </button>
          <span className="hidden text-[10px] text-text-muted sm:inline">
            周二 · 5/19
          </span>
          <button
            className="flex h-10 items-center gap-2 rounded-md border border-border-strong bg-transparent px-2 pr-3 text-[13px] font-medium text-text-strong transition hover:bg-surface-hover"
            onClick={onLogout}
            title="退出登录"
            type="button"
          >
            <span className="grid size-7 place-items-center rounded-full bg-surface-strong text-[12px] font-semibold text-white">
              {shortName}
            </span>
            <span className="hidden sm:inline">{displayName}</span>
          </button>
        </div>
      </div>
    </header>
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
