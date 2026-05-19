# M2-M6 Mock-First Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved M2-M6 mock-first frontend for public browsing, review scheduling, social activity, graph/portfolio views, and admin governance.

**Architecture:** Keep the existing route -> feature screen -> `lib/api/modules/*` -> transport -> mock repository flow. Add milestone-specific DTOs, API modules, routes, and feature screens while preserving future HTTP transport compatibility. All new interactions mutate only in-memory mock repository state.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4, Vitest, OpenAPI 3.1 YAML, in-process mock transport.

---

## File Structure

Create these route files:

- `app/(community)/community/concepts/[slug]/page.tsx`: renders public content detail by slug.
- `app/(community)/users/[id]/page.tsx`: renders public user profile.
- `app/(social)/social/page.tsx`: renders social feed, discussions, notifications.
- `app/(workspace)/graph/page.tsx`: renders lightweight relation graph.
- `app/(workspace)/portfolio/page.tsx`: renders portfolio aggregation.

Create these feature files:

- `features/community/public-content-detail-route.tsx`: loads public content, comments, and backlinks.
- `features/community/public-content-detail-screen.tsx`: renders public detail and comment actions.
- `features/community/user-profile-route.tsx`: loads profile and follow state.
- `features/community/user-profile-screen.tsx`: renders profile, public content, and follow/unfollow.
- `features/social/social-route.tsx`: loads feed, discussions, notifications.
- `features/social/social-screen.tsx`: renders M4 social workspace and actions.
- `features/graph/graph-route.tsx`: loads graph and selected-node data.
- `features/graph/graph-screen.tsx`: renders SVG/CSS graph and node details.
- `features/portfolio/portfolio-route.tsx`: loads portfolio data.
- `features/portfolio/portfolio-screen.tsx`: renders portfolio evidence.

Modify these feature files:

- `features/community/community-route.tsx`: load public content through `contentApi.listPublicContent()`.
- `features/community/community-screen.tsx`: add filters and public navigation links.
- `features/review/review-route.tsx`: wire rating actions to `learningApi.answerReviewCard()`.
- `features/review/review-screen.tsx`: render due groups, reveal state, and next-due feedback.
- `features/admin/admin-screen.tsx`: load moderation data and execute M6 actions.

Modify these API files:

- `lib/api/contracts.ts`: add M2-M6 DTOs and inputs.
- `lib/api/index.ts`: export new modules and types.
- `lib/api/modules/content.ts`: add public content/profile methods.
- `lib/api/modules/learning.ts`: use expanded review DTOs.
- `lib/api/modules/admin.ts`: preserve overview compatibility and re-export admin-facing reads.
- `lib/api/modules/social.ts`: create social facade.
- `lib/api/modules/relation.ts`: create graph/backlink facade.
- `lib/api/modules/portfolio.ts`: create portfolio facade.
- `lib/api/modules/moderation.ts`: create M6 mutation facade.
- `lib/api/mock/fixtures.ts`: add seed data for M2-M6.
- `lib/api/mock/repository.ts`: add in-memory state and mutation methods.
- `lib/api/mock/transport.ts`: route M2-M6 paths.
- `docs/api/openapi.yaml`: add paths and schemas.

Modify navigation:

- `lib/navigation/synapse-navigation.ts`: add `social`, `graph`, and `portfolio` screens and routes.
- `components/layout/top-nav.tsx`: render new nav items from `navItems`; no separate hard-coded logic.
- `components/layout/app-shell.tsx`: continue accepting `active: Screen`.

Create/modify tests:

- `tests/lib/api/milestone-m2-m6-contracts.test.ts`: DTO shape and fixture compatibility.
- `tests/lib/api/m2-m6-mock-flows.test.ts`: mock mutation flows.
- `tests/lib/api/modules.test.ts`: new facade coverage.
- `tests/lib/api/openapi-contract.test.ts`: M2-M6 path/schema coverage.
- `tests/lib/api/feature-migration.test.ts`: block direct fixture imports from features.

---

### Task 1: M2-M6 Contracts And OpenAPI Paths

**Files:**

- Modify: `lib/api/contracts.ts`
- Modify: `docs/api/openapi.yaml`
- Create: `tests/lib/api/milestone-m2-m6-contracts.test.ts`
- Modify: `tests/lib/api/openapi-contract.test.ts`

- [ ] **Step 1: Write failing contract tests**

Create `tests/lib/api/milestone-m2-m6-contracts.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type {
  ActivityFeedItem,
  AdminAction,
  Backlink,
  Comment,
  Discussion,
  GraphEdge,
  GraphNode,
  ModerationReport,
  NotificationItem,
  Portfolio,
  PublicContentItem,
  PublicProfile,
  RegistrationSettings,
  ReviewCard,
} from "@/lib/api";

describe("M2-M6 contract DTOs", () => {
  it("models public content and profile data", () => {
    const content: PublicContentItem = {
      author: { avatarUrl: "/avatar.jpg", displayName: "Raymond", id: "user_raymond", level: 6 },
      commentCount: 3,
      contentType: "concept",
      createdAt: "2026-05-19T00:00:00.000Z",
      excerpt: "正规方程的推导与实现。",
      id: "content_linear_regression_public",
      ownerId: "user_raymond",
      slug: "linear-regression-ols",
      tags: ["线性回归"],
      title: "线性回归公开题解",
      updatedAt: "2026-05-19T00:00:00.000Z",
      visibility: "public",
    };
    const profile: PublicProfile = {
      avatarUrl: "/avatar.jpg",
      bio: "构建机器学习知识网络。",
      displayName: "Raymond",
      followerCount: 128,
      followingCount: 16,
      id: "user_raymond",
      isFollowing: false,
      level: 6,
      publicContentCount: 8,
      stats: [{ label: "概念", value: "28" }],
    };

    expect(content.visibility).toBe("public");
    expect(profile.stats[0]?.label).toBe("概念");
  });

  it("models social, graph, portfolio, and moderation data", () => {
    const comment: Comment = {
      author: { avatarUrl: "/avatar.jpg", displayName: "Raymond", id: "user_raymond", level: 6 },
      body: "这里的偏置列解释清楚了。",
      createdAt: "2026-05-19T00:00:00.000Z",
      id: "comment_1",
      targetId: "content_linear_regression_public",
      targetType: "content",
      updatedAt: "2026-05-19T00:00:00.000Z",
    };
    const discussion: Discussion = {
      author: comment.author,
      body: "正规方程和梯度下降应该先学哪个？",
      createdAt: "2026-05-19T00:00:00.000Z",
      id: "discussion_ols_vs_gd",
      replyCount: 2,
      replies: [],
      status: "open",
      title: "正规方程和梯度下降的学习顺序",
      updatedAt: "2026-05-19T00:00:00.000Z",
    };
    const notification: NotificationItem = {
      body: "有人回复了你的线性回归题解。",
      createdAt: "2026-05-19T00:00:00.000Z",
      id: "notification_reply",
      readAt: null,
      title: "新的回复",
      type: "reply",
    };
    const activity: ActivityFeedItem = {
      actor: comment.author,
      createdAt: "2026-05-19T00:00:00.000Z",
      id: "activity_1",
      summary: "发布了线性回归公开题解",
      target: { id: "content_linear_regression_public", label: "线性回归公开题解", type: "content" },
      type: "published_content",
    };
    const node: GraphNode = {
      id: "node_linear_regression",
      label: "线性回归",
      status: "mastered",
      x: 280,
      y: 110,
    };
    const edge: GraphEdge = {
      from: "node_least_squares",
      id: "edge_ols_linreg",
      label: "supports",
      to: "node_linear_regression",
    };
    const backlink: Backlink = {
      id: "backlink_1",
      sourceId: "content_gradient_descent",
      sourceTitle: "梯度下降实现",
      targetId: "content_linear_regression_public",
      type: "depends_on",
    };
    const portfolio: Portfolio = {
      evidence: [{ description: "从公式到 NumPy 实现。", id: "evidence_ols", title: "线性回归实现", type: "project" }],
      highlights: [{ label: "公开内容", value: "8" }],
      owner: comment.author,
      updatedAt: "2026-05-19T00:00:00.000Z",
    };
    const report: ModerationReport = {
      createdAt: "2026-05-19T00:00:00.000Z",
      id: "report_1",
      reason: "公式截图缺少来源。",
      reporter: comment.author,
      status: "open",
      target: { id: "content_linear_regression_public", label: "线性回归公开题解", type: "content" },
    };
    const settings: RegistrationSettings = {
      inviteOnly: true,
      openRegistration: false,
      updatedAt: "2026-05-19T00:00:00.000Z",
    };
    const action: AdminAction = {
      action: "resolve_report",
      actorId: "user_raymond",
      createdAt: "2026-05-19T00:00:00.000Z",
      id: "admin_action_1",
      reason: "已要求补充来源。",
      target: report.target,
    };
    const card: ReviewCard = {
      conceptId: "concept_linear_regression",
      dueAt: "2026-05-19T00:00:00.000Z",
      ease: 2.5,
      errorSummary: "漏掉偏置列。",
      id: "review_bias_column",
      intervalDays: 1,
      lastReviewedAt: null,
      prompt: "实现带偏置项的正规方程。",
      referenceCode: "return w",
      status: "due",
      userCode: "return wrong",
    };

    expect(comment.targetType).toBe("content");
    expect(discussion.status).toBe("open");
    expect(notification.readAt).toBeNull();
    expect(activity.target.type).toBe("content");
    expect(node.status).toBe("mastered");
    expect(edge.from).toBe("node_least_squares");
    expect(backlink.type).toBe("depends_on");
    expect(portfolio.evidence[0]?.type).toBe("project");
    expect(report.status).toBe("open");
    expect(settings.inviteOnly).toBe(true);
    expect(action.action).toBe("resolve_report");
    expect(card.intervalDays).toBe(1);
  });
});
```

