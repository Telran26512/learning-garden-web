export type Screen =
  | "community"
  | "concept"
  | "graph"
  | "portfolio"
  | "review"
  | "studio"
  | "workspace";

export type NavScreen = Exclude<Screen, "concept" | "graph" | "portfolio">;

export type GoToScreen = (screen: Screen) => void;

export const screenRoutes = {
  community: "/community",
  concept: "/workspace/concepts/linear-regression",
  graph: "/graph",
  portfolio: "/portfolio",
  review: "/review",
  studio: "/studio",
  workspace: "/workspace",
} as const satisfies Record<Screen, `/${string}`>;

export const navItems: Array<{ label: string; screen: NavScreen }> = [
  { label: "Community", screen: "community" },
  { label: "Workspace", screen: "workspace" },
  { label: "Studio", screen: "studio" },
  { label: "Review", screen: "review" },
];
