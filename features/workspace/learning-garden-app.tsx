"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CommunityScreen } from "@/features/community/community-screen";
import { ConceptScreen } from "@/features/concepts/concept-screen";
import { ReviewScreen } from "@/features/review/review-screen";
import { StudioScreen } from "@/features/studio/studio-screen";
import { WorkspaceScreen } from "@/features/workspace/workspace-screen";
import { defaultUserCode } from "@/lib/demo/synapse-data";
import type { Screen } from "@/lib/demo/synapse-types";

export function LearningGardenApp() {
  const [screen, setScreen] = useState<Screen>("workspace");
  const [showRunOutput, setShowRunOutput] = useState(false);
  const [userCode, setUserCode] = useState(defaultUserCode);
  const [showCompare, setShowCompare] = useState(false);

  const goTo = (nextScreen: Screen) => {
    setScreen(nextScreen);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AppShell active={screen} goTo={goTo}>
        {screen === "workspace" ? <WorkspaceScreen goTo={goTo} /> : null}
        {screen === "studio" ? <StudioScreen /> : null}
        {screen === "concept" ? (
          <ConceptScreen
            goTo={goTo}
            onRun={() => setShowRunOutput(true)}
            showRunOutput={showRunOutput}
          />
        ) : null}
        {screen === "community" ? <CommunityScreen goTo={goTo} /> : null}
        {screen === "review" ? (
          <ReviewScreen
            onCompare={() => setShowCompare(true)}
            setUserCode={setUserCode}
            showCompare={showCompare}
            userCode={userCode}
          />
        ) : null}
    </AppShell>
  );
}
