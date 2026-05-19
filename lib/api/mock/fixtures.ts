import type {
  AdminOverview,
  Concept,
  ModerationQueueItem,
  PublicContentItem,
  PublicProfile,
  ReviewCard,
  RoadmapTask,
  User,
} from "@/lib/api/contracts";

export const mockCurrentUser: User = {
  avatarUrl: "/avatar.jpg",
  createdAt: "2026-05-19T00:00:00.000Z",
  displayName: "Raymond",
  email: "raymond@synapse.local",
  id: "user_raymond",
  level: 6,
  role: "admin",
};

export const mockConcepts: Concept[] = [
  {
    createdAt: "2026-05-19T00:00:00.000Z",
    id: "concept_linear_regression",
    mastery: 68,
    ownerId: "user_raymond",
    sections: [
      {
        body: "给定线性模型 y_hat = Xw + epsilon, 最小二乘目标是最小化残差平方和 J(w)=||y-Xw||^2。对 w 求导并令导数为 0, 得到 X^T X w = X^T y。",
        id: "section_ols_math",
        kind: "math",
        title: "最小必要推导",
      },
      {
        body: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

np.random.seed(42)
X = np.random.rand(100, 1)
y = 4 + 3 * X.squeeze() + np.random.randn(100)*.5

model = LinearRegression()
model.fit(X, y)
print("w =", model.coef_[0], "b =", model.intercept_)
print("R2 =", r2_score(y, model.predict(X)))`,
        id: "section_ols_code",
        kind: "code",
        language: "python",
        title: "参考实现",
      },
      {
        body: "Chapter 3.1-3.3 gives the statistical framing for least squares and model evaluation.",
        id: "section_ols_paper_islr",
        kind: "paper",
        sourceMeta: "G. James 等 · 2013 · 章节 3.1-3.3",
        sourceTitle: "An Introduction to Statistical Learning",
        title: "论文与教材锚点",
      },
      {
        body: "本轮训练重点不是背公式,而是能解释为什么需要补偏置列,以及矩阵维度如何对应代码实现。",
        id: "section_ols_note",
        kind: "note",
        title: "错因提醒",
      },
    ],
    slug: "linear-regression-ols",
    status: "published",
    summary: "实现带偏置项的最小二乘解,并解释正规方程为什么成立。",
    tags: ["线性回归", "最小二乘", "统计学习"],
    title: "线性回归: 最小二乘推导与实现",
    updatedAt: "2026-05-19T00:00:00.000Z",
    visibility: "public",
  },
  {
    createdAt: "2026-05-17T00:00:00.000Z",
    id: "concept_cross_entropy_gradient",
    mastery: 42,
    ownerId: "user_raymond",
    sections: [
      {
        body: "Softmax 与交叉熵合并后梯度可以化简为 p - y。",
        id: "section_ce_math",
        kind: "math",
        title: "梯度化简",
      },
    ],
    slug: "cross-entropy-gradient",
    status: "draft",
    summary: "从 logits 平移开始推导 softmax + cross entropy 的稳定实现。",
    tags: ["交叉熵", "梯度", "数值稳定"],
    title: "Softmax + 交叉熵梯度的稳定实现",
    updatedAt: "2026-05-18T00:00:00.000Z",
    visibility: "private",
  },
];

export const mockPublicAuthors = {
  raymond: {
    avatarUrl: "/avatar.jpg",
    displayName: "Raymond",
    id: "user_raymond",
    level: 6,
  },
};

export const mockPublicContent: PublicContentItem[] = [
  {
    author: mockPublicAuthors.raymond,
    commentCount: 3,
    contentType: "concept",
    createdAt: "2026-05-19T00:00:00.000Z",
    excerpt: "正规方程的推导与实现, 从矩阵维度到 NumPy 代码逐步拆解。",
    id: "concept_linear_regression",
    ownerId: "user_raymond",
    slug: "linear-regression-ols",
    tags: ["线性回归", "最小二乘", "统计学习"],
    title: "线性回归: 最小二乘推导与实现",
    updatedAt: "2026-05-19T00:00:00.000Z",
    visibility: "public",
  },
  {
    author: mockPublicAuthors.raymond,
    commentCount: 1,
    contentType: "concept",
    createdAt: "2026-05-18T00:00:00.000Z",
    excerpt: "记录 softmax 与交叉熵合并后的梯度化简和数值稳定处理。",
    id: "content_cross_entropy_public",
    ownerId: "user_raymond",
    slug: "cross-entropy-gradient",
    tags: ["交叉熵", "梯度", "数值稳定"],
    title: "Softmax + 交叉熵梯度的稳定实现",
    updatedAt: "2026-05-18T00:00:00.000Z",
    visibility: "public",
  },
];

export const mockPublicProfiles: PublicProfile[] = [
  {
    avatarUrl: "/avatar.jpg",
    bio: "热爱机器学习与统计学, 构建自己的知识体系。",
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
      { label: "连续训练", value: "21 天" },
    ],
  },
];

export const mockRoadmapTasks: RoadmapTask[] = [
  {
    conceptId: "concept_linear_regression",
    description: "确认目标函数、求导结果和正规方程。",
    id: "task_derive_objective",
    order: 1,
    status: "done",
    title: "推导目标函数与梯度",
    updatedAt: "2026-05-19T00:00:00.000Z",
  },
  {
    conceptId: "concept_linear_regression",
    description: "把截距项转成第一列常数。",
    id: "task_ols_bias",
    order: 2,
    status: "current",
    title: "补偏置列并实现正规方程",
    updatedAt: "2026-05-19T00:00:00.000Z",
  },
  {
    conceptId: "concept_linear_regression",
    description: "记录错误原因, 安排下次回放。",
    id: "task_review_error",
    order: 3,
    status: "pending",
    title: "解释错因并记录回放",
    updatedAt: "2026-05-19T00:00:00.000Z",
  },
];

export const mockReviewCards: ReviewCard[] = [
  {
    conceptId: "concept_linear_regression",
    dueAt: "2026-05-19T00:00:00.000Z",
    ease: 2.5,
    errorSummary: "忘记给输入拼接偏置列, 模型没有学到截距项。",
    id: "review_bias_column",
    intervalDays: 1,
    lastReviewedAt: null,
    prompt: "用 NumPy 实现带偏置项的正规方程解 linear_regression(X, y)。",
    referenceCode: `import numpy as np

def linear_regression(X, y):
    X_b = np.c_[np.ones((len(X), 1)), X]
    w = np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y
    return w`,
    status: "due",
    userCode: `import numpy as np

def linear_regression(X, y):
    w = np.linalg.inv(X.T @ X) @ X.T @ y
    return w`,
  },
  {
    conceptId: "concept_cross_entropy_gradient",
    dueAt: "2026-05-19T00:00:00.000Z",
    ease: 2.35,
    errorSummary: "把 softmax 和 cross entropy 分开求导, 遗漏了 p - y 的化简。",
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
];

export const mockAdminOverview: AdminOverview = {
  activeUserCount: 128,
  apiBasePath: "/api/v1",
  moderationPendingCount: 12,
  publicConceptCount: 8,
};

export const mockModerationQueue: ModerationQueueItem[] = [
  {
    ageLabel: "2 小时",
    createdAt: "2026-05-19T00:00:00.000Z",
    id: "mod_public_solution_softmax",
    status: "待处理",
    title: "Softmax 梯度稳定实现",
    type: "公开题解审核",
  },
  {
    ageLabel: "6 小时",
    createdAt: "2026-05-18T20:00:00.000Z",
    id: "mod_ppo_clip_report",
    status: "需复核",
    title: "PPO Clip 目标解释争议",
    type: "举报记录",
  },
  {
    ageLabel: "昨天",
    createdAt: "2026-05-18T00:00:00.000Z",
    id: "mod_ols_formula_revision",
    status: "已通过",
    title: "线性回归推导公式排版",
    type: "内容修订",
  },
];