Modify `tests/lib/api/openapi-contract.test.ts` by adding:

```ts
  it("declares the M2-M6 API paths needed by the mock-first frontend", () => {
    for (const path of [
      "/content/public:",
      "/content/public/{slug}:",
      "/users/{id}/public-profile:",
      "/social/feed:",
      "/social/discussions:",
      "/social/discussions/{id}/replies:",
      "/social/notifications:",
      "/social/notifications/{id}:",
      "/social/follows:",
      "/social/follows/{userId}:",
      "/comments:",
      "/comments/{id}:",
      "/relations/graph:",
      "/relations/backlinks:",
      "/portfolio/{userId}:",
      "/admin/reports:",
      "/admin/reports/{id}/resolve:",
      "/admin/content/{id}/moderate:",
      "/admin/comments/{id}/moderate:",
      "/admin/users/{id}/restrict:",
      "/admin/registration:",
      "/admin/actions:",
    ]) {
      expect(openApi).toContain(path);
    }
  });
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm test:run tests/lib/api/milestone-m2-m6-contracts.test.ts tests/lib/api/openapi-contract.test.ts
```

Expected: FAIL because new contract types and OpenAPI paths are not declared.

- [ ] **Step 3: Add TypeScript contracts**

Modify `lib/api/contracts.ts`. Add these types after the existing `User` type and extend the existing review/card types as shown:

```ts
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
```

Update existing aliases:

```ts
export type ReviewAnswerRating = "again" | "easy" | "good" | "hard";
```

Update `ReviewCard`:

```ts
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
```

- [ ] **Step 4: Add OpenAPI path and schema declarations**

Modify `docs/api/openapi.yaml` so each path from the test exists with a basic operation and response schema. Use the existing file style. Add schemas for every DTO named in the contract test: `PublicAuthor`, `PublicContentItem`, `PublicProfile`, `Comment`, `Discussion`, `ActivityFeedItem`, `NotificationItem`, `GraphNode`, `GraphEdge`, `KnowledgeGraph`, `Backlink`, `Portfolio`, `ModerationReport`, `RegistrationSettings`, and `AdminAction`.

- [ ] **Step 5: Run tests to verify GREEN**

Run:

```bash
pnpm test:run tests/lib/api/milestone-m2-m6-contracts.test.ts tests/lib/api/openapi-contract.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/api/contracts.ts docs/api/openapi.yaml tests/lib/api/milestone-m2-m6-contracts.test.ts tests/lib/api/openapi-contract.test.ts
git commit -m "feat(web): add m2 m6 api contracts"
```

---

### Task 2: M2 Public Content API And Routes

**Files:**

- Modify: `lib/api/modules/content.ts`
- Modify: `lib/api/mock/fixtures.ts`
- Modify: `lib/api/mock/repository.ts`
- Modify: `lib/api/mock/transport.ts`
- Modify: `lib/api/index.ts`
- Modify: `features/community/community-route.tsx`
- Modify: `features/community/community-screen.tsx`
- Create: `features/community/public-content-detail-route.tsx`
- Create: `features/community/public-content-detail-screen.tsx`
- Create: `features/community/user-profile-route.tsx`
- Create: `features/community/user-profile-screen.tsx`
- Create: `app/(community)/community/concepts/[slug]/page.tsx`
- Create: `app/(community)/users/[id]/page.tsx`
- Modify: `tests/lib/api/modules.test.ts`
- Create: `tests/lib/api/m2-m6-mock-flows.test.ts`

- [ ] **Step 1: Write failing API tests**

Create `tests/lib/api/m2-m6-mock-flows.test.ts` with the M2 tests first:

```ts
import { describe, expect, it } from "vitest";
import { contentApi, setApiTransportForTests } from "@/lib/api";
import { createMockApiRepository } from "@/lib/api/mock/repository";
import { createMockTransport } from "@/lib/api/mock/transport";

function useFreshMockTransport() {
  setApiTransportForTests(createMockTransport(createMockApiRepository()));
}

describe("M2 public content mock flows", () => {
  it("lists public content and filters by tag", async () => {
    useFreshMockTransport();

    const all = await contentApi.listPublicContent();
    const filtered = await contentApi.listPublicContent({ tag: "线性回归" });

    expect(all).toEqual(expect.arrayContaining([expect.objectContaining({ visibility: "public" })]));
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.tags.includes("线性回归"))).toBe(true);
  });

  it("loads public content detail and public profile", async () => {
    useFreshMockTransport();

    const detail = await contentApi.getPublicContent("linear-regression-ols");
    const profile = await contentApi.getPublicProfile("user_raymond");

    expect(detail.slug).toBe("linear-regression-ols");
    expect(profile).toMatchObject({ id: "user_raymond", displayName: "Raymond" });
  });
});
```

Modify `tests/lib/api/modules.test.ts`:

```ts
    await expect(contentApi.listPublicContent({ tag: "线性回归" })).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "linear-regression-ols" })]),
    );
    await expect(contentApi.getPublicProfile("user_raymond")).resolves.toMatchObject({
      publicContentCount: expect.any(Number),
    });
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
```

