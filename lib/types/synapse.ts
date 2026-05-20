export type BlockKind = "math" | "code" | "paper" | "concept";

export type CommunityNodeKind = "Math" | "Code" | "Paper";

export type FeaturedCommunity = {
  handle: string;
  name: string;
  quote: string;
  meta: string;
  avatarColor: string;
};

export type CommunityTrackNode = {
  kind: CommunityNodeKind;
  title: string;
};

export type CommunityTrack = {
  handle: string;
  name: string;
  title: string;
  avatarColor: string;
  nodes: readonly CommunityTrackNode[];
};

export type WorkflowEvent = {
  time: string;
  label: string;
  title: string;
  kind: BlockKind;
  detail: string;
  meta: readonly string[];
};

export type PricingPlan = {
  name: string;
  price: string;
  sub: string;
  feats: readonly string[];
  cta: string;
  highlight?: boolean;
};

export type FAQItem = {
  question: string;
  answer: readonly string[];
};

export type FooterGroup = readonly [group: string, links: readonly string[]];

export type RoadmapTaskStatus = "done" | "active" | "todo";

export type RoadmapTask = {
  label: string;
  status: RoadmapTaskStatus;
};

export type RoadmapLesson = {
  week: string;
  title: string;
  done?: boolean;
  active?: boolean;
  tasks?: readonly RoadmapTask[];
};

export type RoadmapStage = {
  index: number;
  title: string;
  progress: number;
  status: "done" | "active" | "locked";
  lessons: readonly RoadmapLesson[];
};

export type TodayTask = {
  title: string;
  status: string;
  source: string;
};

export type WorkspaceNotification = {
  avatar: string;
  title: string;
  time: string;
};

export type GraphNode = {
  id: string;
  label: string;
  group: BlockKind;
  r?: number;
  meta?: string;
};

export type GraphLink = {
  source: string;
  target: string;
  type: string;
};

export type GraphLegendItem = readonly [name: string, color: string];

export type GraphSideListRow = readonly [
  left: string,
  right: string,
  time: string,
];

export type ProductMockupImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
