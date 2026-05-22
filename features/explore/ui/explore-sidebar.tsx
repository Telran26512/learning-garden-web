import { discoverItems } from "../data/explore-fixtures";
import { SidebarHeading } from "./explore-heading";

export function ExploreSidebar({
  activeDiscover,
  activeTag,
  onDiscoverChange,
  onTagChange,
  tagStats,
}: {
  activeDiscover: string;
  activeTag: string;
  onDiscoverChange: (id: string) => void;
  onTagChange: (tag: string) => void;
  tagStats: readonly (readonly [string, string])[];
}) {
  return (
    <aside className="sticky top-14 h-[calc(100dvh-3.5rem)] self-start overflow-auto border-r border-[var(--syn-hairline-light)] px-5 py-10">
      <SidebarHeading>Discover</SidebarHeading>
      <div className="space-y-1">
        {discoverItems.map((item) => (
          <button
            className={[
              "flex w-full items-center gap-3 rounded-[var(--syn-radius)] px-3 py-3 text-left transition",
              activeDiscover === item.id
                ? "bg-[var(--syn-accent-soft)] text-[var(--syn-accent)]"
                : "text-[var(--syn-reading-secondary)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            key={item.id}
            onClick={() => onDiscoverChange(item.id)}
            type="button"
          >
            <span className="w-8 font-mono text-[10px] text-[var(--syn-reading-muted)]">
              {item.mark}
            </span>
            <span className="text-[14px]">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <SidebarHeading>Tags</SidebarHeading>
        <div className="space-y-3">
          {tagStats.map(([tag, count]) => (
            <button
              className={[
                "flex w-full items-center justify-between gap-4 bg-transparent px-1 text-left text-[12px] transition hover:text-[var(--syn-reading-ink)]",
                activeTag === tag
                  ? "text-[var(--syn-accent)]"
                  : "text-[var(--syn-reading-secondary)]",
              ].join(" ")}
              key={tag}
              onClick={() => onTagChange(activeTag === tag ? "" : tag)}
              type="button"
            >
              <span>#{tag}</span>
              <span className="font-mono text-[var(--syn-reading-muted)]">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-9 border-t border-[var(--syn-hairline-light)] pt-4">
        <div className="syn-kicker text-[var(--syn-reading-muted)]">TIP</div>
        <p className="mt-3 text-[12px] leading-6 text-[var(--syn-reading-secondary)]">
          关注一个 Tag, Feed 里会出现这个 Tag 下被高质量 cite 的新 Block。
        </p>
      </div>
    </aside>
  );
}
