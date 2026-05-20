import Link from "next/link";

export function InlineStatusBar() {
  return (
    <div className="mb-14 mt-5 flex h-8 items-center gap-10 overflow-x-auto whitespace-nowrap text-[14px] font-normal leading-none">
      <div className="flex items-center gap-2">
        <span className="text-text-muted">当前</span>
        <Link
          className="font-medium text-white hover:underline"
          href="/app?view=editor&task=multi-head-attention"
        >
          Multi-Head Attention 推导
        </Link>
        <span className="text-text-secondary">·</span>
        <span className="text-text-secondary">§3.2.2 step 2/5</span>
        <Link
          aria-label="进入当前任务"
          className="text-text-muted transition hover:text-white"
          href="/app?view=editor&task=multi-head-attention"
        >
          →
        </Link>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-text-muted md:text-[14px]">
        <Link
          className="group text-text-muted transition hover:text-white"
          href="/app?view=review"
        >
          <span className="text-white">12</span>{" "}
          <span className="group-hover:text-white">cards due</span>
        </Link>
        <span className="text-text-dim">·</span>
        <button
          className="bg-transparent p-0 text-text-muted transition hover:text-white"
          title="历史最长 18 天"
          type="button"
        >
          连续 <span className="text-white">5</span> 天
        </button>
        <span className="text-text-dim">·</span>
        <button
          className="bg-transparent p-0 text-text-muted transition hover:text-white"
          title="34 / 55 任务"
          type="button"
        >
          阶段 <span className="text-white">62%</span> (
          <span className="text-white">34</span> /{" "}
          <span className="text-white">55</span>)
        </button>
      </div>
    </div>
  );
}
