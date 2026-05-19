"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { WorkspaceScreen } from "@/features/workspace/workspace-screen";

export function WorkspaceRoute() {
  const goTo = useSynapseNavigation();

  return (
    <AppShell active="workspace" goTo={goTo}>
      <WorkspaceScreen goTo={goTo} />
    </AppShell>
  );
}
