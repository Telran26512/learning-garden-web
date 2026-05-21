export type CommunityStat = {
  label: string;
  tone?: "green";
  value: string;
};

export type CommunityTab = {
  count?: number;
  href: string;
  label: string;
};

export type CommunityFeedKind =
  | "track"
  | "thread"
  | "note"
  | "reading-session"
  | "experiment"
  | "question";

export type CommunityFeedItem = {
  accent: "amber" | "ink" | "green" | "pink" | "purple";
  action?: string;
  author: string;
  avatar: string;
  body?: string;
  footnote?: string;
  kind: CommunityFeedKind;
  label?: string;
  meta: string;
  metrics: readonly string[];
  paper?: string;
  quote?: string;
  stats?: readonly { label: string; value: string }[];
  tags?: readonly string[];
  title: string;
};

export type CommunityPerson = {
  avatar: string;
  bio: string;
  color: "amber" | "ink" | "green" | "pink" | "purple";
  following?: boolean;
  handle: string;
  name: string;
};

export type CommunityTopic = {
  delta: string;
  label: string;
  status?: "new";
};

export type CommunityReadingSession = {
  meta: string;
  time: string;
  title: string;
  tone: "amber" | "ink" | "green" | "purple";
};

export const communityHero = {
  eyebrow: "Synapse · Community",
  subtitle:
    "来自你 follow 的人、你订阅的 topics、以及本周高热度的 tracks 和 paper discussions。",
  title: "这一周,大家在想些什么",
};

export const communityStats: readonly CommunityStat[] = [
  { label: "Tracks shared", value: "312" },
  { label: "Notes published", value: "1,847" },
  { label: "Paper threads", value: "94" },
  { label: "Your followers", tone: "green", value: "+218" },
];

export const communityTabs: readonly CommunityTab[] = [
  { href: "/app?view=community", label: "For you" },
  { count: 89, href: "/app?view=community&tab=following", label: "Following" },
  { href: "/app?view=community&tab=trending", label: "Trending" },
  { href: "/app?view=community&tab=tracks", label: "Tracks" },
  { href: "/app?view=community&tab=papers", label: "Papers" },
  { href: "/app?view=community&tab=discussions", label: "Discussions" },
  {
    count: 12,
    href: "/app?view=community&tab=reading-clubs",
    label: "Reading Clubs",
  },
];

