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
  PublicContentDetail,
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
    const detail: PublicContentDetail = {
      createdAt: "2026-05-19T00:00:00.000Z",
      id: "concept_linear_regression",
      ownerId: "user_raymond",
      sections: [],
      slug: "linear-regression-ols",
      status: "published",
      summary: "公开详情不包含个人 mastery。",
      tags: ["线性回归"],
      title: "线性回归公开题解",
      updatedAt: "2026-05-19T00:00:00.000Z",
      visibility: "public",
    };

    expect(content.visibility).toBe("public");
    expect(detail.visibility).toBe("public");
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
