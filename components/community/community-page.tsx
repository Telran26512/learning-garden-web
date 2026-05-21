"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

import {
  communityFeed,
  communityHero,
  communityPeople,
  communityReadingSessions,
  communityStats,
  communityTabs,
  communityTopics,
  type CommunityFeedItem,
  type CommunityPerson,
  type CommunityReadingSession,
} from "./community-model";

export function CommunityPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "for-you";

  return (
    <section className="community-reading syn-reading-mode min-h-[calc(100dvh-3.5rem)]">
      <div className="mx-auto w-full max-w-[1540px] px-5 pb-16 pt-10 sm:px-8 lg:px-14 xl:px-20">
        <CommunityHero />
        <CommunityTabs activeTab={activeTab} />

        <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_400px]">
          <main className="min-w-0 space-y-5">
            {communityFeed.map((item) => (
              <FeedCard item={item} key={`${item.kind}-${item.title}`} />
            ))}

            <div className="py-7 text-center font-mono text-[12px] text-text-muted">
              ----- showing 7 of 312 ·{" "}
              <button
                className="text-[var(--syn-accent)] transition hover:text-[var(--syn-reading-ink)]"
                type="button"
              >
                load more
              </button>{" "}
              -----
            </div>
          </main>

          <aside className="grid content-start gap-5">
            <WeeklyDigest />
            <PeopleToFollow />
            <TrendingTopics />
            <UpcomingSessions />
            <YourWeek />
          </aside>
        </div>

        <CommunityFooter />
      </div>

      <button
        className="fixed bottom-7 right-7 z-20 h-12 rounded-[var(--syn-radius)] border border-[var(--syn-accent)] bg-[var(--syn-reading-bg)] px-6 text-[13px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)] active:translate-y-px"
        type="button"
      >
        + New note
      </button>
    </section>
  );
}

