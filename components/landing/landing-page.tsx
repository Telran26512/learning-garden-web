"use client";

import { useScrollReveal } from "@/lib/hooks/use-scroll-reveal";
import { LandingCommunity } from "./sections/community";
import { LandingFAQ } from "./sections/faq";
import { LandingFinalCTA } from "./sections/final-cta";
import { LandingFooter } from "./sections/footer";
import { LandingGraphDemo } from "./sections/graph-demo";
import { LandingHero } from "./sections/hero";
import { LandingNav } from "./sections/nav";
import { LandingPainSolution } from "./sections/pain-solution";
import { LandingPricing } from "./sections/pricing";
import { LandingThreeLayers } from "./sections/three-layers";
import { LandingWorkflow } from "./sections/workflow";

export function LandingPage() {
  useScrollReveal();

  return (
    <main className="sn-page">
      <LandingNav />
      <LandingHero />
      <LandingPainSolution />
      <LandingThreeLayers />
      <LandingGraphDemo />
      <LandingCommunity />
      <LandingWorkflow />
      <LandingPricing />
      <LandingFAQ />
      <LandingFinalCTA />
      <LandingFooter />
    </main>
  );
}
