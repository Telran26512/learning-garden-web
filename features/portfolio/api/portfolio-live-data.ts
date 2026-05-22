import type { P2ContentItem, P2Portfolio } from "@/lib/api/p2";

import {
  graphEdges,
  graphNodes,
  notes,
  paperColumns,
  pinnedTracks,
  blockDistribution,
  contributionEntries,
  portfolioExperiments,
  portfolioProfile,
  portfolioStats,
  portfolioTabs,
  portfolioTracks,
  type ContributionEntry,
  topTopics,
  type GraphNodeType,
  type PortfolioExperiment,
  type PortfolioGraphEdge,
  type PortfolioGraphNode,
  type PortfolioNote,
  type PortfolioNoteKind,
  type PortfolioPaper,
  type PortfolioPaperColumn,
  type PortfolioTab,
  type PortfolioTrack,
} from "../model/portfolio-model";

export type PortfolioViewData = {
  blockDistribution: readonly {
    color: string;
    count: number;
    label: string;
    percent: number;
  }[];
  contributionEntries: readonly ContributionEntry[];
  experiments: readonly PortfolioExperiment[];
  graphEdges: readonly PortfolioGraphEdge[];
  graphNodes: readonly PortfolioGraphNode[];
  notes: readonly PortfolioNote[];
  paperColumns: readonly PortfolioPaperColumn[];
  pinnedTracks: readonly PortfolioTrack[];
  profile: typeof portfolioProfile;
  stats: readonly { label: string; value: string }[];
  tabs: readonly PortfolioTab[];
  topTopics: readonly (readonly [string, number])[];
  tracks: readonly PortfolioTrack[];
};

export const fallbackPortfolioViewData: PortfolioViewData = {
  blockDistribution,
  contributionEntries,
  experiments: portfolioExperiments,
  graphEdges,
  graphNodes,
  notes,
  paperColumns,
  pinnedTracks,
  profile: portfolioProfile,
  stats: portfolioStats,
  tabs: portfolioTabs,
  topTopics,
  tracks: portfolioTracks,
};

export function portfolioViewDataFromP2(
  portfolio: P2Portfolio,
): PortfolioViewData {
  const tracks = (portfolio.items.track ?? []).map(trackFromContent);
  const liveNotes = (portfolio.items.note ?? []).map(noteFromContent);
  const livePapers = paperColumnsFromContent(portfolio.items.paper ?? []);
  const liveExperiments = (portfolio.items.experiment ?? []).map(
    experimentFromContent,
  );

  return {
    experiments: liveExperiments,
    blockDistribution: blockDistributionFromPortfolio(portfolio),
    contributionEntries: contributionEntriesFromPortfolio(portfolio),
    graphEdges: portfolio.graph.edges.map(
      (edge) => [edge.sourceId, edge.targetId] as const,
    ),
    graphNodes: graphNodesFromPortfolio(portfolio),
    notes: liveNotes,
    paperColumns: livePapers,
    pinnedTracks: tracks.slice(0, 4),
    profile: {
      ...portfolioProfile,
      handle: `@${portfolio.profile.handle}`,
      joined: formatMonth(portfolio.profile.createdAt),
      name: portfolio.profile.displayName,
    },
    stats: [
      { label: "Notes", value: formatCount(portfolio.stats.notes) },
      { label: "Tracks", value: formatCount(portfolio.stats.tracks) },
      {
        label: "Block Links",
        value: formatCount(totalMetadataNumber(portfolio, "links")),
      },
      { label: "Papers", value: formatCount(portfolio.stats.papers) },
      {
        label: "Experiments",
        value: formatCount(portfolio.stats.experiments),
      },
      {
        label: "Total",
        value: formatCount(totalItems(portfolio)),
      },
    ],
    tabs: portfolioTabs.map((tab) => ({
      ...tab,
      count: countForTab(portfolio, tab.key),
    })),
    topTopics: Object.entries(portfolio.topics).sort((a, b) => {
      if (b[1] === a[1]) {
        return a[0].localeCompare(b[0]);
      }
      return b[1] - a[1];
    }),
    tracks,
  };
}

export function portfolioHasLiveContent(portfolio: P2Portfolio) {
  return totalItems(portfolio) > 0;
}

function trackFromContent(item: P2ContentItem): PortfolioTrack {
  return {
    accent: accentFromItem(item),
    blocks: metadataNumber(item, "blocks", 0),
    description: item.summary || item.body,
    links: metadataNumber(item, "links", 0),
    notes: metadataNumber(item, "notes", 0),
    papers: metadataNumber(item, "papers", 0),
    progress: metadataNumber(item, "progress", statusProgress(item.status)),
    reach: metadataString(item, "reach", ""),
    status: trackStatus(item.status),
    title: item.title,
    updated: formatDate(item.updatedAt),
    visibility: item.visibility === "unlisted" ? "unlisted" : "public",
  };
}

