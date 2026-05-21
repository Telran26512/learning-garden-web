"use client";

import { useMemo, useState } from "react";

import { feedItems, feedTabs, ranges } from "../data/explore-fixtures";
import type { ExploreFeedTab, ExploreRange } from "../model/explore-model";
import { ExploreRail } from "./explore-rail";
import { ExploreSidebar } from "./explore-sidebar";
import { FeedCard } from "./feed-card";
import { FeedControls } from "./feed-controls";
import { FeaturedTrack } from "./featured-track";

export function ExplorePage() {
  const [activeDiscover, setActiveDiscover] = useState("trending");
  const [activeTab, setActiveTab] = useState<ExploreFeedTab>(feedTabs[0]);
  const [activeRange, setActiveRange] = useState<ExploreRange>(ranges[1]);
  const [followed, setFollowed] = useState<string[]>([]);
  const filteredFeed = useMemo(() => {
    if (activeTab === "Latest") return [...feedItems].reverse();
    if (activeTab === "Following") return feedItems.slice(0, 2);
    if (activeTab === "Tags")
      return feedItems.filter((item) => item.tags.length);
    return feedItems;
  }, [activeTab]);

  return (
    <section className="syn-reading-mode grid min-h-[calc(100dvh-3.5rem)] min-w-[1200px] grid-cols-[260px_minmax(0,1fr)_330px]">
      <ExploreSidebar
        activeDiscover={activeDiscover}
        onDiscoverChange={setActiveDiscover}
      />

      <main className="min-w-0 overflow-auto px-12 py-12">
        <div className="mx-auto max-w-[940px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="syn-title text-[52px] leading-none text-[var(--syn-reading-ink)]">
                Explore
              </h1>
              <p className="mt-4 max-w-[520px] text-[16px] leading-[1.75] text-[var(--syn-reading-secondary)]">
                看正在被认真讨论的学习历程。
              </p>
            </div>
            <p className="mt-5 text-right font-mono text-[11px] text-[var(--syn-reading-muted)]">
              past 7 days · weighted
            </p>
          </div>

          <FeedControls
            activeRange={activeRange}
            activeTab={activeTab}
            onRangeChange={setActiveRange}
            onTabChange={setActiveTab}
          />

          <FeaturedTrack />

          <div className="mt-5 space-y-5">
            {filteredFeed.map((item) => (
              <FeedCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </main>

      <ExploreRail
        followed={followed}
        onFollowToggle={(name) =>
          setFollowed((items) =>
            items.includes(name)
              ? items.filter((item) => item !== name)
              : [...items, name],
          )
        }
      />
    </section>
  );
}
