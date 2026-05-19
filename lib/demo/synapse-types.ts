export type Screen = "community" | "workspace" | "studio" | "concept" | "review";

export type NavScreen = Exclude<Screen, "concept">;

export type GoToScreen = (screen: Screen) => void;

export const screenRoutes = {
  community: "/community",
  concept: "/workspace/concepts/linear-regression",
  review: "/review",
  studio: "/studio",
  workspace: "/workspace",
} as const satisfies Record<Screen, `/${string}`>;