function noteFromContent(item: P2ContentItem): PortfolioNote {
  const blocks = metadataNumber(item, "blocks", 0);
  const links = metadataNumber(item, "links", 0);
  return {
    blocks: `${blocks} ${blocks === 1 ? "block" : "blocks"}`,
    excerpt: item.summary || item.body,
    kind: noteKind(item),
    links: `${links} ${links === 1 ? "link" : "links"}`,
    time: formatDate(item.updatedAt),
    title: item.title,
    track: metadataString(item, "track", "Published notes"),
  };
}

function paperColumnsFromContent(
  items: P2ContentItem[],
): PortfolioPaperColumn[] {
  const groups: Record<PortfolioPaperColumn["key"], PortfolioPaper[]> = {
    done: [],
    queued: [],
    reading: [],
  };
  for (const item of items) {
    groups[paperColumnKey(item.status)].push(paperFromContent(item));
  }
  return [
    {
      count: groups.queued.length,
      key: "queued",
      label: "Queued",
      papers: groups.queued,
    },
    {
      count: groups.reading.length,
      key: "reading",
      label: "Reading",
      papers: groups.reading,
    },
    {
      count: groups.done.length,
      key: "done",
      label: "Done",
      papers: groups.done,
    },
  ];
}

function paperFromContent(item: P2ContentItem): PortfolioPaper {
  return {
    arxiv: metadataString(item, "arxiv", "n/a"),
    authors:
      metadataStringArray(item, "authors").join(", ") || "Unknown authors",
    highlights: metadataNumber(item, "highlights", 0),
    notes: metadataNumber(item, "notes", 0),
    progress: metadataNumber(item, "progress", undefined),
    tags: metadataStringArray(item, "tags"),
    time: formatDate(item.updatedAt),
    title: item.title,
    venue: metadataString(item, "venue", "paper"),
    year: metadataString(
      item,
      "year",
      new Date(item.createdAt).getFullYear().toString(),
    ),
  };
}

function experimentFromContent(
  item: P2ContentItem,
  index: number,
): PortfolioExperiment {
  const curve = metadataNumberArray(item, "curve");
  return {
    branch: metadataString(item, "branch", `exp/${item.slug}`),
    curve: curve.length > 1 ? curve : [10, 16, 21, 28, 34, 40],
    hypothesis: item.summary || item.body,
    index: String(index + 1).padStart(2, "0"),
    metricLabel: metadataString(item, "metricLabel", "key metric"),
    metricValue: metadataString(item, "metricValue", item.status),
    name: item.title,
    progress: metadataNumber(item, "progress", undefined),
    status: experimentStatus(item.status),
    when: formatDate(item.updatedAt),
  };
}

function graphNodesFromPortfolio(portfolio: P2Portfolio): PortfolioGraphNode[] {
  const radius = 285;
  const centerX = 500;
  const centerY = 360;
  const nodes = portfolio.graph.nodes;
  return nodes.map((node, index) => {
    const angle =
      (index / Math.max(1, nodes.length)) * Math.PI * 2 - Math.PI / 2;
    return {
      focused: index === 0,
      id: node.id,
      label: index < 8 ? node.title : undefined,
      r: node.kind === "track" ? 12 : 8,
      type: graphNodeType(node.kind),
      x: Math.round(centerX + Math.cos(angle) * radius),
      y: Math.round(centerY + Math.sin(angle) * radius),
    };
  });
}

function contributionEntriesFromPortfolio(
  portfolio: P2Portfolio,
): ContributionEntry[] {
  const source = portfolio.activity ?? [];
  if (source.length === 0) {
    return [];
  }
  const byDate = new Map(source.map((entry) => [entry.date, entry]));
  const latestTimestamp = Math.max(
    ...source.map((entry) => parseDateOnly(entry.date).getTime()),
  );
  const endDate = new Date(latestTimestamp);
  const dayMs = 24 * 60 * 60 * 1000;
  return Array.from({ length: 53 * 7 }, (_, index) => {
    const current = new Date(endDate.getTime() - (53 * 7 - 1 - index) * dayMs);
    const date = formatDateOnly(current);
    const day = byDate.get(date);
    const notes = day?.notes ?? 0;
    const cards = day?.cards ?? 0;
    const commits = day?.commits ?? 0;
    const count = day?.count ?? notes + cards + commits;
    return {
      count,
      date,
      kind: dominantContributionKind(notes, cards, commits),
      level: contributionLevel(count),
    };
  });
}

function blockDistributionFromPortfolio(
  portfolio: P2Portfolio,
): PortfolioViewData["blockDistribution"] {
  if (portfolio.blockDistribution?.length) {
    return portfolio.blockDistribution;
  }
  const counts: Record<string, number> = {
    code: 0,
    math: 0,
    paper: 0,
    text: 0,
  };
  for (const item of Object.values(portfolio.items).flat()) {
    const label = blockLabelFromItem(item);
    const count = metadataNumber(item, "blocks", 0) || 1;
    counts[label] += count;
  }
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (!total) return [];
  const colors: Record<string, string> = {
    code: "#FFC247",
    math: "#75E3B1",
    paper: "#9BC7FF",
    text: "#53C7F5",
  };
  return ["math", "code", "paper", "text"]
    .filter((label) => counts[label] > 0)
    .map((label) => ({
      color: colors[label],
      count: counts[label],
      label,
      percent: Math.round((counts[label] / total) * 100),
    }));
}

