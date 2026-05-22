import Link from "next/link";

import { currentWritingExcerpt } from "../model/portfolio-copy";
import type { PortfolioTabKey } from "../model/portfolio-model";
import type { PortfolioViewData } from "../api/portfolio-live-data";

export function EditorialHero({
  followDisabled,
  followNotice,
  followPending,
  followed,
  onFollowToggle,
  onShare,
  profile,
  shareNotice,
}: {
  followDisabled?: boolean;
  followNotice?: string;
  followPending?: boolean;
  followed: boolean;
  onFollowToggle: () => void;
  onShare: () => void;
  profile: PortfolioViewData["profile"];
  shareNotice: string;
}) {
  return (
    <header className="grid gap-12 border-b border-[var(--syn-hairline-light)] pb-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pb-16">
      <div className="min-w-0">
        <p className="font-mono text-[12px] text-[var(--syn-reading-secondary)]">
          {profile.site} / machine learning notes
        </p>
        <h1 className="mt-5 max-w-[760px] text-balance [font-family:var(--font-display)] text-[52px] font-medium leading-[0.98] text-[var(--syn-reading-ink)] sm:text-[72px] lg:text-[88px]">
          {profile.name}
        </h1>
        <p className="mt-8 max-w-[720px] text-[17px] leading-[1.75] text-[var(--syn-reading-secondary)] sm:text-[18px]">
          {profile.bio}
        </p>

        <section className="mt-14 max-w-[900px] border-l-2 border-[var(--syn-accent)] pl-6 sm:pl-8">
          <p className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
            Currently writing
          </p>
          <h2 className="mt-4 text-balance [font-family:var(--font-display)] text-[34px] font-medium leading-[1.12] text-[var(--syn-reading-ink)] sm:text-[46px]">
            {profile.currentWriting.replace(/\.$/, "")}
          </h2>
          <blockquote className="mt-6 max-w-[760px] text-[19px] leading-[1.7] text-[var(--syn-reading-ink)] sm:text-[21px]">
            “{currentWritingExcerpt}”
          </blockquote>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] text-[var(--syn-accent)]">
            <Link
              className="border-b border-[var(--syn-accent)] pb-0.5 transition hover:border-[var(--syn-accent)] hover:text-[var(--syn-accent-hover)]"
              href="/app?view=portfolio&tab=tracks"
            >
              Read the working track
            </Link>
            <Link
              className="border-b border-transparent pb-0.5 text-[var(--syn-reading-secondary)] transition hover:border-[var(--syn-hairline-light)] hover:text-[var(--syn-reading-ink)]"
              href="/app?view=portfolio&tab=notes"
            >
              Browse recent notes
            </Link>
          </div>
        </section>
      </div>

      <aside className="self-start border-t border-[var(--syn-hairline-light)] pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center border border-[var(--syn-hairline-light)] bg-[var(--syn-reading-surface)] [font-family:var(--font-display)] text-[26px] text-[var(--syn-reading-ink)]">
            {profile.avatar}
          </div>
          <div>
            <p className="text-[15px] font-medium text-[var(--syn-reading-ink)]">
              {profile.handle}
            </p>
            <p className="mt-1 text-[13px] text-[var(--syn-reading-secondary)]">
              {profile.location} · joined {profile.joined}
            </p>
          </div>
        </div>

        <dl className="mt-8 space-y-4 border-t border-[var(--syn-hairline-light)] pt-6 text-[13px] leading-6">
          <div>
            <dt className="font-mono text-[11px] text-[var(--syn-reading-muted)]">
              Contact
            </dt>
            <dd className="mt-1 text-[var(--syn-reading-ink)]">
              {profile.email}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-[var(--syn-reading-muted)]">
              Code
            </dt>
            <dd className="mt-1 text-[var(--syn-reading-ink)]">
              {profile.github}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex gap-3">
          <button
            className="h-9 border border-[var(--syn-hairline-light)] px-4 text-[13px] text-[var(--syn-reading-ink)] transition hover:border-[var(--syn-accent)] hover:text-[var(--syn-accent)] active:translate-y-px"
            onClick={onShare}
            type="button"
          >
            {shareNotice || "Share"}
          </button>
          <button
            className="h-9 bg-[var(--syn-accent)] px-4 text-[13px] font-medium text-[#FFFFFF] transition hover:bg-[var(--syn-accent-hover)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
            disabled={followDisabled}
            onClick={onFollowToggle}
            type="button"
          >
            {followPending
              ? "处理中"
              : followDisabled && !followed
                ? "Own profile"
                : followed
                  ? "Following"
                  : "Follow"}
          </button>
        </div>
        {followNotice ? (
          <p className="mt-3 text-[12px] text-[var(--syn-reading-secondary)]">
            {followNotice}
          </p>
        ) : null}
      </aside>
    </header>
  );
}

export function PortfolioTabs({
  activeTab,
  tabs,
}: {
  activeTab: PortfolioTabKey;
  tabs: PortfolioViewData["tabs"];
}) {
  return (
    <nav
      aria-label="Portfolio sections"
      className="flex gap-8 overflow-x-auto border-b border-[var(--syn-hairline-light)] pt-7"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <a
            className={[
              "shrink-0 border-b-2 pb-3 text-[14px] transition",
              isActive
                ? "border-[var(--syn-accent)] text-[var(--syn-reading-ink)]"
                : "border-transparent text-[var(--syn-reading-secondary)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            href={tab.href}
            key={tab.key}
          >
            {tab.label}
            {tab.count ? (
              <span className="ml-2 font-mono text-[11px] text-[var(--syn-reading-muted)]">
                {tab.count}
              </span>
            ) : null}
          </a>
        );
      })}
    </nav>
  );
}
