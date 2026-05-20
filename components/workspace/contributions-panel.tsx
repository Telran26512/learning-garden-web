import { activityBlocksLast30 } from "./data/mocks";

export function ContributionsPanel() {
  const width = 360;
  const height = 96;
  const padding = 8;
  const maxBlocks = Math.max(...activityBlocksLast30, 1);
  const points = activityBlocksLast30
    .map((value, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / (activityBlocksLast30.length - 1);
      const y = height - padding - (value * (height - padding * 2)) / maxBlocks;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <section className="rounded-md border border-border-subtle bg-black p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[13px] font-medium text-text-secondary">
          过去 30 天
        </h2>
        <span className="text-[12px] text-text-muted">active blocks / day</span>
      </div>
      <div>
        <svg
          aria-label="过去 30 天每日 active blocks 折线图"
          className="h-24 w-full overflow-visible"
          preserveAspectRatio="none"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
        >
          <line
            stroke="#1F1F1F"
            strokeWidth="1"
            x1={padding}
            x2={width - padding}
            y1={height - padding}
            y2={height - padding}
          />
          <polyline
            fill="none"
            points={points}
            stroke="#D1D5DB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-3 flex items-center justify-between text-[11px] text-text-secondary sm:text-[12px]">
          <span>
            平均 <span className="font-semibold text-white">4.2</span> / day
          </span>
          <span>
            最近 7 天 <span className="font-semibold text-white">32</span>
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted tabular-nums">
          <span>4/20</span>
          <span>5/19</span>
        </div>
      </div>
    </section>
  );
}
