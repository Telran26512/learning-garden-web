"use client";

import type { Portfolio } from "@/lib/api";

export function PortfolioScreen({ portfolio }: { portfolio: Portfolio }) {
  return (
    <section className="py-8">
      <header className="border-b hair pb-6">
        <div className="sect-label">M5 Portfolio</div>
        <h1 className="mt-2 font-serif text-[34px] font-semibold tracking-[-0.05em]">
          {portfolio.owner.displayName} 的作品集
        </h1>
        <p className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-slate-500">
          把概念链、项目和写作证据聚合为可浏览的学习档案。
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="py-6 lg:border-r lg:pr-8 hair">
          <div className="sect-label">Highlights</div>
          <div className="mt-4 divide-y hair border-y hair">
            {portfolio.highlights.map((item) => (
              <div className="flex items-baseline justify-between py-3" key={item.label}>
                <span className="text-[12px] text-slate-500">{item.label}</span>
                <span className="num text-[20px] font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-400">更新 {formatShortDate(portfolio.updatedAt)}</p>
        </aside>

        <div className="py-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[18px] font-semibold">证据链</h2>
            <span className="sect-label">{portfolio.evidence.length} items</span>
          </div>
          <div className="divide-y hair border-y hair">
            {portfolio.evidence.map((item) => (
              <article className="grid gap-2 py-4 md:grid-cols-[140px_minmax(0,1fr)]" key={item.id}>
                <div className="sect-label">{item.type}</div>
                <div>
                  <h3 className="text-[15px] font-semibold">{item.title}</h3>
                  <p className="mt-1 max-w-[72ch] text-[13px] leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(
    new Date(value),
  );
}
