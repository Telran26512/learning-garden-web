import type { P6SearchHit, P6SearchResult } from "@/lib/api/p6";

import type { ExploreFeedItem } from "../model/explore-model";
import type { ExploreViewData } from "./explore-live-data";

export function exploreViewDataFromP6Search(
  result: P6SearchResult,
): ExploreViewData {
  const tagCounts = new Map<string, number>();
  for (const item of result.items) {
    for (const tag of item.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return {
    feedItems: result.items.map(feedItemFromSearchHit),
    tagStats: [...tagCounts.entries()].map(
      ([tag, count]) => [tag, String(count)] as const,
    ),
    total: result.total,
  };
}

function feedItemFromSearchHit(hit: P6SearchHit): ExploreFeedItem {
  return {
    author: "Synapse",
    avatar: "S",
    body: hit.preview,
    cites: 0,
    color: "bg-[var(--syn-accent)]",
    comments: 0,
    handle: "@search",
    id: hit.noteId,
    meta: `${formatDate(hit.updatedAt)} · semantic score ${hit.score.toFixed(2)}`,
    ownerId: hit.noteId,
    swatches: hit.tags.length > 0 ? hit.tags.slice(0, 3) : ["text"],
    tags: hit.tags,
    title: hit.title,
    votes: Math.round(hit.score * 100),
    views: Math.round(hit.similarity * 100),
  };
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
