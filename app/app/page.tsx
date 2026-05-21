"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CommunityPage } from "@/components/community/community-page";
import { ExplorePage } from "@/components/explore/explore-page";
import { portfolioProfile } from "@/components/portfolio/portfolio-model";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { StudioEditor } from "@/components/studio/studio-editor";
import { ContributionsPanel } from "@/components/workspace/contributions-panel";
import { WorkspaceHeader } from "@/components/workspace/header";
import { InlineStatusBar } from "@/components/workspace/inline-status-bar";
import { NotificationsPanel } from "@/components/workspace/notifications-panel";
import { RoadmapPanel } from "@/components/workspace/roadmap-panel";
import { TodayPanel } from "@/components/workspace/today-panel";
import { SynapseLogo } from "@/components/synapse/synapse-logo";
import {
  logout,
  requestCurrentUser,
  type SynapseUser,
} from "@/lib/auth/session";

export default function AppHomePage() {
  return (
    <Suspense fallback={<AppLoading />}>
      <AppHomeContent />
    </Suspense>
  );
}

function AppHomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<SynapseUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let cancelled = false;
    requestCurrentUser()
      .then((currentUser) => {
        if (cancelled) return;
        if (!currentUser) {
          router.replace("/auth?mode=login");
          return;
        }
        setUser(currentUser);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) router.replace("/auth?mode=login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    await logout();
    router.replace("/auth?mode=login");
  }

  if (status === "loading") {
    return <AppLoading />;
  }

  const displayName = user?.displayName || user?.handle || "李哲";
  const shortName = displayName.slice(-1);
  const currentView = searchParams.get("view");
  const isEditorView = currentView === "editor";
  const isExploreView = currentView === "explore";
  const isCommunityView = currentView === "community";
  const isPortfolioView = currentView === "portfolio";
  const appMode =
    isExploreView || isCommunityView || isPortfolioView ? "reading" : "working";

  return (
    <main
      className={
        appMode === "reading"
          ? "syn-reading-mode min-h-dvh bg-[var(--syn-reading-bg)] text-[var(--syn-reading-ink)]"
          : "syn-working-mode min-h-dvh bg-[var(--syn-working-bg)] text-[var(--syn-working-ink)]"
      }
    >
      <WorkspaceHeader
        activeItem={
          isEditorView
            ? "Studio"
            : isExploreView
              ? "Explore"
              : isCommunityView
                ? "Community"
                : isPortfolioView
                  ? "Portfolio"
                  : "Workspace"
        }
        avatarImageSrc={portfolioProfile.avatarImageSrc}
        displayName={displayName}
        mode={appMode}
        onLogout={handleLogout}
        shortName={shortName}
      />

      {isEditorView ? <StudioEditor /> : null}
      {isExploreView ? <ExplorePage /> : null}
      {isCommunityView ? <CommunityPage /> : null}
      {isPortfolioView ? <PortfolioPage /> : null}

      {!isEditorView &&
      !isExploreView &&
      !isCommunityView &&
      !isPortfolioView ? (
        <div className="mx-auto grid max-w-[1840px] gap-8 px-4 pb-0 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_470px] lg:px-11">
          <div className="min-w-0">
            <section className="max-w-[920px]">
              <p className="mb-1 text-[14px] font-normal leading-4 text-text-secondary md:text-[15px]">
                Stage 2 · Week 4&nbsp;&nbsp;·&nbsp;&nbsp;Transformer 精读
              </p>
              <h1 className="text-[22px] font-medium leading-6 text-[var(--syn-working-ink)] md:text-[26px]">
                还有{" "}
                <span className="font-semibold text-[var(--syn-working-ink)]">
                  3 天
                </span>{" "}
                到阶段目标
              </h1>
            </section>
            <InlineStatusBar />

            <RoadmapPanel />
          </div>

          <aside className="grid content-start gap-6">
            <TodayPanel />
            <ContributionsPanel />
            <NotificationsPanel />
          </aside>
        </div>
      ) : null}
    </main>
  );
}

function AppLoading() {
  return (
    <main className="sn-app-loading">
      <SynapseLogo size={28} />
      <span>正在恢复会话...</span>
    </main>
  );
}
