"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { PortfolioScreen } from "@/features/portfolio/portfolio-screen";
import { normalizeApiError, portfolioApi } from "@/lib/api";
import type { Portfolio } from "@/lib/api";

type PortfolioState =
  | { portfolio: Portfolio; status: "ready" }
  | { message: string; status: "error" }
  | { status: "loading" };

export function PortfolioRoute({ userId }: { userId: string }) {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<PortfolioState>({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    portfolioApi
      .getPortfolio(userId)
      .then((portfolio) => {
        if (isActive) {
          setState({ portfolio, status: "ready" });
        }
      })
      .catch((unknownError: unknown) => {
        if (isActive) {
          setState({ message: normalizeApiError(unknownError).message, status: "error" });
        }
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  return (
    <AppShell active="portfolio" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在读取 mock 作品集证据。"
          label="Mock API"
          title="同步作品集"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="作品集加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? <PortfolioScreen portfolio={state.portfolio} /> : null}
    </AppShell>
  );
}
