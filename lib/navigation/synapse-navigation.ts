export type Screen =
  | "community"
  | "concept"
  | "graph"
  | "portfolio"
  | "review"
  | "social"
  | "studio"
  | "workspace";

export type NavScreen = Exclude<Screen, "concept">;

export type GoToScreen = (screen: Screen) => void;

export const screenRoutes = {
  community: "/community",
  concept: "/workspace/concepts/linear-regression",
  graph: "/graph",
  portfolio: "/portfolio",
  review: "/review",
  social: "/social",
  studio: "/studio",
  workspace: "/workspace",
} as const satisfies Record<Screen, `/${string}`>;

export const navItems: Array<{ label: string; screen: NavScreen }> = [
  { label: "Community", screen: "community" },
  { label: "Social", screen: "social" },
  { label: "Workspace", screen: "workspace" },
  { label: "Graph", screen: "graph" },
  { label: "Portfolio", screen: "portfolio" },
  { label: "Studio", screen: "studio" },
  { label: "Review", screen: "review" },
];
