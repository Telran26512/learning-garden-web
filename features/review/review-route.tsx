"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { ReviewScreen } from "@/features/review/review-screen";
import { defaultUserCode } from "@/lib/demo/synapse-data";

export function ReviewRoute() {
  const [userCode, setUserCode] = useState(defaultUserCode);
  const [showCompare, setShowCompare] = useState(false);
  const goTo = useSynapseNavigation();

  return (
    <AppShell active="review" goTo={goTo}>
      <ReviewScreen
        onCompare={() => setShowCompare(true)}
        setUserCode={setUserCode}
        showCompare={showCompare}
        userCode={userCode}
      />
    </AppShell>
  );
}
