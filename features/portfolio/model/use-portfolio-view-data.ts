import { useEffect, useState } from "react";

import { fetchPortfolio, type P2Portfolio } from "../../../lib/api/p2";

import {
  fallbackPortfolioViewData,
  portfolioHasLiveContent,
  portfolioViewDataFromP2,
  type PortfolioViewData,
} from "../api/portfolio-live-data";

export type PortfolioViewStatus = "empty" | "error" | "live" | "loading";

export type PortfolioViewState = {
  error: string;
  status: PortfolioViewStatus;
  viewData: PortfolioViewData;
};

type StoredPortfolioViewState = PortfolioViewState & {
  requestKey: string;
};

export function usePortfolioViewData(profileHandle: string) {
  const requestKey = profileHandle.trim();
  const [state, setState] = useState<StoredPortfolioViewState>(() => ({
    error: "",
    requestKey,
    status: "loading",
    viewData: emptyPortfolioViewData(profileHandle),
  }));

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio(profileHandle)
      .then((portfolio) => {
        if (!cancelled) {
          setState({
            ...createPortfolioLoadedState(profileHandle, portfolio),
            requestKey,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            ...createPortfolioErrorState(profileHandle, error),
            requestKey,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [profileHandle, requestKey]);

  if (state.requestKey !== requestKey) {
    return {
      error: "",
      status: "loading" as const,
      viewData: emptyPortfolioViewData(profileHandle),
    };
  }

  return {
    error: state.error,
    status: state.status,
    viewData: state.viewData,
  };
}

export function createPortfolioLoadedState(
  profileHandle: string,
  portfolio: P2Portfolio,
): PortfolioViewState {
  if (!portfolioHasLiveContent(portfolio)) {
    return {
      error: "",
      status: "empty",
      viewData: emptyPortfolioViewData(profileHandle, portfolio),
    };
  }

  return {
    error: "",
    status: "live",
    viewData: portfolioViewDataFromP2(portfolio),
  };
}

export function createPortfolioErrorState(
  profileHandle: string,
  error: unknown,
): PortfolioViewState {
  return {
    error: error instanceof Error ? error.message : "Profile 接口请求失败",
    status: "error",
    viewData: emptyPortfolioViewData(profileHandle),
  };
}

function emptyPortfolioViewData(
  profileHandle: string,
  portfolio?: P2Portfolio,
): PortfolioViewData {
  const handle = (portfolio?.profile.handle || profileHandle)
    .trim()
    .replace(/^@/, "");
  const name =
    portfolio?.profile.displayName ||
    handle
      .split(/[-_]/u)
      .filter(Boolean)
      .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
      .join(" ") ||
    fallbackPortfolioViewData.profile.name;

  return {
    blockDistribution: [],
    contributionEntries: [],
    experiments: [],
    graphEdges: [],
    graphNodes: [],
    notes: [],
    paperColumns: [],
    pinnedTracks: [],
    profile: {
      ...fallbackPortfolioViewData.profile,
      handle: `@${handle || "unknown"}`,
      name,
    },
    stats: fallbackPortfolioViewData.stats.map((item) => ({
      ...item,
      value: "0",
    })),
    tabs: fallbackPortfolioViewData.tabs.map((tab) => ({
      ...tab,
      count: 0,
    })),
    topTopics: [],
    tracks: [],
  };
}
