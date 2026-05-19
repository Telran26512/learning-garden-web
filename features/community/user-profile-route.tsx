"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { UserProfileScreen } from "@/features/community/user-profile-screen";
import { contentApi, normalizeApiError, socialApi } from "@/lib/api";
import type { PublicProfile } from "@/lib/api";

export function UserProfileRoute({ id }: { id: string }) {
  const goTo = useSynapseNavigation();
  const [state, setState] = useState<
    | { profile: PublicProfile; status: "ready" }
    | { message: string; status: "error" }
    | { status: "loading" }
  >({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    contentApi
      .getPublicProfile(id)
      .then((profile) => {
        if (isActive) {
          setState({ profile, status: "ready" });
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
  }, [id]);

  const toggleFollow = async () => {
    if (state.status !== "ready") {
      return;
    }

    const profile = state.profile.isFollowing
      ? await socialApi.unfollowUser(state.profile.id)
      : await socialApi.followUser(state.profile.id);
    setState({ profile, status: "ready" });
  };

  return (
    <AppShell active="community" goTo={goTo}>
      {state.status === "loading" ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 读取公开个人资料。"
          label="Mock API"
          title="同步用户资料"
          tone="green"
        />
      ) : null}
      {state.status === "error" ? (
        <StateSurface
          className="my-8"
          description={state.message}
          label="API Error"
          title="用户资料加载失败"
          tone="amber"
        />
      ) : null}
      {state.status === "ready" ? (
        <UserProfileScreen onToggleFollow={toggleFollow} profile={state.profile} />
      ) : null}
    </AppShell>
  );
}
