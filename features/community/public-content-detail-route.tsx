"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { PublicContentDetailScreen } from "@/features/community/public-content-detail-screen";
import { contentApi, normalizeApiError, socialApi } from "@/lib/api";
import type { Comment as ApiComment, PublicContentDetail } from "@/lib/api";

export function PublicContentDetailRoute({ slug }: { slug: string }) {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<
    | { comments: ApiComment[]; concept: PublicContentDetail; status: "ready" }
    | { message: string; status: "error" }
    | { status: "loading" }
  >({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    contentApi
      .getPublicContent(slug)
      .then(async (concept) => {
        const comments = await socialApi.getComments({ targetId: concept.id, targetType: "content" });
        if (isActive) {
          setState({ comments, concept, status: "ready" });
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

  const createComment = async (body: string, parentId?: string) => {
    if (state.status !== "ready") {
      return;
    }

    const comment = await socialApi.createComment({
      body,
      parentId,
      targetId: state.concept.id,
      targetType: "content",
    });
    setState((current) =>
      current.status === "ready"
        ? { ...current, comments: [comment, ...current.comments] }
        : current,
    );
  };

  const deleteComment = async (id: string) => {
    await socialApi.deleteComment(id);
    setState((current) =>
      current.status === "ready"
        ? { ...current, comments: current.comments.filter((comment) => comment.id !== id) }
        : current,
    );
  };

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
      {state.status === "ready" ? (
        <PublicContentDetailScreen
          comments={state.comments}
          concept={state.concept}
          onCreateComment={createComment}
          onDeleteComment={deleteComment}
          onReplyToComment={(parentId, body) => createComment(body, parentId)}
        />
      ) : null}
    </AppShell>
  );
}