Expected: FAIL because `contentApi.listPublicContent`, `contentApi.getPublicContent`, and `contentApi.getPublicProfile` do not exist.

- [ ] **Step 3: Add public content fixtures**

Modify `lib/api/mock/fixtures.ts`. Add `PublicContentItem` and `PublicProfile` to the import list. Change the first `mockConcepts` concept visibility to `public`, then add:

```ts
export const mockPublicAuthors = {
  raymond: {
    avatarUrl: "/avatar.jpg",
    displayName: "Raymond",
    id: "user_raymond",
    level: 6,
  },
  ada: {
    avatarUrl: "/avatar.jpg",
    displayName: "Ada",
    id: "user_ada",
    level: 4,
  },
} as const;

export const mockPublicContent: PublicContentItem[] = [
  {
    author: mockPublicAuthors.raymond,
    commentCount: 3,
    contentType: "concept",
    createdAt: "2026-05-19T00:00:00.000Z",
    excerpt: "从正规方程推到 NumPy 实现,重点解释偏置列和矩阵维度。",
    id: "concept_linear_regression",
    ownerId: "user_raymond",
    slug: "linear-regression-ols",
    tags: ["线性回归", "最小二乘", "统计学习"],
    title: "线性回归: 最小二乘推导与实现",
    updatedAt: "2026-05-19T00:00:00.000Z",
    visibility: "public",
  },
  {
    author: mockPublicAuthors.ada,
    commentCount: 1,
    contentType: "paper",
    createdAt: "2026-05-18T00:00:00.000Z",
    excerpt: "把 softmax 和交叉熵合并推导,避免数值溢出。",
    id: "content_cross_entropy_public",
    ownerId: "user_ada",
    slug: "cross-entropy-stability",
    tags: ["交叉熵", "梯度", "数值稳定"],
    title: "Softmax + 交叉熵的稳定实现",
    updatedAt: "2026-05-18T00:00:00.000Z",
    visibility: "public",
  },
  {
    author: mockPublicAuthors.raymond,
    commentCount: 0,
    contentType: "experiment",
    createdAt: "2026-05-17T00:00:00.000Z",
    excerpt: "比较正规方程和梯度下降在不同条件数下的表现。",
    id: "content_ols_gd_experiment",
    ownerId: "user_raymond",
    slug: "ols-vs-gradient-descent",
    tags: ["实验", "梯度下降", "线性回归"],
    title: "正规方程 vs 梯度下降实验",
    updatedAt: "2026-05-17T00:00:00.000Z",
    visibility: "public",
  },
];

export const mockPublicProfiles: PublicProfile[] = [
  {
    avatarUrl: "/avatar.jpg",
    bio: "用数学推导、可运行代码和论文阅读构建机器学习知识网络。",
    displayName: "Raymond",
    followerCount: 128,
    followingCount: 16,
    id: "user_raymond",
    isFollowing: false,
    level: 6,
    publicContentCount: 8,
    stats: [
      { label: "概念", value: "28" },
      { label: "实验", value: "16" },
      { label: "公开内容", value: "8" },
    ],
  },
  {
    avatarUrl: "/avatar.jpg",
    bio: "专注优化、数值稳定和论文复现。",
    displayName: "Ada",
    followerCount: 42,
    followingCount: 11,
    id: "user_ada",
    isFollowing: false,
    level: 4,
    publicContentCount: 5,
    stats: [
      { label: "论文", value: "9" },
      { label: "实验", value: "7" },
      { label: "评论", value: "31" },
    ],
  },
];
```

- [ ] **Step 4: Implement public content repository and transport**

Modify `lib/api/mock/repository.ts` imports to include `ListPublicContentQuery`, `mockPublicContent`, and `mockPublicProfiles`. Inside `createMockApiRepository()`, add:

```ts
  let publicContent = clone(mockPublicContent);
  let publicProfiles = clone(mockPublicProfiles);
```

Add methods to the returned object:

```ts
    getPublicContent(slug: string) {
      const item = publicContent.find((content) => content.slug === slug);

      if (!item) {
        throw createApiDomainError(404, "not_found", "Public content not found");
      }

      const concept = concepts.find((candidate) => candidate.slug === slug);
      if (concept) {
        return cloneOne({ ...concept, visibility: "public" as const });
      }

      return cloneOne({
        createdAt: item.createdAt,
        id: item.id,
        ownerId: item.ownerId,
        sections: [],
        slug: item.slug,
        status: "published" as const,
        summary: item.excerpt,
        tags: item.tags,
        title: item.title,
        updatedAt: item.updatedAt,
        visibility: "public" as const,
      });
    },
    getPublicProfile(id: string) {
      const profile = publicProfiles.find((item) => item.id === id);

      if (!profile) {
        throw createApiDomainError(404, "not_found", "Public profile not found");
      }

      return cloneOne(profile);
    },
    listPublicContent(query: ListPublicContentQuery = {}) {
      return clone(
        publicContent.filter((item) => {
          if (query.contentType && query.contentType !== "all" && item.contentType !== query.contentType) {
            return false;
          }
          if (query.ownerId && item.ownerId !== query.ownerId) {
            return false;
          }
          if (query.tag && !item.tags.includes(query.tag)) {
            return false;
          }
          return true;
        }),
      );
    },
```

Modify `lib/api/mock/transport.ts`:

```ts
  if (method === "GET" && pathname === "/content/public") {
    const [, queryString = ""] = path.split("?");
    const search = new URLSearchParams(queryString);
    return repository.listPublicContent({
      contentType: (search.get("contentType") ?? undefined) as never,
      ownerId: search.get("ownerId") ?? undefined,
      tag: search.get("tag") ?? undefined,
    });
  }

  const publicContentMatch = pathname?.match(/^\/content\/public\/([^/]+)$/);
  if (publicContentMatch && method === "GET") {
    return repository.getPublicContent(decodeURIComponent(publicContentMatch[1]!));
  }

  const publicProfileMatch = pathname?.match(/^\/users\/([^/]+)\/public-profile$/);
  if (publicProfileMatch && method === "GET") {
    return repository.getPublicProfile(decodeURIComponent(publicProfileMatch[1]!));
  }
```

- [ ] **Step 5: Implement content API methods**

Modify `lib/api/modules/content.ts` imports and object:

```ts
import type {
  Concept,
  CreateConceptInput,
  ListConceptsQuery,
  ListPublicContentQuery,
  PublicContentItem,
  PublicProfile,
  UpdateConceptInput,
} from "@/lib/api/contracts";
```

Add:

```ts
  getPublicContent(slug: string) {
    return getApiTransport().request<Concept>("GET", `/content/public/${encodeURIComponent(slug)}`);
  },
  getPublicProfile(id: string) {
    return getApiTransport().request<PublicProfile>(
      "GET",
      `/users/${encodeURIComponent(id)}/public-profile`,
    );
  },
  listPublicContent(query: ListPublicContentQuery = {}) {
    const search = new URLSearchParams();
    if (query.contentType && query.contentType !== "all") search.set("contentType", query.contentType);
    if (query.ownerId) search.set("ownerId", query.ownerId);
    if (query.tag) search.set("tag", query.tag);
    const suffix = search.size > 0 ? `?${search.toString()}` : "";

    return getApiTransport().request<PublicContentItem[]>("GET", `/content/public${suffix}`);
  },
```

