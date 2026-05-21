export function FeaturedTrack() {
  return (
    <article className="mt-8 grid overflow-hidden border-y border-[var(--syn-hairline-light)] bg-transparent lg:grid-cols-[1fr_300px]">
      <div className="py-8 pr-8">
        <div className="flex items-center gap-3">
          <span className="syn-kicker text-[var(--syn-accent)]">Featured</span>
          <span className="text-[12px] text-[var(--syn-reading-muted)]">
            本周编辑精选
          </span>
        </div>
        <h2 className="syn-title mt-5 text-[31px] leading-tight text-[var(--syn-reading-ink)]">
          GRPO 复现日志: 8x H100 上的 4 天
        </h2>
        <p className="mt-5 max-w-[620px] text-[16px] leading-[1.78] text-[var(--syn-reading-secondary)]">
          从 DeepSeekMath 提出的 GRPO 原理推导出发,跨过 ε-clip、KL 估计与
          advantage 归一化这三个工程坑,产出一份 320 行的 PyTorch + DeepSpeed
          复现。
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12px] text-[var(--syn-reading-muted)]">
          <span className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-[var(--syn-radius)] bg-[var(--syn-accent)] text-white" />
            @maxwell-tu
          </span>
          <span>3 Block · 2 Paper · 4 Code</span>
          <span>↑ 412</span>
          <span>38 comments</span>
          <span>12 cites</span>
        </div>
      </div>
      <div className="border-l border-[var(--syn-hairline-light)] py-8 pl-7">
        <div className="syn-kicker text-[var(--syn-reading-muted)]">
          Block 预览
        </div>
        <MiniChart />
        <button
          className="mt-12 h-10 w-full rounded-[var(--syn-radius)] border border-[var(--syn-accent)] text-[13px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)]"
          type="button"
        >
          查看 Track →
        </button>
      </div>
    </article>
  );
}

function MiniChart() {
  return (
    <svg
      aria-label="GRPO track score trend"
      className="mt-6 h-28 w-full text-[var(--syn-accent)]"
      role="img"
      viewBox="0 0 260 110"
    >
      <path
        d="M0 92 L0 18 L38 48 L72 58 L105 70 L143 74 L180 83 L222 90 L260 94 L260 110 L0 110 Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M0 18 L38 48 L72 58 L105 70 L143 74 L180 83 L222 90 L260 94"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}
