"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { feedTabs, ranges } from "../data/explore-fixtures";
import type { ExploreFeedTab, ExploreRange } from "../model/explore-model";
import { useExploreViewData } from "../model/use-explore-view-data";
import { ExploreSidebar } from "./explore-sidebar";
import { FeedCard } from "./feed-card";
import { FeedControls } from "./feed-controls";
import { FeaturedTrack } from "./featured-track";

export function ExplorePage() {
  const router = useRouter();
  const [activeDiscover, setActiveDiscover] = useState("trending");
  const [activeTab, setActiveTab] = useState<ExploreFeedTab>(feedTabs[0]);
  const [activeTag, setActiveTag] = useState("");
  const [activeRange, setActiveRange] = useState<ExploreRange>(ranges[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const viewState = useExploreViewData(
    activeTab,
    activeTag,
    activeRange,
    searchQuery,
  );
  const viewData = viewState.viewData;

  function handleDiscoverChange(id: string) {
    setActiveDiscover(id);
    if (id === "latest") setActiveTab("Latest");
    if (id === "following") setActiveTab("Following");
    if (id === "trending") setActiveTab("Trending");
    if (id === "graph") router.push("/app?view=graph");
  }

  return (
    <section className="syn-reading-mode grid min-h-[calc(100dvh-3.5rem)] min-w-[1200px] grid-cols-[260px_minmax(0,1fr)]">
      <ExploreSidebar
        activeDiscover={activeDiscover}
        activeTag={activeTag}
        onDiscoverChange={handleDiscoverChange}
        onTagChange={(tag) => {
          setActiveTag(tag);
          setActiveTab("Tags");
        }}
        tagStats={viewData.tagStats}
      />

      <main className="min-w-0 overflow-auto px-12 py-12 2xl:px-16">
        <div className="mx-auto max-w-[1240px]">
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
          <div className="mt-5 flex items-center gap-3">
            <input
              className="h-10 min-w-0 flex-1 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-3 text-[13px] text-[var(--syn-reading-ink)] outline-none placeholder:text-[var(--syn-reading-muted)]"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索公开 Notes / tags / blocks..."
              value={searchQuery}
            />
            {activeTag ? (
              <button
                className="h-10 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] px-3 text-[12px] text-[var(--syn-reading-secondary)]"
                onClick={() => setActiveTag("")}
                type="button"
              >
                清除 #{activeTag}
              </button>
            ) : null}
          </div>

          <FeaturedTrack />

          {viewState.status === "error" ? (
            <DataStateMessage
              message={`Explore 接口请求失败：${viewState.error}`}
            />
          ) : null}
          {viewState.status === "loading" ? (
            <DataStateMessage message="正在加载 Explore 内容..." />
          ) : null}
          {viewState.status === "empty" ? (
            <DataStateMessage message="当前筛选下还没有公开内容。" />
          ) : null}

          <div className="mt-5 space-y-5">
            {viewData.feedItems.map((item) => (
              <FeedCard
                item={item}
                key={item.id}
                onOpen={(feedItem) =>
                  router.push(
                    `/app?view=note&id=${encodeURIComponent(feedItem.id)}`,
                  )
                }
              />
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}

function DataStateMessage({ message }: { message: string }) {
  return (
    <div className="mt-5 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] px-4 py-3 text-[13px] text-[var(--syn-reading-secondary)]">
      {message}
    </div>
  );
}
