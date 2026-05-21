import {
  communityHero,
  communityStats,
  communityTabs,
} from "../model/community-model";

export function CommunityHero() {
  return (
    <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-end">
      <div>
        <p className="syn-kicker mb-5 text-[var(--syn-reading-muted)]">
          {communityHero.eyebrow}
        </p>
        <h1 className="syn-title text-[40px] leading-tight text-[var(--syn-reading-ink)] sm:text-[56px]">
          {communityHero.title}
        </h1>
        <p className="mt-5 max-w-[760px] text-[16px] leading-[1.78] text-[var(--syn-reading-secondary)]">
          {communityHero.subtitle}
        </p>
      </div>

      <section className="border-l border-[var(--syn-hairline-light)] p-5">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {communityStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[22px] font-semibold leading-none text-[var(--syn-reading-ink)]">
                {stat.value}
              </p>
              <p className="syn-kicker mt-3 text-[var(--syn-reading-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </header>
  );
}

export function CommunityTabs({ activeTab }: { activeTab: string }) {
  return (
    <div className="mt-9 flex flex-col gap-4 border-b border-border-subtle pb-5 lg:flex-row lg:items-center lg:justify-between">
      <nav className="flex gap-2 overflow-x-auto" aria-label="Community feed">
        {communityTabs.map((tab) => {
          const key = tab.href.includes("&tab=")
            ? tab.href.split("&tab=")[1]
            : "for-you";
          const active = key === activeTab;

          return (
            <a
              className={[
                "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] transition",
                active
                  ? "bg-transparent text-white"
                  : "text-text-secondary hover:bg-white/[0.03] hover:text-white",
              ].join(" ")}
              href={tab.href}
              key={tab.label}
            >
              <span>{tab.label}</span>
              {tab.count ? (
                <span className="font-mono text-[10px] text-text-muted">
                  {tab.count}
                </span>
              ) : null}
            </a>
          );
        })}
      </nav>

      <div className="flex flex-wrap items-center gap-4">
        <span className="rounded-lg border border-border-subtle bg-transparent px-3 py-2 text-[12px] text-text-secondary">
          RL × Inference ×
        </span>
        <span className="text-[12px] text-text-secondary">
          Sort: <span className="text-text-soft">Hot · 24h ↓</span>
        </span>
      </div>
    </div>
  );
}
