import type { FooterGroup } from "@/lib/types/synapse";

export const FOOTER_GROUPS = [
  ["Product", ["Tour", "Pricing", "Changelog", "Roadmap"]],
  ["Community", ["Explore", "Top Tracks", "Tags", "Discord"]],
  ["Resources", ["Docs", "API", "Blog"]],
  ["Company", ["About", "Privacy", "Terms", "Contact"]],
] as const satisfies readonly FooterGroup[];
