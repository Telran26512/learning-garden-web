import type { CommunityFeedItem } from "../model/community-model";
import {
  AvatarTile,
  accentBorder,
  accentText,
  miniAvatarClass,
} from "./community-primitives";
import { communityBadgeClass, communityTagChipClass } from "./community-style";

export function FeedCard({ item }: { item: CommunityFeedItem }) {
  if (item.kind === "track") {
    return <TrackFeedCard item={item} />;
  }

  if (item.kind === "reading-session") {
    return <ReadingSessionFeedCard item={item} />;
  }

  if (item.kind === "experiment") {
    return <ExperimentFeedCard item={item} />;
  }

  return <PostFeedCard item={item} />;
}

function TrackFeedCard({ item }: { item: CommunityFeedItem }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border-subtle bg-transparent">
      <div className="grid gap-5 p-5 sm:grid-cols-[88px_minmax(0,1fr)] sm:p-7">
        <AvatarTile accent={item.accent} className="size-[88px] text-[26px]">
          {item.avatar}
        </AvatarTile>
        <div className="min-w-0">
          {item.label ? (
            <p className={`mb-3 font-mono text-[10px] ${accentText()}`}>
              {item.label}
            </p>
          ) : null}
          <h2 className="text-[20px] font-semibold leading-7 text-white">
            {item.title}
          </h2>
          <p className="mt-3 text-[12px] text-text-secondary">
            by <span className={accentText()}>{item.author}</span> · {item.meta}
          </p>
          <p className="mt-5 max-w-[820px] text-[13px] leading-7 text-text-secondary">
            {item.body}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle px-5 py-4 text-[12px] text-text-secondary sm:px-7">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {item.metrics.map((metric) => (
            <span
              className={
                metric.includes("matched") ? "text-[var(--syn-accent)]" : ""
              }
              key={metric}
            >
              {metric}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            className="h-9 rounded-lg border border-border-strong px-4 text-[12px] text-white transition hover:bg-surface-hover"
            type="button"
          >
            Subscribe
          </button>
          <button
            className="h-9 rounded-[var(--syn-radius)] border border-[var(--syn-accent)] px-4 text-[12px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)]"
            type="button"
          >
            Open track →
          </button>
        </div>
      </div>
    </article>
  );
}

