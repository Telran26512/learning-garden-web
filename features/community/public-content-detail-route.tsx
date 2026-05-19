"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { PublicContentDetailScreen } from "@/features/community/public-content-detail-screen";
import { contentApi, normalizeApiError } from "@/lib/api";
import type { Concept } from "@/lib/api";

export function PublicContentDetailRoute({ slug }: { slug: string }) {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<
    | { concept: Concept; status: "ready" }
    | { message: string; status: "error" }
    | { status: "loading" }
  >({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    contentApi
      .getPublicContent(slug)
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
  }, [slug]);

  return (
    <AppShell active="community" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 读取公开题解详情。"
          label="Mock API"
          title="同步公开内容"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="公开内容加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? <PublicContentDetailScreen concept={state.concept} /> : null}
    </AppShell>
  );
}
