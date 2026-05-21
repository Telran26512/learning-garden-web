import type { ExploreFeedItem } from "../model/explore-model";

export function FeedCard({ item }: { item: ExploreFeedItem }) {
  return (
    <article className="border-b border-[var(--syn-hairline-light)] py-7 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-[var(--syn-radius)] text-[13px] font-semibold text-white ${item.color}`}
          >
            {item.avatar}
          </span>
          <div className="min-w-0 text-[12px]">
            <span className="font-medium text-[var(--syn-reading-ink)]">
              {item.author}
            </span>
            <span className="ml-2 text-[var(--syn-reading-muted)]">
              {item.handle}
            </span>
            <span className="ml-2 text-[var(--syn-reading-muted)]">
              · {item.meta}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 font-mono text-[10px] text-[var(--syn-reading-muted)]">
          {item.swatches.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      </div>

      <h3 className="syn-title mt-5 text-[26px] leading-snug text-[var(--syn-reading-ink)]">
        {item.title}
      </h3>
      <p className="mt-4 max-w-[760px] text-[15px] leading-[1.78] text-[var(--syn-reading-secondary)]">
        {item.body}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5 font-mono text-[12px] text-[var(--syn-reading-muted)]">
          <span>↑ {item.votes}</span>
          <span>● {item.comments}</span>
          <span>↗ {item.cites} cites</span>
        </div>
        <div className="flex flex-wrap gap-x-2 text-[12px] text-[var(--syn-reading-muted)]">
          {item.tags.map((tag, index) => (
            <span key={tag}>
              #{tag}
              {index < item.tags.length - 1 ? " ·" : ""}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
