import type {
  CommunityNodeKind,
  CommunityTrack,
  FeaturedCommunity,
} from "@/lib/types/synapse";
import { COMMUNITY_TRACKS, FEATURED_COMMUNITY } from "../../data/community";

export function LandingCommunity() {
  return (
    <section id="community" className="sn-section sn-reveal">
      <div className="sn-shell">
        <div className="text-[11px] tracking-[0.05em] text-text-secondary [font-family:var(--font-mono)]">
          03 / 社区 · 最近一周 23 个新 Track
        </div>

        <div className="sn-reveal sn-reveal-list mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FeaturedCommunityCard item={FEATURED_COMMUNITY} />
          {COMMUNITY_TRACKS.map((track) => (
            <CommunityTrackCard key={track.handle} track={track} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCommunityCard({ item }: { item: FeaturedCommunity }) {
  return (
    <article className="relative overflow-hidden rounded-md border border-border-subtle bg-elevated p-6 transition-colors hover:border-border-strong lg:col-span-2">
      <a
        href="/app"
        className="absolute top-5 right-5 text-xs font-medium [color:var(--text-secondary)] transition-colors hover:[color:var(--text-primary)]"
      >
        查看完整 Track →
      </a>

      <div className="grid gap-6 pr-0 md:grid-cols-[220px_1fr] md:pr-36">
        <div className="flex items-center gap-4 md:block">
          <CommunityAvatar
            color={item.avatarColor}
            name={item.name}
            size="lg"
          />
          <div className="md:mt-4">
            <div className="text-base font-medium [color:var(--text-primary)]">
              {item.name}
            </div>
            <div className="mt-1 text-[11px] [color:var(--text-muted)] [font-family:var(--font-mono)]">
              @{item.handle}
            </div>
          </div>
        </div>

        <blockquote className="m-0 text-[clamp(18px,2.1vw,25px)] leading-[1.48] font-medium tracking-normal [color:var(--text-primary)] [font-family:var(--font-sans)]">
          “{item.quote}”
        </blockquote>
      </div>

      <div className="mt-6 border-t border-border-subtle pt-4 text-xs [color:var(--text-muted)]">
        {item.meta}
      </div>
    </article>
  );
}

function CommunityTrackCard({ track }: { track: CommunityTrack }) {
  return (
    <article className="group flex min-h-[272px] flex-col rounded-md border border-border-subtle bg-overlay p-5 transition-colors hover:border-border-strong">
      <h3 className="m-0 text-lg leading-snug font-medium tracking-normal [color:var(--text-primary)]">
        {track.title}
      </h3>

      <div className="mt-5 flex flex-col gap-0">
        {track.nodes.map((node) => (
          <div
            key={`${node.kind}-${node.title}`}
            className="grid grid-cols-[74px_1fr] gap-3 border-t border-border-subtle py-2.5 text-sm first:border-t-0 first:pt-0"
          >
            <div className="flex items-center gap-2 text-[11px] [color:var(--text-muted)] [font-family:var(--font-mono)]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-border-chip bg-chip text-[10px] [color:var(--text-secondary)]">
                {communityNodeIcon(node.kind)}
              </span>
              {node.kind}
            </div>
            <div className="min-w-0 leading-relaxed [color:var(--text-secondary)]">
              {node.title}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-border-subtle pt-4">
        <CommunityAvatar color={track.avatarColor} name={track.name} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium [color:var(--text-primary)]">
            {track.name}
          </div>
          <div className="truncate text-[10.5px] [color:var(--text-muted)] [font-family:var(--font-mono)]">
            @{track.handle}
          </div>
        </div>
        <button
          type="button"
          className="pointer-events-none h-7 rounded border border-border-card bg-transparent px-3 text-[11px] font-medium opacity-0 [color:var(--text-secondary)] transition-all group-hover:pointer-events-auto group-hover:opacity-100 hover:border-border-card-hover hover:[color:var(--text-primary)]"
        >
          Follow
        </button>
      </div>
    </article>
  );
}

function CommunityAvatar({
  color = "#1A1A1A",
  name,
  size = "sm",
}: {
  color?: string;
  name: string;
  size?: "sm" | "lg";
}) {
  const isLarge = size === "lg";

  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-md border border-border-card bg-surface-hover font-semibold text-white",
        isLarge ? "h-16 w-16 text-xl" : "h-8 w-8 text-xs",
      ].join(" ")}
      style={{ background: color }}
    >
      {name[0]}
    </div>
  );
}

function communityNodeIcon(kind: CommunityNodeKind) {
  return {
    Math: "∑",
    Code: "</>",
    Paper: "¶",
  }[kind];
}
