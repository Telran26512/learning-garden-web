"use client";

import { useRouter } from "next/navigation";
import { screenRoutes } from "@/lib/demo/synapse-types";
import type { Screen } from "@/lib/demo/synapse-types";

export function useSynapseNavigation() {
  const router = useRouter();

  return (screen: Screen) => {
    router.push(screenRoutes[screen]);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
}
