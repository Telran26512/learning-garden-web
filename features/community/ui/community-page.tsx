"use client";

import { useSearchParams } from "next/navigation";

import { useCommunityFeed } from "../model/use-community-feed";
import { FeedCard } from "./community-feed-cards";
import { CommunityHero, CommunityTabs } from "./community-hero";
import {
  CommunityFooter,
  PeopleToFollow,
  TrendingTopics,
  UpcomingSessions,
  WeeklyDigest,
  YourWeek,
} from "./community-sidebar";

export function CommunityPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "for-you";
  const feedItems = useCommunityFeed();

  return (
    <section className="community-reading syn-reading-mode min-h-[calc(100dvh-3.5rem)]">
      <div className="mx-auto w-full max-w-[1540px] px-5 pb-16 pt-10 sm:px-8 lg:px-14 xl:px-20">
        <CommunityHero />
        <CommunityTabs activeTab={activeTab} />

        <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_400px]">
          <main className="min-w-0 space-y-5">
            {feedItems.map((item) => (
              <FeedCard item={item} key={item.id} />
            ))}

            <div className="py-7 text-center font-mono text-[12px] text-text-muted">
              ----- showing {feedItems.length} of 312 ·{" "}
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
