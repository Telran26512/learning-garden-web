"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { WorkspaceScreen } from "@/features/workspace/workspace-screen";
import { contentApi, learningApi, normalizeApiError } from "@/lib/api";
import type { Concept, RoadmapTask } from "@/lib/api";

export function WorkspaceRoute() {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<
    | { status: "error"; message: string }
    | { concepts: Concept[]; roadmapTasks: RoadmapTask[]; status: "ready" }
    | { status: "loading" }
  >({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    Promise.all([learningApi.getRoadmap(), contentApi.listConcepts({ owner: "me" })])
      .then(([roadmapTasks, concepts]) => {
        if (isActive) {
          setState({ concepts, roadmapTasks, status: "ready" });
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
    <AppShell active="workspace" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 读取路线图和个人概念。"
          label="Mock API"
          title="同步 Workspace 数据"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="Workspace 数据加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? (
        <WorkspaceScreen concepts={state.concepts} goTo={goTo} roadmapTasks={state.roadmapTasks} />
      ) : null}
    </AppShell>
  );
}
