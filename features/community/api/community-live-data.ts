import type { P2CommunityFeed, P2CommunityFeedItem } from "@/lib/api/p2";

import type { CommunityFeedItem } from "../model/community-model";

export function communityFeedFromP2(
  feed: P2CommunityFeed,
): CommunityFeedItem[] {
  return feed.items.map(feedItemFromP2);
}

function feedItemFromP2(item: P2CommunityFeedItem): CommunityFeedItem {
  if (item.kind === "track") {
    return {
      accent: "ink",
      author: item.actor || "Synapse",
      avatar: initials(item.actor || item.title),
      body: item.summary,
      id: item.id,
      kind: "track",
      label: firstTag(item) ? `Trending track · ${firstTag(item)}` : "Track",
      meta: trackMeta(item),
      metrics: [
        metadataString(item, "reach", "public"),
        `${metadataNumber(item, "forks", 0)} forks`,
        `${metadataNumber(item, "discussions", 0)} discussions`,
      ],
      title: item.title,
    };
  }

  if (item.kind === "experiment") {
    return {
      accent: "ink",
      action: "shared an experiment",
      author: item.actor || "Synapse",
      avatar: initials(item.actor || item.title),
      id: item.id,
      kind: "experiment",
      label: "Experiment",
      meta: formatDate(item.updatedAt),
      metrics: [
        `▲ ${metadataNumber(item, "links", 0)}`,
        "↪ open in Synapse Lab",
        "↗ share",
      ],
      title: item.title,
    };
  }

  if (item.kind === "paper") {
    return {
      accent: "purple",
      action: "published paper notes",
      author: item.actor || "Synapse",
      avatar: initials(item.actor || item.title),
      id: item.id,
      kind: "thread",
      label: "Paper",
      meta: formatDate(item.updatedAt),
      metrics: [
        `▲ ${metadataNumber(item, "links", 0)}`,
        "↪ discuss",
        "◷ save",
        "↗ share",
      ],
      paper: item.title,
      quote: item.summary,
      title: item.title,
    };
  }

  return {
    accent: noteAccent(item),
    action: "published a note",
    author: item.actor || "Synapse",
    avatar: initials(item.actor || item.title),
    id: item.id,
    kind: "note",
    label: firstTag(item) || "Note",
    meta: formatDate(item.updatedAt),
    metrics: [
      `▲ ${metadataNumber(item, "links", 0)}`,
      `↪ ${metadataNumber(item, "blocks", 0)} blocks`,
      "↗ share",
    ],
    quote: item.summary,
    tags: metadataStringArray(item, "tags"),
    title: item.title,
  };
}

function trackMeta(item: P2CommunityFeedItem) {
  const notes = metadataNumber(item, "notes", 0);
  const papers = metadataNumber(item, "papers", 0);
  const parts = [];
  if (notes) parts.push(`${notes} notes`);
  if (papers) parts.push(`${papers} papers`);
  return parts.length ? parts.join(" · ") : formatDate(item.updatedAt);
}

function noteAccent(item: P2CommunityFeedItem): CommunityFeedItem["accent"] {
  const tags = metadataStringArray(item, "tags").join(" ").toLowerCase();
  if (tags.includes("math")) return "green";
  if (tags.includes("paper")) return "purple";
  return "amber";
}

function firstTag(item: P2CommunityFeedItem) {
  return metadataStringArray(item, "tags")[0] ?? "";
}

function metadataNumber(
  item: P2CommunityFeedItem,
  key: string,
  fallback: number,
) {
  const value = item.metadata[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function metadataString(
  item: P2CommunityFeedItem,
  key: string,
  fallback: string,
) {
  const value = item.metadata[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function metadataStringArray(item: P2CommunityFeedItem, key: string) {
  const value = item.metadata[key];
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}
