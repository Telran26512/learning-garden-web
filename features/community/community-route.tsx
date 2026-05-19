"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { CommunityScreen } from "@/features/community/community-screen";
import { contentApi, normalizeApiError } from "@/lib/api";
import type { Concept } from "@/lib/api";

export function CommunityRoute() {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<
    | { status: "error"; message: string }
    | { concepts: Concept[]; status: "ready" }
    | { status: "loading" }
  >({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    contentApi
      .listConcepts()
      .then((concepts) => {
        if (isActive) {
          setState({ concepts, status: "ready" });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({ message: normalizeApiError(error).message, status: "error" });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <AppShell active="community" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 读取可公开浏览的学习内容。"
          label="Mock API"
          title="同步 Community Feed"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="Community 数据加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? <CommunityScreen concepts={state.concepts} goTo={goTo} /> : null}
    </AppShell>
  );
}
