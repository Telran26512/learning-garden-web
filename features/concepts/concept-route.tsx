"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { ConceptScreen } from "@/features/concepts/concept-screen";
import { contentApi, normalizeApiError, runtimeApi } from "@/lib/api";
import type { Concept, PythonRunResponse } from "@/lib/api";

export function ConceptRoute() {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<
    | { status: "error"; message: string }
    | { concept: Concept; runOutput?: PythonRunResponse; status: "ready" }
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

  const runPython = async () => {
    if (state.status !== "ready") {
      return;
    }

    const code = state.concept.sections.find((section) => section.kind === "code")?.body ?? "";
    const runOutput = await runtimeApi.runPython({ code });
    setState({ ...state, runOutput });
  };

  return (
    <AppShell active="concept" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 读取线性回归概念材料。"
          label="Mock API"
          title="同步 Concept 数据"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="Concept 数据加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? (
        <ConceptScreen
          concept={state.concept}
          goTo={goTo}
          onRun={runPython}
          runOutput={state.runOutput}
          showRunOutput={Boolean(state.runOutput)}
        />
      ) : null}
    </AppShell>
  );
}
