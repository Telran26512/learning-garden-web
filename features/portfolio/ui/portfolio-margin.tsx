import Link from "next/link";

import {
  buildContributionWeeks,
  contributionFilters,
  type ContributionFilter,
} from "../model/portfolio-model";
import type { PortfolioViewData } from "../api/portfolio-live-data";
import { heatmapColor } from "./portfolio-visuals";

export function PortfolioMargin({
  activeDays,
  contributionFilter,
  contributionWeeks,
  data,
  onFilterChange,
}: {
  activeDays: number;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  data: PortfolioViewData;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <aside className="space-y-10 text-[13px] leading-6 text-[#6A6056] xl:sticky xl:top-24 xl:self-start">
      <ContributionAside
        activeDays={activeDays}
        contributionFilter={contributionFilter}
        contributionWeeks={contributionWeeks}
        onFilterChange={onFilterChange}
      />
      <QuietStats stats={data.stats} />
      <BlockDistribution distribution={data.blockDistribution} />
      <TopicsList topTopics={data.topTopics} />
    </aside>
  );
}

function ContributionAside({
  activeDays,
  contributionFilter,
  contributionWeeks,
  onFilterChange,
}: {
  activeDays: number;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <section className="border-t border-[var(--syn-hairline-light)] pt-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="[font-family:var(--font-display)] text-[18px] font-medium text-[var(--syn-reading-ink)]">
          Writing rhythm
        </h2>
        <span className="font-mono text-[11px] text-[var(--syn-reading-muted)]">
          {activeDays} days
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
        {contributionFilters.map((filter) => (
          <button
            className={[
              "border-b pb-0.5 text-[12px] transition",
              contributionFilter === filter.key
                ? "border-[var(--syn-accent)] text-[var(--syn-accent)]"
                : "border-transparent text-[var(--syn-reading-muted)] hover:border-[var(--syn-hairline-light)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden">
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${contributionWeeks.length}, minmax(0, 1fr))`,
          }}
        >
          {contributionWeeks.map((week, weekIndex) => (
            <div className="grid grid-rows-7 gap-[3px]" key={weekIndex}>
              {week.map((entry) => (
                <span
                  aria-label={`${entry.date}: ${entry.count} contributions`}
                  className={`aspect-square rounded-[1px] ${heatmapColor(entry.level)}`}
                  key={entry.date}
                  title={`${entry.date}: ${entry.count}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuietStats({ stats }: { stats: PortfolioViewData["stats"] }) {
  return (
    <section className="border-t border-[var(--syn-hairline-light)] pt-5">
      <h2 className="[font-family:var(--font-display)] text-[18px] font-medium text-[var(--syn-reading-ink)]">
        Archive
      </h2>
      <dl className="mt-4 space-y-2">
        {stats.map((item) => (
          <div className="flex justify-between gap-5" key={item.label}>
            <dt className="text-[var(--syn-reading-secondary)]">
              {item.label}
            </dt>
            <dd className="font-mono text-[12px] text-[var(--syn-reading-ink)]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function BlockDistribution({
  distribution,
}: {
  distribution: PortfolioViewData["blockDistribution"];
}) {
  if (distribution.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[var(--syn-hairline-light)] pt-5">
      <h2 className="[font-family:var(--font-display)] text-[18px] font-medium text-[var(--syn-reading-ink)]">
        Block distribution
      </h2>
      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-[var(--syn-hairline-light)]">
        {distribution.map((item) => (
          <span
            aria-label={`${item.label}: ${item.percent}%`}
            key={item.label}
            style={{ backgroundColor: item.color, width: `${item.percent}%` }}
          />
        ))}
      </div>
      <dl className="mt-4 space-y-2">
        {distribution.map((item) => (
          <div
            className="flex items-center justify-between gap-4"
            key={item.label}
          >
            <dt className="flex items-center gap-2 text-[var(--syn-reading-secondary)]">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </dt>
            <dd className="font-mono text-[12px] text-[var(--syn-reading-ink)]">
              {item.count} · {item.percent}%
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TopicsList({
  topTopics,
}: {
  topTopics: PortfolioViewData["topTopics"];
}) {
  return (
    <section className="border-t border-[var(--syn-hairline-light)] pt-5">
      <h2 className="[font-family:var(--font-display)] text-[18px] font-medium text-[var(--syn-reading-ink)]">
        Marginal tags
      </h2>
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
        {topTopics.map(([topic, count]) => (
          <Link
            className="border-b border-transparent pb-0.5 text-[12px] text-[var(--syn-reading-secondary)] transition hover:border-[var(--syn-hairline-light)] hover:text-[var(--syn-reading-ink)]"
            href={`/app?view=portfolio&tag=${encodeURIComponent(topic)}`}
            key={topic}
          >
            #{topic} <span className="font-mono">{count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
