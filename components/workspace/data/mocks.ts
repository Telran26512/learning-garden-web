import type {
  RoadmapStage,
  TodayTask,
  WorkspaceNotification,
} from "@/lib/types/synapse";
export const todayTasks = [
  {
    title: "继续: Multi-Head Attention 推导",
    status: "in progress",
    source: "14 min ago",
  },
  {
    title: "复习 12 张到期卡片",
    status: "SM-2 due",
    source: "now",
  },
  {
    title: "读完 RoFormer 2.3 节",
    status: "reading",
    source: "arXiv:2104.09864",
  },
  {
    title: "补一条 commit: posenc.py",
    status: "auto-detected",
    source: "23 min ago",
  },
] as const satisfies readonly TodayTask[];

export const roadmap = [
  {
    index: 1,
    title: "Foundations",
    progress: 100,
    status: "done",
    lessons: [
      { week: "W1", title: "Linear Algebra", done: true },
      { week: "W2", title: "Probability", done: true },
      { week: "W3", title: "Optimization", done: true },
      { week: "W4", title: "Numerical", done: true },
    ],
  },
  {
    index: 2,
    title: "Deep Learning",
    progress: 62,
    status: "active",
    lessons: [
      {
        week: "W1",
        title: "MLP & Backprop",
        done: true,
        tasks: [
          { label: "链式法则推导", status: "todo" },
          { label: "BP 矩阵形式", status: "todo" },
          { label: "numpy 实现 2-layer", status: "todo" },
        ],
      },
      {
        week: "W2",
        title: "CNN",
        done: true,
        tasks: [
          { label: "卷积 vs 相关", status: "todo" },
          { label: "pooling 与 stride", status: "todo" },
          { label: "ResNet 残差", status: "todo" },
        ],
      },
      {
        week: "W3",
        title: "Transformer 精读",
        active: true,
        tasks: [
          { label: "Scaled Dot-Product 推导", status: "done" },
          { label: "Multi-Head 拆分", status: "active" },
          { label: "Positional Encoding", status: "todo" },
        ],
      },
      {
        week: "W4",
        title: "Training Dynamics",
        tasks: [
          { label: "Adam 推导", status: "todo" },
          { label: "Warmup + cosine", status: "todo" },
          { label: "gradient clip", status: "todo" },
        ],
      },
    ],
  },
  {
    index: 3,
    title: "Reinforcement Learning",
    progress: 0,
    status: "locked",
    lessons: [
      { week: "W1", title: "MDP / Bellman" },
      { week: "W2", title: "DQN" },
      { week: "W3", title: "PPO" },
      { week: "W4", title: "Off-policy" },
    ],
  },
] as const satisfies readonly RoadmapStage[];

export const notifications = [
  {
    avatar: "齐",
    title: "齐欣 mentioned you in 齐欣 / KV-Cache 复杂度",
    time: "12m",
  },
  {
    avatar: "A",
    title: "Aria cited your Softmax 数值稳定性 Note",
    time: "2h",
  },
  {
    avatar: "M",
    title: "Maxwell started following you",
    time: "1d",
  },
] as const satisfies readonly WorkspaceNotification[];
export const activityBlocksLast30 = [
  2, 1, 3, 0, 2, 4, 3, 1, 2, 5, 4, 3, 6, 2, 1, 4, 5, 3, 2, 4, 6, 5, 3, 4, 2, 5,
  6, 4, 3, 5,
] as const satisfies readonly number[];
