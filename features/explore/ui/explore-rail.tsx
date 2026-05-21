import { papers, people, tracks } from "../data/explore-fixtures";
import { SidebarHeading } from "./explore-heading";

export function ExploreRail({
  followed,
  onFollowToggle,
}: {
  followed: string[];
  onFollowToggle: (name: string) => void;
}) {
  return (
    <aside className="min-h-0 overflow-auto border-l border-[var(--syn-hairline-light)] px-6 py-10">
      <SidebarHeading>本周热门 Track</SidebarHeading>
      <div className="space-y-5">
        {tracks.map(([rank, title, handle, score]) => (
          <button
            className="grid w-full grid-cols-[34px_minmax(0,1fr)_52px] items-start gap-3 bg-transparent text-left"
            key={title}
            type="button"
          >
            <span className="font-mono text-[20px] font-semibold text-[var(--syn-reading-muted)]">
              {rank}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-[var(--syn-reading-ink)]">
                {title}
              </span>
              <span className="mt-1 block truncate font-mono text-[11px] text-[var(--syn-reading-muted)]">
                {handle}
              </span>
            </span>
            <span className="text-right font-mono text-[12px] text-[var(--syn-accent)]">
              {score}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-9">
        <SidebarHeading>Recently cited papers</SidebarHeading>
        <div className="space-y-3">
          {papers.map(([id, title, author, cites]) => (
            <button
              className="block w-full border-b border-[var(--syn-hairline-light)] py-4 text-left transition hover:text-[var(--syn-accent)]"
              key={id}
              type="button"
            >
              <div className="font-mono text-[12px] text-[var(--syn-accent)]">
                {id}
              </div>
              <div className="mt-2 text-[13px] font-medium leading-5 text-[var(--syn-reading-ink)]">
                {title}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-[var(--syn-reading-muted)]">
                <span>{author}</span>
                <span>↗ {cites}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-9">
        <SidebarHeading>建议关注</SidebarHeading>
        <div className="space-y-4">
          {people.map(([name, handle, meta, color]) => {
            const isFollowed = followed.includes(name);

            return (
              <div
                className="grid grid-cols-[36px_minmax(0,1fr)_84px] items-center gap-3"
                key={name}
              >
                <span
                  className={`size-8 rounded-[var(--syn-radius)] ${color}`}
                />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-[var(--syn-reading-ink)]">
                    {name}
                  </div>
                  <div className="truncate font-mono text-[11px] text-[var(--syn-reading-muted)]">
                    {handle} · {meta}
                  </div>
                </div>
                <button
                  className={[
                    "h-7 rounded-[var(--syn-radius)] border px-3 text-[11px] transition",
                    isFollowed
                      ? "border-[var(--syn-accent)] bg-[var(--syn-accent-soft)] text-[var(--syn-accent)]"
                      : "border-[var(--syn-hairline-light)] text-[var(--syn-reading-secondary)] hover:text-[var(--syn-reading-ink)]",
                  ].join(" ")}
                  onClick={() => onFollowToggle(name)}
                  type="button"
                >
                  {isFollowed ? "Following" : "+ Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