- [ ] **Step 6: Run API tests to verify GREEN**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
```

Expected: PASS for the M2 test cases.

- [ ] **Step 7: Implement M2 routes and screens**

Create `app/(community)/community/concepts/[slug]/page.tsx`:

```tsx
import { PublicContentDetailRoute } from "@/features/community/public-content-detail-route";

export default async function PublicContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicContentDetailRoute slug={slug} />;
}
```

Create `app/(community)/users/[id]/page.tsx`:

```tsx
import { UserProfileRoute } from "@/features/community/user-profile-route";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserProfileRoute id={id} />;
}
```

Implement route components as client components that load through `contentApi`, show `StateSurface` while loading/errors, and pass data into screen components. Use `AppShell active="community"` for both.

Update `features/community/community-route.tsx` to use `contentApi.listPublicContent()` instead of `contentApi.listConcepts()`.

Update `features/community/community-screen.tsx` props to:

```ts
export function CommunityScreen({
  content,
  goTo,
}: {
  content: PublicContentItem[];
  goTo: GoToScreen;
}) {
```

Render title links with:

```tsx
<Link href={`/community/concepts/${item.slug}`}>{item.title}</Link>
```

Render author links with:

```tsx
<Link href={`/users/${item.author.id}`}>{item.author.displayName}</Link>
```

- [ ] **Step 8: Run route build check**

Run:

```bash
pnpm build
```

Expected: PASS and route list includes `/community/concepts/[slug]` and `/users/[id]`.

- [ ] **Step 9: Commit**

```bash
git add app features/community lib/api/modules/content.ts lib/api/mock/fixtures.ts lib/api/mock/repository.ts lib/api/mock/transport.ts tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
git commit -m "feat(web): add m2 public content mock flows"
```

---

### Task 3: M3 Review Scheduling Flow

**Files:**

- Modify: `lib/api/mock/fixtures.ts`
- Modify: `lib/api/mock/repository.ts`
- Modify: `features/review/review-route.tsx`
- Modify: `features/review/review-screen.tsx`
- Modify: `tests/lib/api/m2-m6-mock-flows.test.ts`

- [ ] **Step 1: Add failing review scheduling test**

Append to `tests/lib/api/m2-m6-mock-flows.test.ts`:

```ts
import { learningApi } from "@/lib/api";

describe("M3 review scheduling mock flows", () => {
  it("answers a review card and updates scheduling fields", async () => {
    useFreshMockTransport();

    const [before] = await learningApi.getReviewQueue();
    const result = await learningApi.answerReviewCard(before!.id, {
      rating: "easy",
      userCode: "def linear_regression(X, y): return X",
    });
    const [after] = await learningApi.getReviewQueue();

    expect(result.card.status).toBe("answered");
    expect(result.card.lastRating).toBe("easy");
    expect(result.card.intervalDays).toBeGreaterThan(before!.intervalDays);
    expect(result.nextDueAt).toBe(result.card.dueAt);
    expect(after!.lastReviewedAt).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify RED**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts
```

Expected: FAIL because current review card fixtures and scheduling logic do not include `easy`, `intervalDays`, `ease`, or `lastReviewedAt`.

- [ ] **Step 3: Update review fixtures**

Modify each `mockReviewCards` object in `lib/api/mock/fixtures.ts` so it includes:

```ts
    ease: 2.5,
    intervalDays: 1,
    lastReviewedAt: null,
```

Add at least two more cards:

```ts
  {
    conceptId: "concept_cross_entropy_gradient",
    dueAt: "2026-05-19T00:00:00.000Z",
    ease: 2.35,
    errorSummary: "把 softmax 和 cross entropy 分开求导,遗漏了 p - y 的化简。",
    id: "review_cross_entropy_gradient",
    intervalDays: 3,
    lastReviewedAt: null,
    prompt: "写出 softmax + cross entropy 对 logits 的梯度。",
    referenceCode: "grad = probs - y_one_hot",
    status: "due",
    userCode: "grad = probs * (1 - probs)",
  },
  {
    conceptId: "concept_linear_regression",
    dueAt: "2026-05-21T00:00:00.000Z",
    ease: 2.2,
    errorSummary: "R2 的解释混淆了残差平方和和总平方和。",
    id: "review_r2_interpretation",
    intervalDays: 5,
    lastReviewedAt: "2026-05-16T00:00:00.000Z",
    prompt: "解释 R2 = 1 - RSS/TSS 的含义。",
    referenceCode: "R2 measures variance explained relative to predicting the mean.",
    status: "due",
    userCode: "R2 is model accuracy.",
  },
```

- [ ] **Step 4: Implement scheduling logic**

Modify `answerReviewCard()` in `lib/api/mock/repository.ts`:

```ts
      const now = new Date().toISOString();
      const nextInterval = getNextIntervalDays(card.intervalDays, input.rating);
      card.status = "answered";
      card.lastRating = input.rating;
      card.lastReviewedAt = now;
      card.intervalDays = nextInterval;
      card.ease = getNextEase(card.ease, input.rating);
      card.dueAt = addDaysIso(now, nextInterval);
      if (input.userCode) {
        card.userCode = input.userCode;
      }

      return {
        card: { ...card },
        nextDueAt: card.dueAt,
      };
```

Add helpers near the bottom:

```ts
function getNextIntervalDays(current: number, rating: string) {
  if (rating === "again" || rating === "hard") {
    return 1;
  }
  if (rating === "easy") {
    return Math.max(7, current * 2);
  }
  return Math.max(3, current + 2);
}

function getNextEase(current: number, rating: string) {
  if (rating === "again" || rating === "hard") {
    return Math.max(1.3, Number((current - 0.2).toFixed(2)));
  }
  if (rating === "easy") {
    return Number((current + 0.15).toFixed(2));
  }
  return current;
}

function addDaysIso(value: string, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
```

- [ ] **Step 5: Run API test to verify GREEN**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts
```

Expected: PASS for M2 and M3 flow tests.

- [ ] **Step 6: Wire review UI**

Modify `features/review/review-route.tsx` so `compare` accepts a rating:

```ts
  const answer = async (rating: ReviewAnswerRating) => {
    const card = cards[0];
    if (!card) {
      return;
    }

    const result = await learningApi.answerReviewCard(card.id, { rating, userCode });
    setCards((current) => current.map((item) => (item.id === result.card.id ? result.card : item)));
    setShowCompare(true);
  };
```

Pass `onAnswer={answer}` to `ReviewScreen`.

Modify `features/review/review-screen.tsx` props:

```ts
  onAnswer: (rating: ReviewAnswerRating) => void;
```

Change the three rating buttons to call:

```tsx
onClick={() => onAnswer("again")}
onClick={() => onAnswer("good")}
onClick={() => onAnswer("easy")}
```

Render `currentCard.dueAt`, `currentCard.intervalDays`, `currentCard.ease`, and `currentCard.lastReviewedAt ?? "尚未复习"` in the sidebar.

- [ ] **Step 7: Run build**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add features/review lib/api/mock/fixtures.ts lib/api/mock/repository.ts tests/lib/api/m2-m6-mock-flows.test.ts
git commit -m "feat(web): add m3 review scheduling mock flow"
```

---

### Task 4: M4 Social API, Comments, Discussions, Notifications

**Files:**

- Create: `lib/api/modules/social.ts`
- Modify: `lib/api/index.ts`
- Modify: `lib/api/mock/fixtures.ts`
- Modify: `lib/api/mock/repository.ts`
- Modify: `lib/api/mock/transport.ts`
- Create: `app/(social)/social/page.tsx`
- Create: `features/social/social-route.tsx`
- Create: `features/social/social-screen.tsx`
- Modify: `features/community/public-content-detail-route.tsx`
- Modify: `features/community/public-content-detail-screen.tsx`
- Modify: `features/community/user-profile-route.tsx`
- Modify: `features/community/user-profile-screen.tsx`
- Modify: `tests/lib/api/m2-m6-mock-flows.test.ts`
- Modify: `tests/lib/api/modules.test.ts`

- [ ] **Step 1: Add failing social flow tests**

Append to `tests/lib/api/m2-m6-mock-flows.test.ts`:

```ts
import { socialApi } from "@/lib/api";

describe("M4 social mock flows", () => {
  it("creates and deletes a comment", async () => {
    useFreshMockTransport();

    const created = await socialApi.createComment({
      body: "偏置列这段解释有用。",
      targetId: "concept_linear_regression",
      targetType: "content",
    });
    const comments = await socialApi.getComments({ targetId: "concept_linear_regression", targetType: "content" });

    expect(comments).toEqual(expect.arrayContaining([expect.objectContaining({ id: created.id })]));

    await socialApi.deleteComment(created.id);
    const afterDelete = await socialApi.getComments({ targetId: "concept_linear_regression", targetType: "content" });

    expect(afterDelete.some((item) => item.id === created.id)).toBe(false);
  });

  it("follows a user and marks notification as read", async () => {
    useFreshMockTransport();

    const followed = await socialApi.followUser("user_ada");
    const notifications = await socialApi.getNotifications();
    const unread = notifications.find((item) => item.readAt === null);

    expect(followed.isFollowing).toBe(true);
    expect(unread).toBeDefined();

    const read = await socialApi.markNotificationRead(unread!.id);

    expect(read.readAt).not.toBeNull();
  });

  it("creates a discussion and reply", async () => {
    useFreshMockTransport();

    const discussion = await socialApi.createDiscussion({
      body: "想比较正规方程和梯度下降的学习顺序。",
      title: "正规方程应该在梯度下降前学吗？",
    });
    const reply = await socialApi.replyToDiscussion(discussion.id, {
      body: "先学正规方程能更好理解闭式解。",
      targetId: discussion.id,
      targetType: "discussion",
    });
    const discussions = await socialApi.getDiscussions();

    expect(reply.targetId).toBe(discussion.id);
    expect(discussions).toEqual(expect.arrayContaining([expect.objectContaining({ id: discussion.id })]));
  });
});
```

- [ ] **Step 2: Run test to verify RED**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts
```

Expected: FAIL because `socialApi` does not exist.

- [ ] **Step 3: Implement social API module**

Create `lib/api/modules/social.ts`:

```ts
import type {
  ActivityFeedItem,
  Comment,
  CommentTargetType,
  CreateCommentInput,
  CreateDiscussionInput,
  Discussion,
  NotificationItem,
  PublicProfile,
} from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const socialApi = {
  createComment(input: CreateCommentInput) {
    return getApiTransport().request<Comment>("POST", "/comments", input);
  },
  createDiscussion(input: CreateDiscussionInput) {
    return getApiTransport().request<Discussion>("POST", "/social/discussions", input);
  },
  deleteComment(id: string) {
    return getApiTransport().request<void>("DELETE", `/comments/${encodeURIComponent(id)}`);
  },
  followUser(userId: string) {
    return getApiTransport().request<PublicProfile>("POST", "/social/follows", { userId });
  },
  getComments(query: { targetId: string; targetType: CommentTargetType }) {
    const search = new URLSearchParams({ targetId: query.targetId, targetType: query.targetType });
    return getApiTransport().request<Comment[]>("GET", `/comments?${search.toString()}`);
  },
  getDiscussions() {
    return getApiTransport().request<Discussion[]>("GET", "/social/discussions");
  },
  getFeed() {
    return getApiTransport().request<ActivityFeedItem[]>("GET", "/social/feed");
  },
  getNotifications() {
    return getApiTransport().request<NotificationItem[]>("GET", "/social/notifications");
  },
  markNotificationRead(id: string) {
    return getApiTransport().request<NotificationItem>(
      "PATCH",
      `/social/notifications/${encodeURIComponent(id)}`,
      { read: true },
    );
  },
  replyToDiscussion(id: string, input: CreateCommentInput) {
    return getApiTransport().request<Comment>(
      "POST",
      `/social/discussions/${encodeURIComponent(id)}/replies`,
      input,
    );
  },
  unfollowUser(userId: string) {
    return getApiTransport().request<PublicProfile>("DELETE", `/social/follows/${encodeURIComponent(userId)}`);
  },
};
```

Modify `lib/api/index.ts`:

```ts
export { socialApi } from "./modules/social";
```

- [ ] **Step 4: Add social fixtures and repository methods**

In `lib/api/mock/fixtures.ts`, add arrays:

```ts
export const mockComments: Comment[] = [
  {
    author: mockPublicAuthors.ada,
    body: "这里用偏置列解释截距非常清楚。",
    createdAt: "2026-05-19T01:00:00.000Z",
    id: "comment_bias_column",
    targetId: "concept_linear_regression",
    targetType: "content",
    updatedAt: "2026-05-19T01:00:00.000Z",
  },
];

export const mockDiscussions: Discussion[] = [
  {
    author: mockPublicAuthors.raymond,
    body: "一个偏理论,一个偏优化。你们会怎么安排学习顺序？",
    createdAt: "2026-05-19T02:00:00.000Z",
    id: "discussion_ols_vs_gd",
    replyCount: 0,
    replies: [],
    status: "open",
    title: "正规方程和梯度下降应该先学哪个？",
    updatedAt: "2026-05-19T02:00:00.000Z",
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    body: "Ada 回复了你的线性回归公开题解。",
    createdAt: "2026-05-19T02:30:00.000Z",
    id: "notification_comment_reply",
    readAt: null,
    target: { id: "concept_linear_regression", label: "线性回归公开题解", type: "content" },
    title: "新的评论",
    type: "comment",
  },
];

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    actor: mockPublicAuthors.raymond,
    createdAt: "2026-05-19T00:30:00.000Z",
    id: "activity_publish_ols",
    summary: "发布了线性回归公开题解",
    target: { id: "concept_linear_regression", label: "线性回归公开题解", type: "content" },
    type: "published_content",
  },
];
```

In `createMockApiRepository()`, clone them into mutable state and add methods:

```ts
    createComment(input: CreateCommentInput) {
      const user = requireUser(currentUser);
      if (input.body.trim().length === 0) {
        throw createApiDomainError(422, "validation_error", "Comment body is required");
      }
      const now = new Date().toISOString();
      const comment: Comment = {
        author: toPublicAuthor(user),
        body: input.body,
        createdAt: now,
        id: `comment_${comments.length + 1}`,
        parentId: input.parentId,
        targetId: input.targetId,
        targetType: input.targetType,
        updatedAt: now,
      };
      comments = [comment, ...comments];
      return cloneOne(comment);
    },
    deleteComment(id: string) {
      requireUser(currentUser);
      comments = comments.filter((item) => item.id !== id);
    },
    followUser(userId: string) {
      requireUser(currentUser);
      publicProfiles = publicProfiles.map((profile) =>
        profile.id === userId
          ? { ...profile, followerCount: profile.followerCount + (profile.isFollowing ? 0 : 1), isFollowing: true }
          : profile,
      );
      return cloneOne(publicProfiles.find((profile) => profile.id === userId)!);
    },
    getComments(targetId: string, targetType: CommentTargetType) {
      return clone(comments.filter((item) => item.targetId === targetId && item.targetType === targetType));
    },
    getDiscussions() {
      return clone(discussions);
    },
    getFeed() {
      return clone(activityFeed);
    },
    getNotifications() {
      return clone(notifications);
    },
    markNotificationRead(id: string) {
      const notification = notifications.find((item) => item.id === id);
      if (!notification) {
        throw createApiDomainError(404, "not_found", "Notification not found");
      }
      notification.readAt = new Date().toISOString();
      return cloneOne(notification);
    },
```

Add `toPublicAuthor()` helper:

```ts
function toPublicAuthor(user: User) {
  return {
    avatarUrl: user.avatarUrl,
    displayName: user.displayName,
    id: user.id,
    level: user.level,
  };
}
```

Implement `createDiscussion`, `replyToDiscussion`, and `unfollowUser` using the same validation and clone pattern.

- [ ] **Step 5: Add social transport routes**

Modify `lib/api/mock/transport.ts` with handlers for `/social/feed`, `/social/discussions`, `/social/discussions/{id}/replies`, `/social/notifications`, `/social/notifications/{id}`, `/social/follows`, `/social/follows/{userId}`, `/comments`, and `/comments/{id}`.

For `GET /comments`, parse:

```ts
const [, queryString = ""] = path.split("?");
const search = new URLSearchParams(queryString);
return repository.getComments(
  search.get("targetId") ?? "",
  (search.get("targetType") ?? "content") as never,
);
```

- [ ] **Step 6: Run social API tests to verify GREEN**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
```

Expected: PASS.

- [ ] **Step 7: Implement social route and comments UI**

Create `app/(social)/social/page.tsx`:

```tsx
import { SocialRoute } from "@/features/social/social-route";

export default function SocialPage() {
  return <SocialRoute />;
}
```

Create `features/social/social-route.tsx` as a client component that loads `socialApi.getFeed()`, `socialApi.getDiscussions()`, and `socialApi.getNotifications()` with `Promise.all`. Implement handlers for `createDiscussion`, `replyToDiscussion`, and `markNotificationRead`, then refresh the relevant state from API responses.

Create `features/social/social-screen.tsx` with three panels:

- Activity feed: `ActivityFeedItem[]`
- Discussions: `Discussion[]` plus create/reply form
- Notifications: `NotificationItem[]` plus mark-read action

Extend `PublicContentDetailRoute` to load comments using `socialApi.getComments()` and pass `onCreateComment`, `onDeleteComment`, and `onReplyToComment` into the detail screen.

Extend `UserProfileRoute` to call `socialApi.followUser()` and `socialApi.unfollowUser()` and update the profile state.

- [ ] **Step 8: Run build**

Run:

```bash
pnpm build
```

Expected: PASS and route list includes `/social`.

- [ ] **Step 9: Commit**

```bash
git add app features lib/api/modules/social.ts lib/api/index.ts lib/api/mock/fixtures.ts lib/api/mock/repository.ts lib/api/mock/transport.ts tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
git commit -m "feat(web): add m4 social mock flows"
```

---

### Task 5: M5 Relation Graph And Portfolio

**Files:**

- Create: `lib/api/modules/relation.ts`
- Create: `lib/api/modules/portfolio.ts`
- Modify: `lib/api/index.ts`
- Modify: `lib/api/mock/fixtures.ts`
- Modify: `lib/api/mock/repository.ts`
- Modify: `lib/api/mock/transport.ts`
- Create: `app/(workspace)/graph/page.tsx`
- Create: `app/(workspace)/portfolio/page.tsx`
- Create: `features/graph/graph-route.tsx`
- Create: `features/graph/graph-screen.tsx`
- Create: `features/portfolio/portfolio-route.tsx`
- Create: `features/portfolio/portfolio-screen.tsx`
- Modify: `features/community/public-content-detail-route.tsx`
- Modify: `tests/lib/api/m2-m6-mock-flows.test.ts`
- Modify: `tests/lib/api/modules.test.ts`

- [ ] **Step 1: Add failing graph/portfolio tests**

Append to `tests/lib/api/m2-m6-mock-flows.test.ts`:

```ts
import { portfolioApi, relationApi } from "@/lib/api";

describe("M5 relation and portfolio mock flows", () => {
  it("loads graph, backlinks, and portfolio evidence", async () => {
    useFreshMockTransport();

    const graph = await relationApi.getGraph();
    const backlinks = await relationApi.getBacklinks({ targetId: "concept_linear_regression" });
    const portfolio = await portfolioApi.getPortfolio("user_raymond");

    expect(graph.nodes).toEqual(expect.arrayContaining([expect.objectContaining({ id: "node_linear_regression" })]));
    expect(graph.edges.length).toBeGreaterThan(0);
    expect(backlinks).toEqual(expect.arrayContaining([expect.objectContaining({ targetId: "concept_linear_regression" })]));
    expect(portfolio.owner.id).toBe("user_raymond");
    expect(portfolio.evidence.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts
```

Expected: FAIL because `relationApi` and `portfolioApi` do not exist.

- [ ] **Step 3: Implement API modules**

Create `lib/api/modules/relation.ts`:

```ts
import type { Backlink, KnowledgeGraph } from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const relationApi = {
  getBacklinks(query: { targetId: string }) {
    const search = new URLSearchParams({ targetId: query.targetId });
    return getApiTransport().request<Backlink[]>("GET", `/relations/backlinks?${search.toString()}`);
  },
  getGraph() {
    return getApiTransport().request<KnowledgeGraph>("GET", "/relations/graph");
  },
};
```

Create `lib/api/modules/portfolio.ts`:

```ts
import type { Portfolio } from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const portfolioApi = {
  getPortfolio(userId: string) {
    return getApiTransport().request<Portfolio>("GET", `/portfolio/${encodeURIComponent(userId)}`);
  },
};
```

Modify `lib/api/index.ts`:

```ts
export { portfolioApi } from "./modules/portfolio";
export { relationApi } from "./modules/relation";
```

- [ ] **Step 4: Add graph and portfolio fixtures/repository/transport**

Add `mockGraph`, `mockBacklinks`, and `mockPortfolios` in `lib/api/mock/fixtures.ts`.

Use these exact graph seeds:

```ts
export const mockGraph: KnowledgeGraph = {
  edges: [
    { from: "node_least_squares", id: "edge_ols_linreg", label: "supports", to: "node_linear_regression" },
    { from: "node_gradient_descent", id: "edge_gd_linreg", label: "optimizes", to: "node_linear_regression" },
    { from: "node_linear_regression", id: "edge_linreg_logreg", label: "prepares", to: "node_logistic_regression" },
  ],
  nodes: [
    { id: "node_least_squares", label: "最小二乘", status: "mastered", x: 120, y: 130 },
    { id: "node_gradient_descent", label: "梯度下降", status: "active", x: 120, y: 260 },
    {
      id: "node_linear_regression",
      label: "线性回归",
      relatedContentId: "concept_linear_regression",
      status: "mastered",
      x: 340,
      y: 190,
    },
    { id: "node_logistic_regression", label: "逻辑回归", status: "next", x: 560, y: 190 },
  ],
};
```

Repository methods:

```ts
    getBacklinks(targetId: string) {
      return clone(backlinks.filter((item) => item.targetId === targetId));
    },
    getGraph() {
      return cloneOne(graph);
    },
    getPortfolio(userId: string) {
      const portfolio = portfolios.find((item) => item.owner.id === userId);
      if (!portfolio) {
        throw createApiDomainError(404, "not_found", "Portfolio not found");
      }
      return cloneOne(portfolio);
    },
```

Transport routes:

```ts
  if (method === "GET" && pathname === "/relations/graph") {
    return repository.getGraph();
  }

  if (method === "GET" && pathname === "/relations/backlinks") {
    const [, queryString = ""] = path.split("?");
    const search = new URLSearchParams(queryString);
    return repository.getBacklinks(search.get("targetId") ?? "");
  }

  const portfolioMatch = pathname?.match(/^\/portfolio\/([^/]+)$/);
  if (portfolioMatch && method === "GET") {
    return repository.getPortfolio(decodeURIComponent(portfolioMatch[1]!));
  }
```

- [ ] **Step 5: Run API tests to verify GREEN**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
```

Expected: PASS.

- [ ] **Step 6: Implement graph and portfolio routes**

Create `app/(workspace)/graph/page.tsx`:

```tsx
import { GraphRoute } from "@/features/graph/graph-route";

export default function GraphPage() {
  return <GraphRoute />;
}
```

Create `app/(workspace)/portfolio/page.tsx`:

```tsx
import { PortfolioRoute } from "@/features/portfolio/portfolio-route";

export default function PortfolioPage() {
  return <PortfolioRoute userId="user_raymond" />;
}
```

`GraphRoute` loads `relationApi.getGraph()` and renders `GraphScreen` inside `AppShell active="graph"`.

`GraphScreen` renders one SVG:

- `<line>` for every edge.
- `<button>` or SVG group for every node.
- Local state `selectedNodeId`.
- Local state `statusFilter: GraphNodeStatus | "all"`.
- Detail panel showing selected node, incoming/outgoing edges, and link to related content if `relatedContentId` exists.

`PortfolioRoute` loads `portfolioApi.getPortfolio(userId)` and renders `PortfolioScreen` inside `AppShell active="portfolio"`.

`PortfolioScreen` renders owner summary, highlights, and evidence cards.

- [ ] **Step 7: Add backlinks to public detail route**

Update `features/community/public-content-detail-route.tsx` to load:

```ts
relationApi.getBacklinks({ targetId: content.id })
```

Pass `backlinks` into the detail screen and render them in a right rail.

- [ ] **Step 8: Run build**

Run:

```bash
pnpm build
```

Expected: PASS and route list includes `/graph` and `/portfolio`.

- [ ] **Step 9: Commit**

```bash
git add app features/graph features/portfolio features/community lib/api/modules/relation.ts lib/api/modules/portfolio.ts lib/api/index.ts lib/api/mock/fixtures.ts lib/api/mock/repository.ts lib/api/mock/transport.ts tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
git commit -m "feat(web): add m5 graph and portfolio mock flows"
```

---

### Task 6: M6 Moderation API And Admin Console

**Files:**

- Create: `lib/api/modules/moderation.ts`
- Modify: `lib/api/modules/admin.ts`
- Modify: `lib/api/index.ts`
- Modify: `lib/api/mock/fixtures.ts`
- Modify: `lib/api/mock/repository.ts`
- Modify: `lib/api/mock/transport.ts`
- Modify: `features/admin/admin-screen.tsx`
- Modify: `tests/lib/api/m2-m6-mock-flows.test.ts`
- Modify: `tests/lib/api/modules.test.ts`

- [ ] **Step 1: Add failing moderation tests**

Append to `tests/lib/api/m2-m6-mock-flows.test.ts`:

```ts
import { moderationApi } from "@/lib/api";

describe("M6 moderation mock flows", () => {
  it("resolves a report and appends an admin action", async () => {
    useFreshMockTransport();

    const [report] = await moderationApi.getReports();
    const resolved = await moderationApi.resolveReport(report!.id, {
      reason: "已要求作者补充来源。",
      status: "resolved",
    });
    const actions = await moderationApi.getAdminActions();

    expect(resolved.status).toBe("resolved");
    expect(actions).toEqual(expect.arrayContaining([expect.objectContaining({ action: "resolve_report" })]));
  });

  it("toggles registration settings", async () => {
    useFreshMockTransport();

    const before = await moderationApi.getRegistration();
    const after = await moderationApi.updateRegistration({
      inviteOnly: false,
      openRegistration: true,
    });

    expect(before.openRegistration).toBe(false);
    expect(after.openRegistration).toBe(true);
    expect(after.inviteOnly).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts
```

Expected: FAIL because `moderationApi` does not exist.

- [ ] **Step 3: Implement moderation API module**

Create `lib/api/modules/moderation.ts`:

```ts
import type {
  AdminAction,
  ModerateContentInput,
  ModerationReport,
  RegistrationSettings,
  ResolveReportInput,
  RestrictUserInput,
  UpdateRegistrationInput,
} from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const moderationApi = {
  getAdminActions() {
    return getApiTransport().request<AdminAction[]>("GET", "/admin/actions");
  },
  getRegistration() {
    return getApiTransport().request<RegistrationSettings>("GET", "/admin/registration");
  },
  getReports() {
    return getApiTransport().request<ModerationReport[]>("GET", "/admin/reports");
  },
  moderateComment(id: string, input: ModerateContentInput) {
    return getApiTransport().request<AdminAction>(
      "POST",
      `/admin/comments/${encodeURIComponent(id)}/moderate`,
      input,
    );
  },
  moderateContent(id: string, input: ModerateContentInput) {
    return getApiTransport().request<AdminAction>(
      "POST",
      `/admin/content/${encodeURIComponent(id)}/moderate`,
      input,
    );
  },
  resolveReport(id: string, input: ResolveReportInput) {
    return getApiTransport().request<ModerationReport>(
      "POST",
      `/admin/reports/${encodeURIComponent(id)}/resolve`,
      input,
    );
  },
  restrictUser(id: string, input: RestrictUserInput) {
    return getApiTransport().request<AdminAction>(
      "POST",
      `/admin/users/${encodeURIComponent(id)}/restrict`,
      input,
    );
  },
  updateRegistration(input: UpdateRegistrationInput) {
    return getApiTransport().request<RegistrationSettings>("PATCH", "/admin/registration", input);
  },
};
```

Modify `lib/api/index.ts`:

```ts
export { moderationApi } from "./modules/moderation";
```

- [ ] **Step 4: Add moderation fixtures and repository methods**

Add `mockModerationReports`, `mockRegistrationSettings`, and `mockAdminActions` in `lib/api/mock/fixtures.ts`.

Repository methods must call `requireAdmin(currentUser)` before every M6 action. Add helper:

```ts
function createAdminAction(
  actorId: string,
  action: string,
  target: ModerationTarget,
  reason: string,
  existingCount: number,
): AdminAction {
  return {
    action,
    actorId,
    createdAt: new Date().toISOString(),
    id: `admin_action_${existingCount + 1}`,
    reason,
    target,
  };
}
```

Implement:

```ts
    getAdminActions() {
      requireAdmin(currentUser);
      return clone(adminActions);
    },
    getRegistration() {
      requireAdmin(currentUser);
      return cloneOne(registrationSettings);
    },
    getReports() {
      requireAdmin(currentUser);
      return clone(moderationReports);
    },
    resolveReport(id: string, input: ResolveReportInput) {
      const admin = requireAdmin(currentUser);
      const report = moderationReports.find((item) => item.id === id);
      if (!report) {
        throw createApiDomainError(404, "not_found", "Report not found");
      }
      if (input.reason.trim().length === 0) {
        throw createApiDomainError(422, "validation_error", "Moderation reason is required");
      }
      report.status = input.status;
      adminActions = [
        createAdminAction(admin.id, "resolve_report", report.target, input.reason, adminActions.length),
        ...adminActions,
      ];
      return cloneOne(report);
    },
    updateRegistration(input: UpdateRegistrationInput) {
      requireAdmin(currentUser);
      registrationSettings = {
        inviteOnly: input.inviteOnly,
        openRegistration: input.openRegistration,
        updatedAt: new Date().toISOString(),
      };
      return cloneOne(registrationSettings);
    },
```

Implement `moderateContent`, `moderateComment`, and `restrictUser` as action-log appenders that validate non-empty `reason` and return the created `AdminAction`.

- [ ] **Step 5: Add moderation transport routes**

Modify `lib/api/mock/transport.ts` with handlers for:

- `GET /admin/reports`
- `POST /admin/reports/{id}/resolve`
- `POST /admin/content/{id}/moderate`
- `POST /admin/comments/{id}/moderate`
- `POST /admin/users/{id}/restrict`
- `GET /admin/registration`
- `PATCH /admin/registration`
- `GET /admin/actions`

- [ ] **Step 6: Run API tests to verify GREEN**

Run:

```bash
pnpm test:run tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
```

Expected: PASS.

- [ ] **Step 7: Expand admin screen**

Modify `features/admin/admin-screen.tsx` so it loads:

```ts
Promise.all([
  adminApi.getOverview(),
  adminApi.getModerationQueue(),
  moderationApi.getReports(),
  moderationApi.getRegistration(),
  moderationApi.getAdminActions(),
])
```

Render these panels:

- Metrics from `AdminOverview`.
- Reports table with `resolve`, `dismiss`, and `escalate` buttons.
- Registration settings with a toggle button for `openRegistration`.
- Admin action log.
- Right rail explaining mock-first governance and future backend enforcement.

Implement handlers:

```ts
const resolveReport = async (id: string, status: "dismissed" | "escalated" | "resolved") => {
  await moderationApi.resolveReport(id, {
    reason: status === "resolved" ? "Mock review completed." : "Mock moderation decision.",
    status,
  });
  await reloadAdminState();
};

const toggleRegistration = async () => {
  if (state.status !== "ready") return;
  await moderationApi.updateRegistration({
    inviteOnly: state.registration.openRegistration,
    openRegistration: !state.registration.openRegistration,
  });
  await reloadAdminState();
};
```

- [ ] **Step 8: Run build**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add features/admin lib/api/modules/moderation.ts lib/api/modules/admin.ts lib/api/index.ts lib/api/mock/fixtures.ts lib/api/mock/repository.ts lib/api/mock/transport.ts tests/lib/api/m2-m6-mock-flows.test.ts tests/lib/api/modules.test.ts
git commit -m "feat(web): add m6 moderation mock flows"
```

---

### Task 7: Navigation, Feature Migration Guard, And README

**Files:**

- Modify: `lib/navigation/synapse-navigation.ts`
- Modify: `components/layout/top-nav.tsx`
- Modify: `tests/lib/api/feature-migration.test.ts`
- Modify: `README.md`

- [ ] **Step 1: Write failing feature migration test update**

Modify `tests/lib/api/feature-migration.test.ts` second test so it rejects direct fixture imports:

```ts
      expect(content, file).not.toContain("@/lib/api/mock/fixtures");
```

Run:

```bash
pnpm test:run tests/lib/api/feature-migration.test.ts
```

Expected: PASS if previous tasks avoided direct fixture imports. If it fails, remove those imports and route through API modules.

- [ ] **Step 2: Update navigation**

Modify `lib/navigation/synapse-navigation.ts`:

```ts
export type Screen =
  | "community"
  | "concept"
  | "graph"
  | "portfolio"
  | "review"
  | "social"
  | "studio"
  | "workspace";
```

Update routes:

```ts
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
```

Update nav items:

```ts
export const navItems: Array<{ label: string; screen: NavScreen }> = [
  { label: "Community", screen: "community" },
  { label: "Social", screen: "social" },
  { label: "Workspace", screen: "workspace" },
  { label: "Graph", screen: "graph" },
  { label: "Portfolio", screen: "portfolio" },
  { label: "Studio", screen: "studio" },
  { label: "Review", screen: "review" },
];
```

If the top nav becomes too wide, add responsive wrapping in `components/layout/top-nav.tsx`:

```tsx
<div className="hidden h-[52px] items-center gap-5 text-[13px] lg:flex">
```

Add a compact secondary nav or keep direct routes accessible through page links on smaller screens.

- [ ] **Step 3: Update README**

Modify README sections:

- "What Is Implemented" includes M2 public browsing, M3 review scheduling, M4 social mock, M5 graph/portfolio, and M6 governance mock.
- "Routes" includes `/social`, `/graph`, `/portfolio`, `/community/concepts/[slug]`, `/users/[id]`.
- "Mock-First API" states M2-M6 are in-memory only and refresh resets state.
- "Not Implemented" states no real backend persistence, real WebSocket/SSE, backend full-text search, or graph layout library.

- [ ] **Step 4: Run tests**

Run:

```bash
pnpm test:run tests/lib/api/feature-migration.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/navigation/synapse-navigation.ts components/layout/top-nav.tsx tests/lib/api/feature-migration.test.ts README.md
git commit -m "docs(web): document m2 m6 mock frontend scope"
```

---

### Task 8: Full Verification And Cleanup

**Files:**

- Modify only files required by failing verification.

- [ ] **Step 1: Run all tests**

Run:

```bash
pnpm test:run
```

Expected: all test files pass with zero failed tests.

- [ ] **Step 2: Run lint**

Run:

```bash
pnpm lint
```

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Run typecheck**

Run:

```bash
pnpm typecheck
```

Expected: `next typegen` succeeds and `tsc --noEmit` exits 0.

- [ ] **Step 4: Run production build**

Run:

```bash
pnpm build
```

Expected: optimized production build succeeds and route list includes:

```text
/
/admin
/community
/community/concepts/[slug]
/graph
/login
/portfolio
/review
/social
/studio
/users/[id]
/workspace
/workspace/concepts/linear-regression
```

- [ ] **Step 5: Inspect git diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: only intended files changed; no `.next`, `node_modules`, `.DS_Store`, or local environment files.

- [ ] **Step 6: Commit final cleanup if needed**

If verification fixes changed files:

```bash
git add <changed-files>
git commit -m "chore(web): verify m2 m6 mock frontend"
```

If no cleanup changes are needed, do not create an empty commit.

---

## Self-Review

- Spec coverage: M2 public browsing, M3 review scheduling, M4 social activity, M5 graph/portfolio, M6 moderation, mock-only persistence, no WebSocket/search/graph library, and verification gates are covered by tasks.
- Placeholder scan: The plan contains no unresolved placeholder markers. Each task has concrete files, tests, commands, and expected outcomes.
- Type consistency: DTO names in tests match the contract names introduced in Task 1. API module names match exports used by later tests and screens.
- Scope check: This remains frontend-only and does not modify `learning-garden-server`.
