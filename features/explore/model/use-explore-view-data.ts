import { useEffect, useState } from "react";

import { fetchExplore, type P4ExploreResult } from "../../../lib/api/p4";
import { fetchSearch, type P6SearchResult } from "../../../lib/api/p6";

import {
  exploreHasLiveContent,
  exploreViewDataFromP4,
  type ExploreViewData,
} from "../api/explore-live-data";
import { exploreViewDataFromP6Search } from "../api/explore-search-data";
import type { ExploreFeedTab, ExploreRange } from "./explore-model";

export type ExploreViewStatus = "empty" | "error" | "live" | "loading";

export type ExploreViewState = {
  error: string;
  status: ExploreViewStatus;
  viewData: ExploreViewData;
};

type StoredExploreViewState = ExploreViewState & {
  requestKey: string;
};

export const emptyExploreViewData: ExploreViewData = {
  feedItems: [],
  tagStats: [],
  total: 0,
};

export function useExploreViewData(
  activeTab: ExploreFeedTab,
  activeTag = "",
  activeRange: ExploreRange = "7d",
  searchQuery = "",
) {
  const normalizedSearch = searchQuery.trim();
  const requestKey = `${activeTab}\u0000${activeTag}\u0000${activeRange}\u0000${normalizedSearch}`;
  const [state, setState] = useState<StoredExploreViewState>(() => ({
    error: "",
    requestKey,
    status: "loading",
    viewData: emptyExploreViewData,
  }));

  useEffect(() => {
    let cancelled = false;
    const request =
      normalizedSearch || activeTab === "Tags"
        ? fetchSearch({
            kind: "note",
            limit: 50,
            query: normalizedSearch,
            tag: activeTag,
          }).then(createExploreSearchLoadedState)
        : fetchExplore({
            limit: 50,
            range: activeRange,
            tab: activeTab,
            tag: activeTag,
          }).then(createExploreLoadedState);
    request
      .then((result) => {
        if (!cancelled) {
          setState({
            ...result,
            requestKey,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            ...createExploreErrorState(error),
            requestKey,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeRange, activeTab, activeTag, normalizedSearch, requestKey]);

  if (state.requestKey !== requestKey) {
    return {
      error: "",
      status: "loading" as const,
      viewData: emptyExploreViewData,
    };
  }

  return {
    error: state.error,
    status: state.status,
    viewData: state.viewData,
  };
}

export function createExploreLoadedState(
  result: P4ExploreResult,
): ExploreViewState {
  return {
    error: "",
    status: exploreHasLiveContent(result) ? "live" : "empty",
    viewData: exploreViewDataFromP4(result),
  };
}

export function createExploreSearchLoadedState(
  result: P6SearchResult,
): ExploreViewState {
  return {
    error: "",
    status: result.items.length > 0 ? "live" : "empty",
    viewData: exploreViewDataFromP6Search(result),
  };
}

export function createExploreErrorState(error: unknown): ExploreViewState {
  return {
    error: error instanceof Error ? error.message : "Explore 接口请求失败",
    status: "error",
    viewData: emptyExploreViewData,
  };
}