function dominantContributionKind(
  notes: number,
  cards: number,
  commits: number,
): ContributionEntry["kind"] {
  if (commits > notes && commits > cards) return "commits";
  if (cards > notes) return "cards";
  return "notes";
}

function contributionLevel(count: number): ContributionEntry["level"] {
  if (count <= 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function parseDateOnly(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function blockLabelFromItem(item: P2ContentItem) {
  if (item.kind === "paper") return "paper";
  if (item.kind === "experiment") return "code";
  const tags = metadataStringArray(item, "tags").map((tag) =>
    tag.toLowerCase(),
  );
  if (tags.some((tag) => ["code", "kernel", "cuda", "triton"].includes(tag))) {
    return "code";
  }
  if (tags.includes("math")) return "math";
  if (tags.includes("paper") || tags.includes("论文精读")) return "paper";
  return "text";
}

function countForTab(portfolio: P2Portfolio, key: PortfolioTab["key"]) {
  switch (key) {
    case "tracks":
      return portfolio.stats.tracks;
    case "notes":
      return portfolio.stats.notes;
    case "papers":
      return portfolio.stats.papers;
    case "experiments":
      return portfolio.stats.experiments;
    default:
      return undefined;
  }
}

function trackStatus(status: string): PortfolioTrack["status"] {
  const normalized = status.toLowerCase();
  if (normalized.includes("progress") || normalized.includes("reading")) {
    return "in progress";
  }
  if (normalized.includes("draft") || normalized.includes("queued")) {
    return "draft";
  }
  return "shipped";
}

function paperColumnKey(status: string): PortfolioPaperColumn["key"] {
  const normalized = status.toLowerCase();
  if (normalized.includes("queue") || normalized.includes("draft")) {
    return "queued";
  }
  if (normalized.includes("read") || normalized.includes("progress")) {
    return "reading";
  }
  return "done";
}

function experimentStatus(status: string): PortfolioExperiment["status"] {
  const normalized = status.toLowerCase();
  if (normalized.includes("fail")) return "failed";
  if (normalized.includes("queue") || normalized.includes("draft"))
    return "queued";
  if (normalized.includes("run") || normalized.includes("progress"))
    return "running";
  return "done";
}

function statusProgress(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("draft")) return 25;
  if (normalized.includes("progress") || normalized.includes("reading"))
    return 65;
  return 100;
}

function noteKind(item: P2ContentItem): PortfolioNoteKind {
  const tags = metadataStringArray(item, "tags").map((tag) =>
    tag.toLowerCase(),
  );
  if (tags.includes("math")) return "math";
  if (tags.includes("code")) return "code";
  if (tags.includes("paper")) return "paper";
  return "text";
}

function graphNodeType(kind: P2ContentItem["kind"]): GraphNodeType {
  switch (kind) {
    case "track":
      return "hub";
    case "paper":
      return "paper";
    case "experiment":
      return "code";
    default:
      return "text";
  }
}

function accentFromItem(item: P2ContentItem): PortfolioTrack["accent"] {
  const tags = metadataStringArray(item, "tags").join(" ").toLowerCase();
  if (tags.includes("diffusion")) return "purple";
  if (tags.includes("code") || tags.includes("kernel")) return "amber";
  if (tags.includes("inference")) return "green";
  return "ink";
}

function totalItems(portfolio: P2Portfolio) {
  return (
    portfolio.stats.tracks +
    portfolio.stats.notes +
    portfolio.stats.papers +
    portfolio.stats.experiments
  );
}

function totalMetadataNumber(portfolio: P2Portfolio, key: string) {
  return Object.values(portfolio.items)
    .flat()
    .reduce((sum, item) => sum + metadataNumber(item, key, 0), 0);
}

function metadataNumber(
  item: P2ContentItem,
  key: string,
  fallback: number,
): number;
function metadataNumber(
  item: P2ContentItem,
  key: string,
  fallback: undefined,
): number | undefined;
function metadataNumber(
  item: P2ContentItem,
  key: string,
  fallback: number | undefined,
) {
  const value = item.metadata[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function metadataNumberArray(item: P2ContentItem, key: string) {
  const value = item.metadata[key];
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is number => typeof entry === "number");
}

function metadataString(item: P2ContentItem, key: string, fallback: string) {
  const value = item.metadata[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function metadataStringArray(item: P2ContentItem, key: string) {
  const value = item.metadata[key];
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonth(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return portfolioProfile.joined;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}
