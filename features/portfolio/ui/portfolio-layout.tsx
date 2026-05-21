import {
  buildContributionWeeks,
  type ContributionFilter,
  type PortfolioTabKey,
} from "../model/portfolio-model";
import type { PortfolioViewData } from "../api/portfolio-live-data";
import { GraphNotebook } from "./portfolio-graph";
import { PortfolioMargin } from "./portfolio-margin";
import { ExperimentLog, ReadingDesk } from "./portfolio-reading";
import { NotesTimeline, TrackSection } from "./portfolio-tracks";

export function OverviewPage({
  activeDays,
  contributionFilter,
  contributionWeeks,
  data,
  onFilterChange,
}: {
  activeDays: number;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  data: PortfolioViewData;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <div className="grid gap-14 py-14 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-18">
      <main className="min-w-0 space-y-20">
        <TrackSection
          description="每条 track 都是一组正在被反复修订的理解路径,不是一个用于展示数量的项目卡。"
          tracks={data.pinnedTracks}
        />
        <NotesTimeline
          description="按更新时间排,保留写作现场的痕迹。"
          notesToShow={data.notes.slice(0, 7)}
        />
      </main>

      <PortfolioMargin
        activeDays={activeDays}
        contributionFilter={contributionFilter}
        contributionWeeks={contributionWeeks}
        data={data}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

export function TabPage({
  activeDays,
  activeTab,
  contributionFilter,
  contributionWeeks,
  data,
  onFilterChange,
}: {
  activeDays: number;
  activeTab: PortfolioTabKey;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  data: PortfolioViewData;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <div className="grid gap-14 py-14 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-18">
      <main className="min-w-0">
        {activeTab === "tracks" ? (
          <TrackSection
            description="这些条目按研究问题组织,每个条目都留下最近一次真正推动理解的句子。"
            tracks={data.tracks}
          />
        ) : null}
        {activeTab === "notes" ? (
          <NotesTimeline
            description="不是发布公告,而是研究笔记的变更记录。"
            notesToShow={data.notes}
          />
        ) : null}
        {activeTab === "papers" ? (
          <ReadingDesk paperColumns={data.paperColumns} />
        ) : null}
        {activeTab === "experiments" ? (
          <ExperimentLog experiments={data.experiments} />
        ) : null}
        {activeTab === "graph" ? (
          <GraphNotebook
            graphEdges={data.graphEdges}
            graphNodes={data.graphNodes}
          />
        ) : null}
      </main>

      <PortfolioMargin
        activeDays={activeDays}
        contributionFilter={contributionFilter}
        contributionWeeks={contributionWeeks}
        data={data}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
