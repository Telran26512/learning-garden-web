"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { GraphScreen } from "@/features/graph/graph-screen";
import { normalizeApiError, relationApi } from "@/lib/api";
import type { KnowledgeGraph } from "@/lib/api";

type GraphState =
  | { graph: KnowledgeGraph; status: "ready" }
  | { message: string; status: "error" }
  | { status: "loading" };

export function GraphRoute() {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<GraphState>({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    relationApi
      .getGraph()
      .then((graph) => {
        if (isActive) {
          setState({ graph, status: "ready" });
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
  }, []);

  return (
    <AppShell active="graph" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在读取 mock 知识图谱。"
          label="Mock API"
          title="同步关系图谱"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="图谱加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? <GraphScreen graph={state.graph} /> : null}
    </AppShell>
  );
}
