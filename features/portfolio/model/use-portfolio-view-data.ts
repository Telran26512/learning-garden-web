import { useEffect, useState } from "react";

import { fetchPortfolio } from "@/lib/api/p2";

import {
  fallbackPortfolioViewData,
  portfolioHasLiveContent,
  portfolioViewDataFromP2,
  type PortfolioViewData,
} from "../api/portfolio-live-data";

export function usePortfolioViewData(profileHandle: string) {
  const [viewData, setViewData] = useState<PortfolioViewData>(
    fallbackPortfolioViewData,
  );

  useEffect(() => {
    let cancelled = false;
    fetchPortfolio(profileHandle)
      .then((portfolio) => {
        if (!cancelled && portfolioHasLiveContent(portfolio)) {
          setViewData(portfolioViewDataFromP2(portfolio));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setViewData(fallbackPortfolioViewData);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [profileHandle]);

  return viewData;
}
