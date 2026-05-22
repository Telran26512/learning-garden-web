import { contributionEntries } from "../data/portfolio-fixtures";

export type PortfolioTabKey =
  | "overview"
  | "tracks"
  | "notes"
  | "papers"
  | "experiments"
  | "graph";

export type ContributionFilter = "notes" | "cards" | "commits" | "all";

export type ContributionEntry = {
  date: string;
  count: number;
  kind: Exclude<ContributionFilter, "all">;
  level: 0 | 1 | 2 | 3 | 4;
};

export type PortfolioTab = {
  count?: number;
  href: string;
  key: PortfolioTabKey;
  label: string;
};

export type PortfolioTrack = {
  accent: "ink" | "amber" | "purple" | "green" | "yellow";
  blocks: number;
  description: string;
  links: number;
  notes: number;
  papers: number;
  progress: number;
  reach: string;
  status: "shipped" | "in progress" | "draft";
  title: string;
  updated: string;
  visibility: "public" | "unlisted";
};

export type PortfolioActivity = {
  accent: "ink" | "green" | "amber";
  action: string;
  target: string;
  time: string;
};

export type PortfolioNoteKind = "math" | "code" | "paper" | "text";

export type PortfolioNote = {
  blocks: string;
  excerpt: string;
  kind: PortfolioNoteKind;
  links: string;
  time: string;
  title: string;
  track: string;
};

export type PortfolioPaper = {
  arxiv: string;
  authors: string;
  highlights?: number;
  notes?: number;
  progress?: number;
  tags: readonly string[];
  time?: string;
  title: string;
  venue: string;
  year: string;
};

export type PortfolioPaperColumn = {
  count: number;
  key: "queued" | "reading" | "done";
  label: string;
  papers: readonly PortfolioPaper[];
};

export type PortfolioExperimentStatus =
  | "running"
  | "done"
  | "failed"
  | "queued";

export type PortfolioExperiment = {
  branch: string;
  curve: readonly number[];
  hypothesis: string;
  index: string;
  metricLabel: string;
  metricValue: string;
  name: string;
  progress?: number;
  status: PortfolioExperimentStatus;
  when: string;
};

export type GraphNodeType = PortfolioNoteKind | "hub";

export type PortfolioGraphNode = {
  focused?: boolean;
  id: string;
  label?: string;
  r: number;
  type: GraphNodeType;
  x: number;
  y: number;
};

export type PortfolioGraphEdge = readonly [source: string, target: string];

export {
  blockDistribution,
  contributionEntries,
  contributionFilters,
  graphEdges,
  graphNodes,
  notes,
  paperColumns,
  pinnedTracks,
  portfolioExperiments,
  portfolioProfile,
  portfolioStats,
  portfolioTabs,
  portfolioTracks,
  recentActivities,
  topTopics,
} from "../data/portfolio-fixtures";

export function filterContributionEntries(
  filter: ContributionFilter,
  entries: readonly ContributionEntry[] = contributionEntries,
) {
  if (filter === "all") {
    return entries;
  }

  return entries.filter((entry) => entry.kind === filter);
}

export function buildContributionWeeks(
  filter: ContributionFilter,
  entries: readonly ContributionEntry[] = contributionEntries,
) {
  return Array.from({ length: 53 }, (_, weekIndex) =>
    entries
      .slice(weekIndex * 7, weekIndex * 7 + 7)
      .map((entry) =>
        filter === "all" || entry.kind === filter
          ? entry
          : { ...entry, count: 0, level: 0 as const },
      ),
  );
}

export function countActiveContributionDays(
  filter: ContributionFilter,
  entries: readonly ContributionEntry[] = contributionEntries,
) {
  return buildContributionWeeks(filter, entries)
    .flat()
    .filter((entry) => entry.count > 0).length;
}
