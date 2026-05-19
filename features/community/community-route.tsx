"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { CommunityScreen } from "@/features/community/community-screen";

export function CommunityRoute() {
  const goTo = useSynapseNavigation();

  return (
    <AppShell active="community" goTo={goTo}>
      <CommunityScreen goTo={goTo} />
    </AppShell>
  );
}