function PostFeedCard({ item }: { item: CommunityFeedItem }) {
  return (
    <article className="rounded-lg border border-border-subtle bg-transparent p-5 sm:p-7">
      <FeedHeader item={item} />
      <h2 className="mt-5 text-[17px] font-semibold leading-7 text-white">
        {item.title}
      </h2>

      {item.paper ? (
        <div className="mt-4 rounded-lg border border-border-subtle bg-transparent px-4 py-3 text-[12px] text-text-secondary">
          <span className={`mr-3 ${communityBadgeClass()}`}>paper</span>
          {item.paper}
          <span className="float-right hidden font-mono text-text-muted sm:inline">
            arXiv:2402.03300 · §3.2
          </span>
        </div>
      ) : null}

      {item.quote ? (
        <blockquote
          className={`mt-4 border-l-2 ${accentBorder()} rounded-r-lg bg-transparent px-4 py-3 text-[13px] leading-7 text-text-secondary`}
        >
          {item.quote}
        </blockquote>
      ) : null}

      {item.kind === "thread" ? (
        <div className="mt-4 rounded-lg border border-border-subtle bg-transparent p-4 text-[13px] leading-7 text-text-soft">
          <span className="mr-3 inline-grid size-6 place-items-center rounded-[var(--syn-radius)] bg-[var(--syn-accent)] text-[11px] font-semibold text-white">
            哲
          </span>
          @zhe-li · 1h ago ·{" "}
          <span className="text-[#32D778]">+ math · 2 blocks</span>
          <br />
          这里有个细节:GRPO 的 group 其实是{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">
            n_samples_per_prompt
          </code>{" "}
          个 rollout,所以 group 内的 σ 估计会很 noisy。我做过一个
          sweep,group_size ≤ 4 的时候 baseline 反而增加 variance。{" "}
          <span className="text-[var(--syn-accent)]">完整推导 →</span>
        </div>
      ) : null}

      {item.tags ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span className={communityTagChipClass()} key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <FeedFooter metrics={item.metrics} />
    </article>
  );
}

function ReadingSessionFeedCard({ item }: { item: CommunityFeedItem }) {
  return (
    <article className="rounded-lg border border-border-subtle bg-transparent p-5 sm:p-7">
      <FeedHeader item={item} />
      <h2 className="mt-5 text-[17px] font-semibold leading-7 text-white">
        {item.title}
      </h2>
      {item.paper ? (
        <p className="mt-3 font-mono text-[12px] text-[#A78BFA]">
          {item.paper}
        </p>
      ) : null}
      {item.stats ? (
        <div className="mt-5 grid gap-4 rounded-lg bg-transparent p-4 sm:grid-cols-4">
          {item.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[18px] text-white">{stat.value}</p>
              <p className="mt-2 font-mono text-[10px] text-text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
          {item.metrics.map((metric, index) =>
            index < 5 ? (
              <span
                className={`inline-grid size-5 place-items-center rounded text-[10px] font-semibold ${miniAvatarClass(index)}`}
                key={metric}
              >
                {metric}
              </span>
            ) : (
              <span className="ml-2" key={metric}>
                {metric}
              </span>
            ),
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="h-9 rounded-lg border border-border-strong px-4 text-[12px] text-white transition hover:bg-surface-hover"
            type="button"
          >
            Maybe
          </button>
          <button
            className="h-9 rounded-[var(--syn-radius)] border border-[var(--syn-accent)] px-4 text-[12px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)]"
            type="button"
          >
            RSVP
          </button>
        </div>
      </div>
    </article>
  );
}

function ExperimentFeedCard({ item }: { item: CommunityFeedItem }) {
  return (
    <article className="rounded-lg border border-border-subtle bg-transparent p-5 sm:p-7">
      <FeedHeader item={item} />
      <h2 className="mt-5 text-[17px] font-semibold leading-7 text-white">
        {item.title}
        <span className="ml-3 font-mono text-[11px] font-normal text-text-muted">
          ↳ exp/fa-bench · seed 0..2 · A100 80GB
        </span>
      </h2>
      <div className="mt-5 grid gap-4 rounded-lg bg-transparent p-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <svg aria-hidden="true" className="h-32 w-full" viewBox="0 0 520 130">
          <line
            stroke="#28313D"
            strokeDasharray="4 6"
            x1="10"
            x2="510"
            y1="40"
            y2="40"
          />
          <polyline
            fill="none"
            points="10,105 120,78 225,58 330,39 430,23 510,12"
            stroke="var(--syn-accent)"
            strokeWidth="3"
          />
          <polyline
            fill="none"
            points="10,107 120,84 225,69 330,54 430,41 510,32"
            stroke="#F59E0B"
            strokeDasharray="5 7"
            strokeWidth="3"
          />
          <text
            fill="var(--syn-accent)"
            fontFamily="monospace"
            fontSize="12"
            x="460"
            y="13"
          >
            Triton
          </text>
          <text
            fill="#F59E0B"
            fontFamily="monospace"
            fontSize="12"
            x="470"
            y="33"
          >
            CUDA
          </text>
          {["ctx 2k", "4k", "8k", "16k", "32k"].map((label, index) => (
            <text
              fill="#6B7280"
              fontFamily="monospace"
              fontSize="11"
              key={label}
              x={10 + index * 124}
              y="125"
            >
              {label}
            </text>
          ))}
        </svg>
        <div className="grid content-center gap-5">
          <div>
            <p className="font-mono text-[26px] text-[#32D778]">+18.4%</p>
            <p className="mt-1 font-mono text-[10px] text-text-muted">
              Throughput @ 32k · vs CUDA FA2
            </p>
          </div>
          <div>
            <p className="font-mono text-[20px] text-[var(--syn-accent)]">
              stable
            </p>
            <p className="mt-1 font-mono text-[10px] text-text-muted">
              Across 3 seeds (Σ=0.6%)
            </p>
          </div>
        </div>
      </div>
      <FeedFooter metrics={item.metrics} />
    </article>
  );
}

function FeedHeader({ item }: { item: CommunityFeedItem }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AvatarTile accent={item.accent} className="size-9 text-[12px]">
        {item.avatar}
      </AvatarTile>
      <span className="text-[13px] font-semibold text-white">
        {item.author}
      </span>
      {item.action ? (
        <span className="text-[12px] text-text-secondary">{item.action}</span>
      ) : null}
      {item.label ? (
        <span className={communityBadgeClass()}>{item.label}</span>
      ) : null}
      <span className="font-mono text-[11px] text-text-muted">
        · {item.meta}
      </span>
    </div>
  );
}

function FeedFooter({ metrics }: { metrics: readonly string[] }) {
  return (
    <div className="mt-6 flex flex-wrap justify-between gap-4 border-t border-border-subtle pt-4 font-mono text-[12px] text-text-muted">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {metrics.map((metric) => (
          <span
            className={metric.startsWith("▲") ? "text-[var(--syn-accent)]" : ""}
            key={metric}
          >
            {metric}
          </span>
        ))}
      </div>
      <span>9 followers in this thread</span>
    </div>
  );
}
