"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { StudioScreen } from "@/features/studio/studio-screen";
import { contentApi, normalizeApiError } from "@/lib/api";
import type { Concept, UpdateConceptInput } from "@/lib/api";

export function StudioRoute() {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<
    | { status: "error"; message: string }
    | { concept: Concept; savedAt?: string; status: "ready" }
    | { status: "loading" }
  >({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    contentApi
      .getConcept("concept_linear_regression")
      .then((concept) => {
        if (isActive) {
          setState({ concept, status: "ready" });
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

  const saveConcept = async (input: UpdateConceptInput) => {
    if (state.status !== "ready") {
      return;
    }

    const concept = await contentApi.updateConcept(state.concept.id, input);
    setState({ concept, savedAt: new Date().toLocaleTimeString("zh-CN"), status: "ready" });
  };

  return (
    <AppShell active="studio" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 读取可编辑内容。"
          label="Mock API"
          title="同步 Studio 草稿"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="Studio 数据加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? (
        <StudioScreen concept={state.concept} onSave={saveConcept} savedAt={state.savedAt} />
      ) : null}
    </AppShell>
  );
}
