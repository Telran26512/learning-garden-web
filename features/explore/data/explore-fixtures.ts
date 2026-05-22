import type {
  DiscoverItem,
  ExploreFeedItem,
  ExploreFeedTab,
  ExplorePaper,
  ExplorePerson,
  ExploreRange,
  ExploreTrack,
} from "../model/explore-model";

export const discoverItems = [
  { id: "trending", label: "Trending", mark: "↑" },
  { id: "latest", label: "Latest", mark: "new" },
  { id: "following", label: "Following", mark: "••" },
  { id: "graph", label: "Knowledge Graph", mark: "link" },
  { id: "papers", label: "Papers", mark: "§" },
] as const satisfies readonly DiscoverItem[];

export const tagStats = [
  ["Transformer", "1,284"],
  ["Reinforcement-Learning", "962"],
  ["Diffusion-Model", "781"],
  ["Linear-Algebra", "524"],
  ["Optimization", "412"],
  ["MoE", "318"],
  ["RLHF", "287"],
] as const;

export const feedTabs = [
  "Trending",
  "Latest",
  "Following",
  "Tags",
] as const satisfies readonly ExploreFeedTab[];

export const ranges = [
  "24h",
  "7d",
  "30d",
  "all",
] as const satisfies readonly ExploreRange[];

export const feedItems = [
  {
    author: "Aria Chen",
    avatar: "A",
    body: "把 DDPM 的 q(x_t-1 | x_t, x_0) 重写为非马尔可夫形式,DDIM 的 σ_t=0 退化即是确定性采样。本节给出从 §4.1 推到 σ_t 的完整 12 步。",
    cites: 6,
    color: "bg-[var(--syn-accent)]",
    comments: 24,
    handle: "@aria-chen",
    id: "fixture-ddim",
    meta: "2 小时前 · in 扩散模型推导精读",
    ownerId: "aria",
    swatches: ["math", "paper", "math"],
    tags: ["Diffusion", "论文精读"],
    title: 'DDIM 是不是 DDPM 的"确定性版本"? —— 从 reverse process 重写',
    votes: 187,
    views: 412,
  },
  {
    author: "齐欣",
    avatar: "齐",
    body: "把 prefill / decode 两阶段拆开,每 token 的 FLOPs 与 HBM 读写都列成表。结论: KV-Cache 主要降的是 HBM 带宽,FLOPs 反而几乎不变。",
    cites: 9,
    color: "bg-[#8A5B45]",
    comments: 18,
    handle: "@qixin",
    id: "fixture-kv-cache",
    meta: "5 小时前 · in Transformer 精读",
    ownerId: "qixin",
    swatches: ["paper", "code"],
    tags: ["Transformer", "推理优化"],
    title: "KV-Cache 到底省了什么: 逐 token 复杂度重算",
    votes: 142,
    views: 318,
  },
  {
    author: "Shubham R.",
    avatar: "S",
    body: "从单位圆被线性变换成椭圆开始,把 UΣVᵀ 拆成三次空间变换。最后用 rank-k approximation 解释 LoRA 的低秩约束。",
    cites: 4,
    color: "bg-[#7A7066]",
    comments: 12,
    handle: "@shubham-r",
    id: "fixture-svd",
    meta: "昨天 · in Linear Algebra Done Right",
    ownerId: "shubham",
    swatches: ["paper", "math", "code"],
    tags: ["Linear Algebra", "LoRA"],
    title: "SVD 的几何直觉: 椭球、投影和低秩近似",
    votes: 98,
    views: 224,
  },
] as const satisfies readonly ExploreFeedItem[];

export const tracks = [
  ["01", "GRPO 实战日志", "@maxwell-tu", "↑412"],
  ["02", "Diffusion 全景手册", "@aria-chen", "↑287"],
  ["03", "PPO from Bellman", "@zhe-li", "↑213"],
  ["04", "Axler 习题集", "@shubham-r", "↑154"],
] as const satisfies readonly ExploreTrack[];

export const papers = [
  [
    "arXiv:1706.03762",
    "Attention Is All You Need",
    "Vaswani 2017",
    "28 cites this week",
  ],
  [
    "arXiv:2006.11239",
    "Denoising Diffusion Probabilistic Models",
    "Ho 2020",
    "19 cites this week",
  ],
  [
    "arXiv:2402.03300",
    "DeepSeekMath: GRPO",
    "DeepSeek 2024",
    "14 cites this week",
  ],
  ["arXiv:2205.14135", "FlashAttention", "Dao 2022", "11 cites this week"],
] as const satisfies readonly ExplorePaper[];

export const people = [
  ["Maxwell Tu", "@maxwell-tu", "RLHF · 12 Notes", "bg-[var(--syn-accent)]"],
  ["Aria Chen", "@aria-chen", "Diffusion · 18 Notes", "bg-[#8A5B45]"],
  ["Sho Tanaka", "@sho-t", "NLP · 22 Notes", "bg-[#7A7066]"],
] as const satisfies readonly ExplorePerson[];
