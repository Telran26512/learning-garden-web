import Link from "next/link";

export function InlineStatusBar() {
  return (
    <div className="mb-14 mt-5 flex h-8 items-center gap-10 overflow-x-auto whitespace-nowrap text-[14px] font-normal leading-none">
      <div className="flex items-center gap-2">
        <span className="text-[var(--syn-working-muted)]">当前</span>
        <Link
          className="font-medium text-[var(--syn-working-ink)] hover:underline"
          href="/app?view=editor&task=multi-head-attention"
        >
          Multi-Head Attention 推导
        </Link>
        <span className="text-[var(--syn-working-secondary)]">·</span>
        <span className="text-[var(--syn-working-secondary)]">
          §3.2.2 step 2/5
        </span>
        <Link
          aria-label="进入当前任务"
          className="text-[var(--syn-working-muted)] transition hover:text-[var(--syn-accent)]"
          href="/app?view=editor&task=multi-head-attention"
        >
          →
        </Link>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-[var(--syn-working-muted)] md:text-[14px]">
        <Link
          className="group text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
          href="/app"
        >
          <span className="text-[var(--syn-working-ink)]">12</span>{" "}
          <span className="group-hover:text-[var(--syn-working-ink)]">
            cards due
          </span>
        </Link>
        <span className="text-[var(--syn-working-muted)]">·</span>
        <button
          className="bg-transparent p-0 text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
          title="历史最长 18 天"
          type="button"
        >
          连续 <span className="text-[var(--syn-working-ink)]">5</span> 天
        </button>
        <span className="text-[var(--syn-working-muted)]">·</span>
        <button
          className="bg-transparent p-0 text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
          title="34 / 55 任务"
          type="button"
        >
          阶段 <span className="text-[var(--syn-working-ink)]">62%</span> (
          <span className="text-[var(--syn-working-ink)]">34</span> /{" "}
          <span className="text-[var(--syn-working-ink)]">55</span>)
        </button>
      </div>
    </div>
  );
}
