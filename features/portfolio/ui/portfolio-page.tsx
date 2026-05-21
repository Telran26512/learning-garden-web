"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  buildContributionWeeks,
  countActiveContributionDays,
  type ContributionFilter,
  type PortfolioTabKey,
} from "../model/portfolio-model";
import { usePortfolioViewData } from "../model/use-portfolio-view-data";
import { fallbackPortfolioViewData } from "../api/portfolio-live-data";
import { EditorialHero, PortfolioTabs } from "./portfolio-hero";
import { OverviewPage, TabPage } from "./portfolio-layout";

const tabKeys = new Set(fallbackPortfolioViewData.tabs.map((tab) => tab.key));

export function PortfolioPage({
  profileHandle = "xiaobin-cao",
}: {
  profileHandle?: string;
}) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") as PortfolioTabKey | null;
  const activeTab =
    requestedTab && tabKeys.has(requestedTab) ? requestedTab : "overview";

  const viewData = usePortfolioViewData(profileHandle);
  const [contributionFilter, setContributionFilter] =
    useState<ContributionFilter>("all");
  const [followed, setFollowed] = useState(false);
  const [shareNotice, setShareNotice] = useState("");
  const contributionWeeks = useMemo(
    () => buildContributionWeeks(contributionFilter),
    [contributionFilter],
  );
  const activeDays = countActiveContributionDays(contributionFilter);

  function handleShare() {
    const profileUrl = `https://synapse.app/u/${viewData.profile.handle.replace(/^@/, "")}`;
    void navigator.clipboard?.writeText(profileUrl);
    setShareNotice("已复制链接");
    window.setTimeout(() => setShareNotice(""), 1400);
  }

  return (
    <section className="min-h-[calc(100dvh-3.5rem)] bg-[var(--syn-reading-bg)] text-[var(--syn-reading-ink)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        <EditorialHero
          profile={viewData.profile}
          followed={followed}
          onFollowToggle={() => setFollowed((value) => !value)}
          onShare={handleShare}
          shareNotice={shareNotice}
        />

        <PortfolioTabs activeTab={activeTab} tabs={viewData.tabs} />

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
