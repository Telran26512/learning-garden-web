"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  buildContributionWeeks,
  countActiveContributionDays,
  type ContributionFilter,
  type PortfolioTabKey,
} from "../model/portfolio-model";
import { updatePortfolioFollow } from "../model/portfolio-follow";
import { usePortfolioViewData } from "../model/use-portfolio-view-data";
import { fallbackPortfolioViewData } from "../api/portfolio-live-data";
import { EditorialHero, PortfolioTabs } from "./portfolio-hero";
import { OverviewPage, TabPage } from "./portfolio-layout";

const tabKeys = new Set(fallbackPortfolioViewData.tabs.map((tab) => tab.key));

export function PortfolioPage({
  currentUserHandle = "",
  profileHandle = "xiaobin-cao",
}: {
  currentUserHandle?: string;
  profileHandle?: string;
}) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") as PortfolioTabKey | null;
  const activeTab =
    requestedTab && tabKeys.has(requestedTab) ? requestedTab : "overview";

  const viewState = usePortfolioViewData(profileHandle);
  const viewData = viewState.viewData;
  const [contributionFilter, setContributionFilter] =
    useState<ContributionFilter>("all");
  const [followed, setFollowed] = useState(false);
  const [followError, setFollowError] = useState("");
  const [followPending, setFollowPending] = useState(false);
  const [shareNotice, setShareNotice] = useState("");
  const contributionWeeks = useMemo(
    () =>
      buildContributionWeeks(contributionFilter, viewData.contributionEntries),
    [contributionFilter, viewData.contributionEntries],
  );
  const activeDays = useMemo(
    () =>
      countActiveContributionDays(
        contributionFilter,
        viewData.contributionEntries,
      ),
    [contributionFilter, viewData.contributionEntries],
  );
  const normalizedProfileHandle = viewData.profile.handle.replace(/^@/u, "");
  const isOwnProfile =
    currentUserHandle.trim() !== "" &&
    normalizedProfileHandle === currentUserHandle.trim().replace(/^@/u, "");

  function handleShare() {
    const profileUrl = `https://synapse.app/u/${viewData.profile.handle.replace(/^@/, "")}`;
    void navigator.clipboard?.writeText(profileUrl);
    setShareNotice("已复制链接");
    window.setTimeout(() => setShareNotice(""), 1400);
  }

  async function handleFollowToggle() {
    if (isOwnProfile || followPending) return;
    setFollowPending(true);
    setFollowError("");
    try {
      const nextFollowed = await updatePortfolioFollow({
        followed,
        handle: normalizedProfileHandle,
      });
      setFollowed(nextFollowed);
    } catch (error) {
      setFollowError(
        error instanceof Error ? error.message : "关注状态更新失败",
      );
    } finally {
      setFollowPending(false);
    }
  }

  return (
    <section className="min-h-[calc(100dvh-3.5rem)] bg-[var(--syn-reading-bg)] text-[var(--syn-reading-ink)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        <EditorialHero
          profile={viewData.profile}
          followDisabled={isOwnProfile || followPending}
          followNotice={followError}
          followPending={followPending}
          followed={followed}
          onFollowToggle={handleFollowToggle}
          onShare={handleShare}
          shareNotice={shareNotice}
        />

        <PortfolioTabs activeTab={activeTab} tabs={viewData.tabs} />

        {viewState.status === "error" ? (
          <PortfolioDataState
            message={`Profile 接口请求失败：${viewState.error}`}
          />
        ) : null}
        {viewState.status === "loading" ? (
          <PortfolioDataState message="正在加载 Profile 内容..." />
        ) : null}
        {viewState.status === "empty" ? (
          <PortfolioDataState message="这个 Profile 暂无公开内容。" />
        ) : null}

        {activeTab === "overview" ? (
          <OverviewPage
            activeDays={activeDays}
            contributionFilter={contributionFilter}
            contributionWeeks={contributionWeeks}
            data={viewData}
            onFilterChange={setContributionFilter}
          />
        ) : (
          <TabPage
            activeDays={activeDays}
            activeTab={activeTab}
            contributionFilter={contributionFilter}
            contributionWeeks={contributionWeeks}
            data={viewData}
            onFilterChange={setContributionFilter}
          />
        )}
      </div>
    </section>
  );
}

function PortfolioDataState({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] px-4 py-3 text-[13px] text-[var(--syn-reading-secondary)]">
      {message}
    </div>
  );
}
