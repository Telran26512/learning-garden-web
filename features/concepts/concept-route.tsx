"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { ConceptScreen } from "@/features/concepts/concept-screen";

export function ConceptRoute() {
  const [showRunOutput, setShowRunOutput] = useState(false);
  const goTo = useSynapseNavigation();

  return (
    <AppShell active="concept" goTo={goTo}>
      <ConceptScreen
        goTo={goTo}
        onRun={() => setShowRunOutput(true)}
        showRunOutput={showRunOutput}
      />
    </AppShell>
  );
}
