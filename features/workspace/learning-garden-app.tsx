"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CommunityScreen } from "@/features/community/community-screen";
import { ConceptScreen } from "@/features/concepts/concept-screen";
import { ReviewScreen } from "@/features/review/review-screen";
import { StudioScreen } from "@/features/studio/studio-screen";
import { WorkspaceScreen } from "@/features/workspace/workspace-screen";
import { mockConcepts, mockReviewCards, mockRoadmapTasks } from "@/lib/api/mock/fixtures";
import type { Screen } from "@/lib/demo/synapse-types";

export function LearningGardenApp() {
  const [screen, setScreen] = useState<Screen>("workspace");
  const [showRunOutput, setShowRunOutput] = useState(false);
  const [userCode, setUserCode] = useState(mockReviewCards[0]?.userCode ?? "");
  const [showCompare, setShowCompare] = useState(false);

  const goTo = (nextScreen: Screen) => {
    setScreen(nextScreen);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AppShell active={screen} goTo={goTo}>
        {screen === "workspace" ? (
          <WorkspaceScreen concepts={mockConcepts} goTo={goTo} roadmapTasks={mockRoadmapTasks} />
        ) : null}
        {screen === "studio" ? (
          <StudioScreen concept={mockConcepts[0]!} onSave={() => undefined} />
        ) : null}
        {screen === "concept" ? (
          <ConceptScreen
            concept={mockConcepts[0]!}
            goTo={goTo}
            onRun={() => setShowRunOutput(true)}
            runOutput={{
              durationMs: 38,
              stderr: "",
              stdout: "w = 2.98 b = 4.07\nR2 = 0.95",
              status: "succeeded",
            }}
            showRunOutput={showRunOutput}
          />
        ) : null}
        {screen === "community" ? <CommunityScreen goTo={goTo} /> : null}
        {screen === "review" ? (
          <ReviewScreen
            cards={mockReviewCards}
            onCompare={() => setShowCompare(true)}
            setUserCode={setUserCode}
            showCompare={showCompare}
            userCode={userCode}
          />
        ) : null}
    </AppShell>
  );
}
