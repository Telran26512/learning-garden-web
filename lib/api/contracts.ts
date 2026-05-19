export type UserRole = "admin" | "user";

export type Visibility = "private" | "public" | "unlisted";

export type ConceptStatus = "archived" | "draft" | "published";

export type ConceptSectionKind = "code" | "math" | "note" | "paper";

export type ReviewAnswerRating = "again" | "easy" | "good" | "hard";

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

export type PublicAuthor = {
  avatarUrl: string;
  displayName: string;
  id: string;
  level: number;
};

export type ContentType = "concept" | "experiment" | "paper";

export type PublicContentItem = {
  author: PublicAuthor;
  commentCount: number;
  contentType: ContentType;
  createdAt: string;
  excerpt: string;
  id: string;
  ownerId: string;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
  visibility: "public";
};

export type PublicContentDetail = {
  createdAt: string;
  id: string;
  ownerId: string;
  sections: ConceptSection[];
  slug: string;
  status: ConceptStatus;
  summary: string;
  tags: string[];
  title: string;
  updatedAt: string;
  visibility: "public";
};

export type ListPublicContentQuery = {
  contentType?: ContentType | "all";
  ownerId?: string;
  tag?: string;
};

export type PublicProfile = {
  avatarUrl: string;
  bio: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  id: string;
  isFollowing: boolean;
  level: number;
  publicContentCount: number;
  stats: Array<{ label: string; value: string }>;
};

export type CommentTargetType = "content" | "discussion";

export type Comment = {
  author: PublicAuthor;
  body: string;
  createdAt: string;
  id: string;
  parentId?: string;
  targetId: string;
  targetType: CommentTargetType;
  updatedAt: string;
};

export type CreateCommentInput = {
  body: string;
  parentId?: string;
  targetId: string;
  targetType: CommentTargetType;
};

export type DiscussionStatus = "closed" | "open";

export type Discussion = {
  author: PublicAuthor;
  body: string;
  createdAt: string;
  id: string;
  replyCount: number;
  replies: Comment[];
  status: DiscussionStatus;
  title: string;
  updatedAt: string;
};

export type CreateDiscussionInput = {
  body: string;
  title: string;
};

export type ActivityFeedItem = {
  actor: PublicAuthor;
  createdAt: string;
  id: string;
  summary: string;
  target: { id: string; label: string; type: "content" | "discussion" | "profile" };
  type: "commented" | "followed" | "published_content" | "reviewed";
};

export type NotificationType = "comment" | "follow" | "moderation" | "reply";

export type NotificationItem = {
  body: string;
  createdAt: string;
  id: string;
  readAt: string | null;
  target?: { id: string; label: string; type: "content" | "discussion" | "profile" };
  title: string;
  type: NotificationType;
};

export type GraphNodeStatus = "active" | "locked" | "mastered" | "next";

export type GraphNode = {
  id: string;
  label: string;
  relatedContentId?: string;
  status: GraphNodeStatus;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  id: string;
  label: string;
  to: string;
};

export type KnowledgeGraph = {
  edges: GraphEdge[];
  nodes: GraphNode[];
};

export type Backlink = {
  id: string;
  sourceId: string;
  sourceTitle: string;
  targetId: string;
  type: "depends_on" | "extends" | "references";
};

export type Portfolio = {
  evidence: Array<{
    description: string;
    id: string;
    title: string;
    type: "concept_chain" | "project" | "writing";
  }>;
  highlights: Array<{ label: string; value: string }>;
  owner: PublicAuthor;
  updatedAt: string;
};

export type ModerationTarget = {
  id: string;
  label: string;
  type: "comment" | "content" | "discussion" | "user";
};

export type ModerationReportStatus = "dismissed" | "escalated" | "open" | "resolved";

export type ModerationReport = {
  createdAt: string;
  id: string;
  reason: string;
  reporter: PublicAuthor;
  status: ModerationReportStatus;
  target: ModerationTarget;
};

export type ResolveReportInput = {
  reason: string;
  status: Exclude<ModerationReportStatus, "open">;
};

export type ModerateContentInput = {
  action: "hide" | "restore" | "review";
  reason: string;
};

export type RestrictUserInput = {
  reason: string;
  restricted: boolean;
};

export type RegistrationSettings = {
  inviteOnly: boolean;
  openRegistration: boolean;
  updatedAt: string;
};

export type UpdateRegistrationInput = {
  inviteOnly: boolean;
  openRegistration: boolean;
};

export type AdminAction = {
  action: string;
  actorId: string;
  createdAt: string;
  id: string;
  reason: string;
  target: ModerationTarget;
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
  ease: number;
  errorSummary: string;
  id: string;
  intervalDays: number;
  lastRating?: ReviewAnswerRating;
  lastReviewedAt: string | null;
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
