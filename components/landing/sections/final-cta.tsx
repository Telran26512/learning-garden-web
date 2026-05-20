export function LandingFinalCTA() {
  return (
    <section className="sn-reveal py-[120px]">
      <div className="sn-shell text-center">
        <h2 className="m-0 text-[clamp(32px,4vw,36px)] leading-tight font-semibold tracking-normal text-white [font-family:var(--font-sans)]">
          准备把你的学习连成网了吗？
        </h2>
        <p className="mx-auto mt-6 max-w-[560px] text-sm leading-6 text-text-secondary">
          免费开始，永久免费层支持无限 Note 和 3 个 Track。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-elevated px-5 text-sm font-semibold text-white transition-colors hover:bg-surface-strong"
            href="/auth?mode=register"
          >
            免费开始 →
          </a>
          <a
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-border-emphasis px-5 text-sm font-semibold text-white transition-colors hover:bg-surface-strong"
            href="#community"
          >
            浏览社区
          </a>
        </div>
      </div>
    </section>
  );
}
