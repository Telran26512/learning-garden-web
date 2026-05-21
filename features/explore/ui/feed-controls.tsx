import { feedTabs, ranges } from "../data/explore-fixtures";
import type { ExploreFeedTab, ExploreRange } from "../model/explore-model";

export function FeedControls({
  activeRange,
  activeTab,
  onRangeChange,
  onTabChange,
}: {
  activeRange: ExploreRange;
  activeTab: ExploreFeedTab;
  onRangeChange: (range: ExploreRange) => void;
  onTabChange: (tab: ExploreFeedTab) => void;
}) {
  return (
    <div className="mt-10 flex items-end justify-between border-b border-[var(--syn-hairline-light)]">
      <div className="flex items-center gap-7">
        {feedTabs.map((tab) => (
          <button
            className={[
              "relative pb-3 text-[14px] transition",
              activeTab === tab
                ? "text-[var(--syn-reading-ink)] after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-full after:bg-[var(--syn-accent)]"
                : "text-[var(--syn-reading-muted)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            key={tab}
            onClick={() => onTabChange(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[12px] text-[var(--syn-reading-muted)]">
          Range
        </span>
        {ranges.map((range) => (
          <button
            className={[
              "h-7 rounded-[var(--syn-radius)] border px-2.5 font-mono text-[11px] transition",
              activeRange === range
                ? "border-[var(--syn-accent)] bg-[var(--syn-accent-soft)] text-[var(--syn-accent)]"
                : "border-[var(--syn-hairline-light)] text-[var(--syn-reading-muted)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            key={range}
            onClick={() => onRangeChange(range)}
            type="button"
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}
