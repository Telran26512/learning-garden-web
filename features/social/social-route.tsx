"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { SocialScreen } from "@/features/social/social-screen";
import { normalizeApiError, socialApi } from "@/lib/api";
import type { ActivityFeedItem, Discussion, NotificationItem } from "@/lib/api";

type SocialState =
  | {
      discussions: Discussion[];
      feed: ActivityFeedItem[];
      notifications: NotificationItem[];
      status: "ready";
    }
  | { message: string; status: "error" }
  | { status: "loading" };

export function SocialRoute() {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<SocialState>({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    Promise.all([socialApi.getFeed(), socialApi.getDiscussions(), socialApi.getNotifications()])
      .then(([feed, discussions, notifications]) => {
        if (isActive) {
          setState({ discussions, feed, notifications, status: "ready" });
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

  const createDiscussion = async (input: { body: string; title: string }) => {
    const discussion = await socialApi.createDiscussion(input);
    setState((current) =>
      current.status === "ready"
        ? { ...current, discussions: [discussion, ...current.discussions] }
        : current,
    );
  };

  const markNotificationRead = async (id: string) => {
    const notification = await socialApi.markNotificationRead(id);
    setState((current) =>
      current.status === "ready"
        ? {
            ...current,
            notifications: current.notifications.map((item) =>
              item.id === notification.id ? notification : item,
            ),
          }
        : current,
    );
  };

  const replyToDiscussion = async (discussionId: string, body: string) => {
    const reply = await socialApi.replyToDiscussion(discussionId, {
      body,
      targetId: discussionId,
      targetType: "discussion",
    });
    setState((current) =>
      current.status === "ready"
        ? {
            ...current,
            discussions: current.discussions.map((discussion) =>
              discussion.id === discussionId
                ? {
                    ...discussion,
                    replies: [reply, ...discussion.replies],
                    replyCount: discussion.replyCount + 1,
                  }
                : discussion,
            ),
          }
        : current,
    );
  };

  return (
    <AppShell active="community" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 同步动态、讨论和通知。"
          label="Mock API"
          title="同步社交流"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="社交数据加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? (
        <SocialScreen
          discussions={state.discussions}
          feed={state.feed}
          notifications={state.notifications}
          onCreateDiscussion={createDiscussion}
          onMarkNotificationRead={markNotificationRead}
          onReplyToDiscussion={replyToDiscussion}
        />
      ) : null}
    </AppShell>
  );
}
