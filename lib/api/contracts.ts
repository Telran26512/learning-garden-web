export type UserRole = "admin" | "user";

export type Visibility = "private" | "public" | "unlisted";

export type ConceptStatus = "archived" | "draft" | "published";

export type ConceptSectionKind = "code" | "math" | "note" | "paper";

export type ReviewAnswerRating = "again" | "good" | "hard";

export type RoadmapTaskStatus = "current" | "done" | "pending";

export type ReviewCardStatus = "answered" | "due";

export type PythonRunStatus = "failed" | "skipped" | "succeeded";

export type ApiErrorPayload = {
  code: string;
  details?: Record<string, unknown>;
  message: string;
};

export type User = {
  avatarUrl: string;
  createdAt: string;
  displayName: string;
  email: string;
  id: string;
  level: number;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
};

export type ConceptSection = {
  body: string;
  id: string;
  kind: ConceptSectionKind;
  language?: string;
  sourceMeta?: string;
  sourceTitle?: string;
  title: string;
};

export type Concept = {
  createdAt: string;
  id: string;
  mastery?: number;
  ownerId: string;
  sections: ConceptSection[];
  slug: string;
  status: ConceptStatus;
  summary: string;
  tags: string[];
  title: string;
  updatedAt: string;
  visibility: Visibility;
};

export type ListConceptsQuery = {
  owner?: "me";
  visibility?: Visibility;
};

export type CreateConceptInput = {
  sections?: ConceptSection[];
  summary: string;
  tags?: string[];
  title: string;
  visibility: Visibility;
};

export type UpdateConceptInput = Partial<{
  sections: ConceptSection[];
  status: ConceptStatus;
  summary: string;
  tags: string[];
  title: string;
  visibility: Visibility;
}>;

export type RoadmapTask = {
  conceptId: string;
  description: string;
  id: string;
  order: number;
  status: RoadmapTaskStatus;
  title: string;
  updatedAt: string;
};

export type UpdateRoadmapTaskInput = {
  status: RoadmapTaskStatus;
};

export type ReviewCard = {
  conceptId: string;
  dueAt: string;
  errorSummary: string;
  id: string;
  lastRating?: ReviewAnswerRating;
  prompt: string;
  referenceCode: string;
  status: ReviewCardStatus;
  userCode: string;
};

export type AnswerReviewCardInput = {
  rating: ReviewAnswerRating;
  userCode?: string;
};

export type AnswerReviewCardResponse = {
  card: ReviewCard;
  nextDueAt: string;
};

export type PythonRunRequest = {
  code: string;
  timeoutMs?: number;
};

export type PythonRunResponse = {
  durationMs: number;
  stderr: string;
  stdout: string;
  status: PythonRunStatus;
};

export type AdminOverview = {
  activeUserCount: number;
  apiBasePath: string;
  moderationPendingCount: number;
  publicConceptCount: number;
};

export type ModerationQueueItem = {
  ageLabel: string;
  createdAt: string;
  id: string;
  status: string;
  title: string;
  type: string;
};