export const communityFeed: readonly CommunityFeedItem[] = [
  {
    accent: "ink",
    author: "@elena-ostrov",
    avatar: "∇π",
    body: "从 reward modeling 的偏好数据怎么收开始,逐步走到 PPO 的 KL 项设计、reference model 选择、RL 阶段的 reward hacking 和 mode collapse 早期信号。每一篇都附一段能跑的代码片段。",
    kind: "track",
    label: "▲ Trending track · #1 this week",
    meta: "14 notes · 6 papers · started 2 weeks ago",
    metrics: [
      "1.4k ↑",
      "89 forks",
      "23 discussions",
      "● matched your interests · 92%",
    ],
    title: "RLHF from Scratch · 一周一篇",
  },
  {
    accent: "purple",
    action: "started a thread on",
    author: "Rohan Chen",
    avatar: "RC",
    kind: "thread",
    label: "Paper",
    meta: "3h ago",
    metrics: ["▲ 142", "↪ 28 replies", "◷ save", "↗ share"],
    paper: "Group Relative Policy Optimization (GRPO) · Shao et al. · DeepSeek",
    quote:
      "原文里把 group baseline 写成 (r − mean) / std,但是从 variance reduction 的角度,这并不等价于标准的 advantage normalization。",
    title: "在 GRPO 里,group baseline 真的等价于 advantage 归一吗?",
  },
  {
    accent: "amber",
    action: "published a note in",
    author: "Maya Kobayashi",
    avatar: "MK",
    kind: "note",
    label: "Flash Attention 拆解",
    meta: "6h ago",
    metrics: ["▲ 87", "↪ 12 replies", "↗ 4 reblogs", "◷ save"],
    quote:
      "IO(FA)=O(N²d² / M),其中 M = SRAM size。把 attention matrix 切成 b_r × b_c 的 tile,每个 tile 都需要把对应的 Q,K,V 子块加载进 SRAM 一次。",
    tags: ["attention", "memory", "IO-aware", "推导"],
    title: "为什么 Flash Attention 的 IO 计数是 O(N²d/M),不是 O(N²)?",
  },
  {
    accent: "green",
    action: "scheduled a new session",
    author: "Reading Group · Asia",
    avatar: "RX",
    kind: "reading-session",
    label: "Reading club",
    meta: "tomorrow · 21:00 CST",
    metrics: ["JL", "RS", "YT", "MI", "EO", "+32 going · 8 from your network"],
    paper:
      "→ Leviathan et al. · Fast Inference from Transformers via Speculative Decoding · ICML 2023",
    stats: [
      { label: "Duration", value: "2.0h" },
      { label: "Attending", value: "37" },
      { label: "Questions queued", value: "12" },
      { label: "+ 中文 channel", value: "EN" },
    ],
    title: "本周精读 · Speculative Decoding 的接受率分析",
  },
  {
    accent: "ink",
    action: "shared an experiment",
    author: "Junho Lee",
    avatar: "JL",
    kind: "experiment",
    label: "Experiment",
    meta: "9h ago",
    metrics: ["▲ 213", "↪ 41 replies", "⌁ open in Synapse Lab", "↗ share"],
    title: "triton-fa2-vs-cuda-fa2 · throughput at long context",
  },
  {
    accent: "pink",
    action: "asked",
    author: "Elena Ostrov",
    avatar: "EO",
    kind: "question",
    label: "Question",
    meta: "12h ago",
    metrics: [
      "▲ 64",
      "↪ 18 replies",
      "6 from researchers you follow",
      "◷ save",
    ],
    tags: ["RLHF", "DPO", "PPO", "small-model"],
    title:
      "在 1B 以下小模型上,DPO 和 PPO 哪个更稳?你们的 hyperparam sensitivity 看起来什么样?",
  },
  {
    accent: "purple",
    author: "@yuki-tanaka",
    avatar: "∫dx",
    body: "一条完整的 score-based 路径:NCSN 的 noise conditional → SDE 的连续视角 → EDM 的几何化重新参数化。每一段都有一份 colab,可以直接跑出图。",
    kind: "track",
    label: "⋆ Track shipped · Trending #4",
    meta: "11 notes · 8 papers · 4 reproductions",
    metrics: ["892 ↑", "54 forks", "16 discussions"],
    title: "Score-based Models · 从 NCSN 到 EDM",
  },
];

export const communityPeople: readonly CommunityPerson[] = [
  {
    avatar: "RC",
    bio: 'RL @ Anthropic · "thinking out loud about GRPO"',
    color: "purple",
    handle: "@rohan",
    name: "Rohan Chen",
  },
  {
    avatar: "EO",
    bio: "PhD, alignment. Author of RLHF from Scratch.",
    color: "pink",
    following: true,
    handle: "@elena-ostrov",
    name: "Elena Ostrov",
  },
  {
    avatar: "MK",
    bio: "Systems / GPU. Triton + CUDA notes.",
    color: "amber",
    handle: "@maya-k",
    name: "Maya Kobayashi",
  },
  {
    avatar: "JL",
    bio: "Inference @ Naver. KV cache and quant.",
    color: "ink",
    handle: "@junho",
    name: "Junho Lee",
  },
  {
    avatar: "YT",
    bio: "Diffusion + score-based · author of EDM 精读.",
    color: "green",
    handle: "@yuki",
    name: "Yuki Tanaka",
  },
];

export const communityTopics: readonly CommunityTopic[] = [
  { delta: "↑ 412%", label: "GRPO" },
  { delta: "↑ 184%", label: "Speculative-Decoding" },
  { delta: "NEW", label: "FlashAttention-3", status: "new" },
  { delta: "↑ 92%", label: "DPO-vs-PPO" },
  { delta: "↑ 47%", label: "Mixtral-Routing" },
  { delta: "↑ 31%", label: "KV-Cache-Quant" },
  { delta: "--", label: "EDM" },
  { delta: "↑ 18%", label: "Reward-Hacking" },
];

export const communityReadingSessions: readonly CommunityReadingSession[] = [
  {
    meta: "37 attending · you RSVPed",
    time: "Tomorrow · 21:00 CST",
    title: "Speculative Decoding 接受率分析 · Asia 精读群",
    tone: "ink",
  },
  {
    meta: "68 attending · 4 from your network",
    time: "Sat · 10:00 PT",
    title: "FlashAttention-3 walkthrough · open mic",
    tone: "amber",
  },
  {
    meta: '14 attending · open · "bring your laptop"',
    time: "Next Wed · 20:00 CST",
    title: "Mixtral 路由实现 · live code-along",
    tone: "green",
  },
];
