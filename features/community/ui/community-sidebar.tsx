import { useState } from "react";
import Link from "next/link";

import {
  communityPeople,
  communityReadingSessions,
  communityTopics,
} from "../model/community-model";
import type {
  CommunityPerson,
  CommunityReadingSession,
} from "../model/community-model";
import { AvatarTile, sessionTone } from "./community-primitives";

export function WeeklyDigest() {
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

export function PeopleToFollow() {
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

export function TrendingTopics() {
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

export function UpcomingSessions() {
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

export function YourWeek() {
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

export function CommunityFooter() {
  return (
    <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-7 font-mono text-[11px] text-text-muted">
      <span>Synapse · Community · v0.4.2</span>
      <span>↻ feed refreshed 17:42 · 312 new in last 24h</span>
    </footer>
  );
}
