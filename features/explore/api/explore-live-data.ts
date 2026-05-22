import type { P4ExploreItem, P4ExploreResult } from "@/lib/api/p4";

import { feedItems, tagStats } from "../data/explore-fixtures";
import type { ExploreFeedItem } from "../model/explore-model";

export type ExploreViewData = {
  feedItems: ExploreFeedItem[];
  tagStats: readonly (readonly [string, string])[];
  total: number;
};

export const fallbackExploreViewData: ExploreViewData = {
  feedItems: [...feedItems],
  tagStats,
  total: feedItems.length,
};

export function exploreViewDataFromP4(
  result: P4ExploreResult,
): ExploreViewData {
  return {
    feedItems: result.items.map(feedItemFromP4),
    tagStats: result.tags.map((tag) => [tag.tag, String(tag.count)] as const),
    total: result.total,
  };
}

export function exploreHasLiveContent(result: P4ExploreResult) {
  return result.items.length > 0;
}

function feedItemFromP4(row: P4ExploreItem): ExploreFeedItem {
  const item = row.item;
  const handle = authorHandle(row);
  return {
    author: authorName(row),
    avatar: authorAvatar(row),
    body: item.summary || item.body,
    cites: metadataNumber(item.metadata, "cites", 0),
    color: avatarColor(item.ownerId),
    comments: row.counts.comments,
    handle,
    id: item.id,
    meta: `${formatDate(item.updatedAt)} · ${trackLabel(item)}`,
    ownerId: item.ownerId,
    swatches: swatchesForTags(row.tags),
    tags: row.tags,
    title: item.title,
    votes: row.counts.likes,
    views: row.counts.views,
  };
}

function authorName(row: P4ExploreItem) {
  if (row.author?.displayName) return row.author.displayName;
  const name = metadataString(row.item.metadata, "author", "");
  if (name) return name;
  return `Author ${row.item.ownerId.slice(0, 6)}`;
}

function authorHandle(row: P4ExploreItem) {
  if (row.author?.handle) return `@${row.author.handle.replace(/^@/u, "")}`;
  const handle = metadataString(row.item.metadata, "handle", "");
  if (handle) return handle.startsWith("@") ? handle : `@${handle}`;
  return `@${row.item.ownerId.slice(0, 8)}`;
}

function authorAvatar(row: P4ExploreItem) {
  const name = authorName(row).trim();
  return name ? name.slice(0, 1).toUpperCase() : "S";
}

function trackLabel(item: P4ExploreItem["item"]) {
  return metadataString(item.metadata, "track", "Published Notes");
}

function avatarColor(ownerId: string) {
  const colors = [
    "bg-[var(--syn-accent)]",
    "bg-[#8A5B45]",
    "bg-[#7A7066]",
    "bg-[#315B4C]",
  ];
  const index = ownerId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

function swatchesForTags(tags: readonly string[]) {
  if (tags.length === 0) {
    return ["text"] as const;
  }
  return tags.slice(0, 3);
}

function metadataString(
  metadata: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = metadata[key];
  return typeof value === "string" ? value : fallback;
}

function metadataNumber(
  metadata: Record<string, unknown>,
  key: string,
  fallback: number,
) {
  const value = metadata[key];
  return typeof value === "number" ? value : fallback;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "recently";
  }
  return date.toLocaleDateString("zh-CN", {
    day: "2-digit",
    month: "2-digit",
  });
}
