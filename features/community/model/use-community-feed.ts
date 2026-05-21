import { useEffect, useState } from "react";

import { fetchCommunityFeed } from "@/lib/api/p2";

import { communityFeed, type CommunityFeedItem } from "./community-model";
import { communityFeedFromP2 } from "../api/community-live-data";

export function useCommunityFeed() {
  const [feedItems, setFeedItems] =
    useState<readonly CommunityFeedItem[]>(communityFeed);

  useEffect(() => {
    let cancelled = false;
    fetchCommunityFeed({ limit: 20 })
      .then((feed) => {
        if (!cancelled && feed.items.length > 0) {
          setFeedItems(communityFeedFromP2(feed));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFeedItems(communityFeed);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return feedItems;
}