function CommunityHero() {
  return (
    <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-end">
      <div>
        <p className="syn-kicker mb-5 text-[var(--syn-reading-muted)]">
          {communityHero.eyebrow}
        </p>
        <h1 className="syn-title text-[40px] leading-tight text-[var(--syn-reading-ink)] sm:text-[56px]">
          {communityHero.title}
        </h1>
        <p className="mt-5 max-w-[760px] text-[16px] leading-[1.78] text-[var(--syn-reading-secondary)]">
          {communityHero.subtitle}
        </p>
      </div>

      <section className="border-l border-[var(--syn-hairline-light)] p-5">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {communityStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[22px] font-semibold leading-none text-[var(--syn-reading-ink)]">
                {stat.value}
              </p>
              <p className="syn-kicker mt-3 text-[var(--syn-reading-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </header>
  );
}

function CommunityTabs({ activeTab }: { activeTab: string }) {
  return (
    <div className="mt-9 flex flex-col gap-4 border-b border-border-subtle pb-5 lg:flex-row lg:items-center lg:justify-between">
      <nav className="flex gap-2 overflow-x-auto" aria-label="Community feed">
        {communityTabs.map((tab) => {
          const key = tab.href.includes("&tab=")
            ? tab.href.split("&tab=")[1]
            : "for-you";
          const active = key === activeTab;

          return (
            <a
              className={[
                "flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] transition",
                active
                  ? "bg-transparent text-white"
                  : "text-text-secondary hover:bg-white/[0.03] hover:text-white",
              ].join(" ")}
              href={tab.href}
              key={tab.label}
            >
              <span>{tab.label}</span>
              {tab.count ? (
                <span className="font-mono text-[10px] text-text-muted">
                  {tab.count}
                </span>
              ) : null}
            </a>
          );
        })}
      </nav>

      <div className="flex flex-wrap items-center gap-4">
        <span className="rounded-lg border border-border-subtle bg-transparent px-3 py-2 text-[12px] text-text-secondary">
          RL × Inference ×
        </span>
        <span className="text-[12px] text-text-secondary">
          Sort: <span className="text-text-soft">Hot · 24h ↓</span>
        </span>
      </div>
    </div>
  );
}

function FeedCard({ item }: { item: CommunityFeedItem }) {
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
          <span
            className={`mr-3 rounded border px-2 py-1 font-mono text-[10px] ${accentBadge()}`}
          >
            paper
          </span>
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
            <span
              className="rounded-md border border-border-subtle bg-[#171C24] px-2 py-1 font-mono text-[10px] text-text-secondary"
              key={tag}
            >
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
        <span
          className={`rounded px-2 py-1 font-mono text-[10px] ${accentBadge()}`}
        >
          {item.label}
        </span>
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

function WeeklyDigest() {
  return (
    <section className="rounded-lg border border-[var(--syn-hairline-light)] bg-transparent p-5">
      <p className="font-mono text-[10px] text-[#F59E0B]">
        ↗ Weekly digest · Friday
      </p>
      <h2 className="mt-4 text-[15px] font-semibold text-white">
        7 things worth your attention
      </h2>
      <p className="mt-3 text-[12px] leading-6 text-text-secondary">
        Curated for you based on your tracks. This week leans hard into{" "}
        <span className="text-[var(--syn-accent)]">inference systems</span> and{" "}
        <span className="text-[#F59E0B]">RL stability</span>.
      </p>
      <button
        className="mt-5 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-accent)] text-[12px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)]"
        type="button"
      >
        Read digest →
      </button>
    </section>
  );
}

function PeopleToFollow() {
  const [following, setFollowing] = useState(
    () =>
      new Set(
        communityPeople
          .filter((person) => person.following)
          .map((person) => person.handle),
      ),
  );

  return (
    <section className="rounded-lg border border-border-subtle bg-transparent p-5">
      <div className="mb-5 flex items-center justify-between border-b border-dashed border-border-subtle pb-4">
        <h2 className="font-mono text-[10px] text-text-muted">
          People to follow
        </h2>
        <button className="font-mono text-[11px] text-text-muted" type="button">
          see all →
        </button>
      </div>
      <div className="divide-y divide-dashed divide-border-subtle">
        {communityPeople.map((person) => (
          <PersonRow
            following={following.has(person.handle)}
            key={person.handle}
            onFollowToggle={() =>
              setFollowing((current) => {
                const next = new Set(current);
                if (next.has(person.handle)) {
                  next.delete(person.handle);
                } else {
                  next.add(person.handle);
                }
                return next;
              })
            }
            person={person}
          />
        ))}
      </div>
    </section>
  );
}

function PersonRow({
  following,
  onFollowToggle,
  person,
}: {
  following: boolean;
  onFollowToggle: () => void;
  person: CommunityPerson;
}) {
  return (
    <div className="grid grid-cols-[42px_minmax(0,1fr)_96px] gap-3 py-4">
      <AvatarTile accent={person.color} className="size-9 text-[12px]">
        {person.avatar}
      </AvatarTile>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-white">
          {person.name}{" "}
          <span className="font-mono text-[11px] font-normal text-text-muted">
            {person.handle}
          </span>
        </p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-text-secondary">
          {person.bio}
        </p>
      </div>
      <button
        className={[
          "h-8 self-center rounded-lg px-3 font-mono text-[12px] transition",
          following
            ? "bg-[var(--syn-accent-soft)] text-[var(--syn-accent)]"
            : "border border-border-strong text-white hover:bg-surface-hover",
        ].join(" ")}
        onClick={onFollowToggle}
        type="button"
      >
        {following ? "Following" : "+ Follow"}
      </button>
    </div>
  );
}

function TrendingTopics() {
  return (
    <section className="rounded-lg border border-border-subtle bg-transparent p-5">
      <div className="mb-4 flex items-center justify-between border-b border-dashed border-border-subtle pb-4">
        <h2 className="font-mono text-[10px] text-text-muted">
          Trending topics · 24h
        </h2>
        <p className="font-mono text-[11px] text-text-muted">
          based on 312 tracks
        </p>
      </div>
      <div className="divide-y divide-dashed divide-border-subtle">
        {communityTopics.map((topic, index) => (
          <div
            className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 py-3 text-[13px]"
            key={topic.label}
          >
            <span className="font-mono text-[11px] text-text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-text-soft"># {topic.label}</span>
            <span
              className={`font-mono text-[11px] ${
                topic.status === "new" ? "text-[#F59E0B]" : "text-[#32D778]"
              }`}
            >
              {topic.delta}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function UpcomingSessions() {
  return (
    <section className="rounded-lg border border-border-subtle bg-transparent p-5">
      <div className="mb-5 flex items-center justify-between border-b border-dashed border-border-subtle pb-4">
        <h2 className="font-mono text-[10px] text-text-muted">
          Upcoming reading sessions
        </h2>
        <button className="font-mono text-[11px] text-text-muted" type="button">
          calendar →
        </button>
      </div>
      <div className="divide-y divide-dashed divide-border-subtle">
        {communityReadingSessions.map((session) => (
          <SessionRow key={session.title} session={session} />
        ))}
      </div>
    </section>
  );
}

function SessionRow({ session }: { session: CommunityReadingSession }) {
  return (
    <div className="py-4">
      <p className={`font-mono text-[11px] ${sessionTone(session.tone)}`}>
        {session.time}
      </p>
      <p className="mt-2 text-[13px] leading-5 text-text-soft">
        {session.title}
      </p>
      <p className="mt-2 font-mono text-[11px] text-text-muted">
        {session.meta}
      </p>
    </div>
  );
}

function YourWeek() {
  return (
    <section className="rounded-lg border border-border-subtle bg-transparent p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-mono text-[10px] text-text-muted">
          Your week on Synapse
        </h2>
        <Link
          className="font-mono text-[11px] text-text-muted"
          href="/app?view=portfolio"
        >
          → profile
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {[
          ["+12", "Notes", "text-[var(--syn-accent)]"],
          ["+218", "Followers", "text-white"],
          ["5", "Day streak", "text-[#32D778]"],
          ["3", "Threads joined", "text-[#F59E0B]"],
        ].map(([value, label, className]) => (
          <div key={label}>
            <p className={`text-[18px] ${className}`}>{value}</p>
            <p className="mt-2 font-mono text-[10px] text-text-muted">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommunityFooter() {
  return (
    <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-7 font-mono text-[11px] text-text-muted">
      <span>Synapse · Community · v0.4.2</span>
      <span>↻ feed refreshed 17:42 · 312 new in last 24h</span>
    </footer>
  );
}

function AvatarTile({
  accent,
  children,
  className,
}: {
  accent: CommunityFeedItem["accent"];
  children: ReactNode;
  className: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[var(--syn-radius)] font-semibold ${avatarClass(accent)} ${className}`}
    >
      {children}
    </span>
  );
}

function avatarClass(accent: CommunityFeedItem["accent"]) {
  switch (accent) {
    case "ink":
      return "border border-[var(--syn-accent)] bg-[var(--syn-accent)] text-white";
    default:
      return "border border-[var(--syn-hairline-light)] bg-[#F7F7F7] text-[var(--syn-reading-ink)]";
  }
}

function accentText() {
  return "text-[var(--syn-accent)]";
}

function accentBadge() {
  return "border-[var(--syn-hairline-light)] bg-transparent text-[var(--syn-reading-secondary)]";
}

function accentBorder() {
  return "border-l-[var(--syn-hairline-light)]";
}

function miniAvatarClass(index: number) {
  const classes = [
    "border border-[var(--syn-accent)] bg-[var(--syn-accent)] text-white",
    "border border-[var(--syn-hairline-light)] bg-[#F7F7F7] text-[var(--syn-reading-ink)]",
    "border border-[var(--syn-hairline-light)] bg-[#EFEFEF] text-[var(--syn-reading-ink)]",
    "border border-[var(--syn-hairline-light)] bg-[#F7F7F7] text-[var(--syn-reading-ink)]",
    "border border-[var(--syn-hairline-light)] bg-[#EFEFEF] text-[var(--syn-reading-ink)]",
  ];

  return classes[index] ?? classes[0];
}

function sessionTone(tone: CommunityReadingSession["tone"]) {
  switch (tone) {
    case "ink":
      return "text-[var(--syn-accent)]";
    default:
      return "text-[var(--syn-reading-secondary)]";
  }
}
