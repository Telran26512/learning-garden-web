"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StudioScreen } from "@/features/studio/studio-screen";

export function StudioRoute() {
  const goTo = useSynapseNavigation();

  return (
    <AppShell active="studio" goTo={goTo}>
      <StudioScreen />
    </AppShell>
  );
}
