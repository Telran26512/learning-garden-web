export type PortfolioTabKey =
  | "overview"
  | "tracks"
  | "notes"
  | "papers"
  | "experiments"
  | "graph";

export type ContributionFilter = "notes" | "cards" | "commits" | "all";

export type ContributionEntry = {
  date: string;
  count: number;
  kind: Exclude<ContributionFilter, "all">;
  level: 0 | 1 | 2 | 3 | 4;
};

export type PortfolioTab = {
  count?: number;
  href: string;
  key: PortfolioTabKey;
  label: string;
};

export type PortfolioTrack = {
  accent: "ink" | "amber" | "purple" | "green" | "yellow";
  blocks: number;
  description: string;
  links: number;
  notes: number;
  papers: number;
  progress: number;
  reach: string;
  status: "shipped" | "in progress" | "draft";
  title: string;
  updated: string;
  visibility: "public" | "unlisted";
};

export type PortfolioActivity = {
  accent: "ink" | "green" | "amber";
  action: string;
  target: string;
  time: string;
};

export type PortfolioNoteKind = "math" | "code" | "paper" | "text";

export type PortfolioNote = {
  blocks: string;
  excerpt: string;
  kind: PortfolioNoteKind;
  links: string;
  time: string;
  title: string;
  track: string;
};

export type PortfolioPaper = {
  arxiv: string;
  authors: string;
  highlights?: number;
  notes?: number;
  progress?: number;
  tags: readonly string[];
  time?: string;
  title: string;
  venue: string;
  year: string;
};

export type PortfolioPaperColumn = {
  count: number;
  key: "queued" | "reading" | "done";
  label: string;
  papers: readonly PortfolioPaper[];
};

export type PortfolioExperimentStatus =
  | "running"
  | "done"
  | "failed"
  | "queued";

export type PortfolioExperiment = {
  branch: string;
  curve: readonly number[];
  hypothesis: string;
  index: string;
  metricLabel: string;
  metricValue: string;
  name: string;
  progress?: number;
  status: PortfolioExperimentStatus;
  when: string;
};

export type GraphNodeType = PortfolioNoteKind | "hub";

export type PortfolioGraphNode = {
  focused?: boolean;
  id: string;
  label?: string;
  r: number;
  type: GraphNodeType;
  x: number;
  y: number;
};

export type PortfolioGraphEdge = readonly [source: string, target: string];

export const portfolioProfile = {
  avatar: "X",
  avatarImageSrc: "/portfolio-avatar.jpg",
  bio: "ML 工程师 · 在做 RLHF / inference 优化。把每一次“想通”的瞬间记下来,从论文走到推导再走到代码。",
  coverImageSrc: "/portfolio-cover.jpg",
  currentWriting: "PPO from Bellman to Implementation.",
  email: "z***i@gmail.com",
  github: "github/zhe-li",
  githubIconSrc: "/github-mark.svg",
  handle: "@zhe-li",
  joined: "2024.03",
  location: "上海",
  name: "Xiaobin Cao",
  site: "zhe-li.dev",
};

export const portfolioTabs = [
  { href: "/app?view=portfolio", key: "overview", label: "Overview" },
  {
    count: 8,
    href: "/app?view=portfolio&tab=tracks",
    key: "tracks",
    label: "Tracks",
  },
  {
    count: 142,
    href: "/app?view=portfolio&tab=notes",
    key: "notes",
    label: "Notes",
  },
  {
    count: 27,
    href: "/app?view=portfolio&tab=papers",
    key: "papers",
    label: "Papers",
  },
  {
    count: 12,
    href: "/app?view=portfolio&tab=experiments",
    key: "experiments",
    label: "Experiments",
  },
  { href: "/app?view=portfolio&tab=graph", key: "graph", label: "Graph" },
] as const satisfies readonly PortfolioTab[];

export const contributionFilters: readonly {
  key: ContributionFilter;
  label: string;
}[] = [
  { key: "notes", label: "Notes" },
  { key: "cards", label: "Cards" },
  { key: "commits", label: "Commits" },
  { key: "all", label: "All" },
];

export const portfolioStats = [
  { label: "Notes", value: "142" },
  { label: "Tracks", value: "8" },
  { label: "Block Links", value: "247" },
  { label: "Followers", value: "324" },
  { label: "Following", value: "89" },
  { label: "Total ↑", value: "1.2k" },
] as const;

export const portfolioTracks: readonly PortfolioTrack[] = [
  {
    accent: "ink",
    blocks: 24,
    description:
      "从 Q/K/V 的几何意义出发,到 Pre-LN/Post-LN 稳定性、FlashAttention 的 IO 计数。整轨道的“地图”。",
    links: 31,
    notes: 8,
    papers: 5,
    progress: 100,
    reach: "412↑",
    status: "shipped",
    title: "Transformer 精读",
    updated: "3 days ago",
    visibility: "public",
  },
  {
    accent: "ink",
    blocks: 47,
    description:
      "从值函数到 GAE,再到 clip / KL 的工程实现。目标是写到能跑通 CleanRL 的伪代码级别。",
    links: 68,
    notes: 12,
    papers: 4,
    progress: 65,
    reach: "213↑",
    status: "in progress",
    title: "PPO from Bellman to Implementation",
    updated: "2 hrs ago",
    visibility: "public",
  },
  {
    accent: "amber",
    blocks: 9,
    description:
      "overflow / underflow / LogSumExp / online softmax,以及它们怎么进到 fused kernel 里去。",
    links: 12,
    notes: 4,
    papers: 1,
    progress: 100,
    reach: "96↑",
    status: "shipped",
    title: "Softmax / Numerical Stability",
    updated: "12 days ago",
    visibility: "public",
  },
  {
    accent: "yellow",
    blocks: 18,
    description:
      "从 PPO 到 GRPO,group baseline 的 variance 直觉,以及 tiny-llama 上的复现笔记。",
    links: 21,
    notes: 6,
    papers: 2,
    progress: 38,
    reach: "",
    status: "draft",
    title: "GRPO 复现 · Draft",
    updated: "yesterday",
    visibility: "unlisted",
  },
  {
    accent: "purple",
    blocks: 22,
    description: "DDPM → DDIM → score matching → SDE 视角。一条不绕弯的路径。",
    links: 34,
    notes: 7,
    papers: 6,
    progress: 100,
    reach: "178↑",
    status: "shipped",
    title: "Diffusion 入门 → SDE",
    updated: "18 days ago",
    visibility: "public",
  },
  {
    accent: "purple",
    blocks: 11,
    description:
      "Top-k routing、aux loss 的几何含义、Mixtral 的稀疏前向。一个 toy router 跑起来。",
    links: 9,
    notes: 3,
    papers: 3,
    progress: 22,
    reach: "",
    status: "draft",
    title: "MoE: Routing & Load Balance",
    updated: "5 days ago",
    visibility: "unlisted",
  },
  {
    accent: "green",
    blocks: 14,
    description:
      "从 IO-aware 的 motivation 到 tile/block 切分,再到 Triton kernel 一行行读。",
    links: 19,
    notes: 5,
    papers: 2,
    progress: 100,
    reach: "287↑",
    status: "shipped",
    title: "Flash Attention 拆解",
    updated: "1 month ago",
    visibility: "public",
  },
  {
    accent: "green",
    blocks: 28,
    description:
      "vLLM 的 paged attention、INT8 KV 量化、连续 batch 的工程踩坑。",
    links: 41,
    notes: 9,
    papers: 3,
    progress: 78,
    reach: "154↑",
    status: "in progress",
    title: "KV Cache · Quant · Paging",
    updated: "4 days ago",
    visibility: "public",
  },
];

export const pinnedTracks = portfolioTracks.slice(0, 4);

export const notes: readonly PortfolioNote[] = [
  {
    blocks: "3 blocks",
    excerpt:
      "把 Q·Kᵀ 看作“查询向量在键空间上的投影”,√d_k 是为了让 dot product 的方差与维度脱钩。",
    kind: "text",
    links: "7 links",
    time: "昨天",
    title: "Scaled Dot-Product 的几何直觉",
    track: "Transformer 精读",
  },
  {
    blocks: "2 blocks",
    excerpt:
      "假设 q,k 各分量独立同分布,Var(qᵀk)=d_k·σ⁴。所以除以 √d_k 让方差归一。",
    kind: "math",
    links: "4 links",
    time: "2 days",
    title: "Why √dₖ? Variance derivation",
    track: "Transformer 精读",
  },
  {
    blocks: "2 blocks",
    excerpt:
      "softmax(x)=softmax(x−max(x))。看起来是数值小技巧,其实是 LogSumExp 的不变性。",
    kind: "math",
    links: "6 links",
    time: "5 days",
    title: "Softmax: shifting trick for stability",
    track: "Softmax / Numerical Stability",
  },
  {
    blocks: "4 blocks",
    excerpt:
      "为什么 LSE 是 attention kernel 里第一等公民:它能 streaming,能合并 partial 结果。",
    kind: "math",
    links: "9 links",
    time: "5 days",
    title: "LogSumExp 与 fused softmax kernel",
    track: "Softmax / Numerical Stability",
  },
  {
    blocks: "3 blocks",
    excerpt:
      "PPO 里的 β·KL 不是为了“更像参考”,而是把策略限制在 ref 的支持集附近。",
    kind: "text",
    links: "5 links",
    time: "1 week",
    title: "Reference Model 的 KL 项究竟在约束什么",
    track: "PPO from Bellman",
  },
  {
    blocks: "5 blocks",
    excerpt: "λ=0 → TD(0),低方差高偏差。λ=1 → MC,无偏但高方差。",
    kind: "math",
    links: "8 links",
    time: "2 weeks",
    title: "GAE λ 的 bias-variance trade-off",
    track: "PPO from Bellman",
  },
  {
    blocks: "1 block · 142 lines",
    excerpt:
      "从 m_i, l_i 两个 running 统计量讲起,讲到 tl.maximum / tl.exp 的 broadcast 语义。",
    kind: "code",
    links: "11 links",
    time: "3 days",
    title: "Triton kernel: online softmax,逐行注释",
    track: "Flash Attention 拆解",
  },
  {
    blocks: "6 blocks",
    excerpt:
      "把反向 ODE 写成关于 log-SNR 的半线性形式之后,指数积分器自然就出来了。",
    kind: "math",
    links: "3 links",
    time: "1 week",
    title: "DPM-Solver 单步推导",
    track: "Diffusion 入门 → SDE",
  },
  {
    blocks: "2 blocks · 91 lines",
    excerpt:
      "top-1 router、capacity factor、辅助 load-balance loss。一个 90 行的 toy 实现。",
    kind: "code",
    links: "2 links",
    time: "2 weeks",
    title: "Switch Transformer 的路由实现",
    track: "MoE: Routing & Load Balance",
  },
  {
    blocks: "5 blocks",
    excerpt:
      "把 KV cache 类比成 OS 的 paged memory,fragmentation 问题就清晰了。",
    kind: "paper",
    links: "6 links",
    time: "4 days",
    title: "KV cache 分页式管理 · vLLM 读后",
    track: "KV Cache · Quant · Paging",
  },
  {
    blocks: "3 blocks · 68 lines",
    excerpt:
      "draft 模型给出 k 个 token,target 一次前向接收/拒绝。算法很短但实现里有几个对齐细节。",
    kind: "code",
    links: "4 links",
    time: "1 week",
    title: "Speculative Decoding · 验证步",
    track: "Inference 优化",
  },
  {
    blocks: "2 blocks",
    excerpt:
      "把 residual stream 想成逐层放大的信号通路,Pre-LN 让每一层只看 normalized 的输入。",
    kind: "text",
    links: "5 links",
    time: "2 weeks",
    title: "为什么 LayerNorm 在 Pre-LN 更稳",
    track: "Transformer 精读",
  },
];

export const paperColumns: readonly PortfolioPaperColumn[] = [
  {
    count: 5,
    key: "queued",
    label: "Queued",
    papers: [
      {
        arxiv: "2106.09685",
        authors: "Hu et al.",
        tags: ["PEFT", "finetuning"],
        time: "queued 4d ago",
        title: "LoRA: Low-Rank Adaptation of Large Language Models",
        venue: "ICLR",
        year: "2022",
      },
      {
        arxiv: "2305.14314",
        authors: "Dettmers et al.",
        tags: ["PEFT", "quant"],
        time: "queued 1w ago",
        title: "QLoRA: Efficient Finetuning of Quantized LLMs",
        venue: "NeurIPS",
        year: "2023",
      },
      {
        arxiv: "2401.04088",
        authors: "Jiang et al.",
        tags: ["MoE", "sparse"],
        time: "queued 1w ago",
        title: "Mixtral of Experts",
        venue: "preprint",
        year: "2024",
      },
      {
        arxiv: "2211.17192",
        authors: "Leviathan et al.",
        tags: ["inference"],
        time: "queued 2w ago",
        title: "Speculative Decoding · Fast Inference",
        venue: "ICML",
        year: "2023",
      },
      {
        arxiv: "2212.08073",
        authors: "Bai et al.",
        tags: ["RLHF", "safety"],
        time: "queued 3w ago",
        title: "Constitutional AI: Harmlessness from AI Feedback",
        venue: "preprint",
        year: "2022",
      },
    ],
  },
  {
    count: 4,
    key: "reading",
    label: "Reading",
    papers: [
      {
        arxiv: "2402.03300",
        authors: "Shao et al.",
        highlights: 18,
        notes: 4,
        progress: 62,
        tags: ["RL", "RLHF", "GRPO 复现"],
        title: "Group Relative Policy Optimization (GRPO)",
        venue: "DeepSeek",
        year: "2024",
      },
      {
        arxiv: "2307.08691",
        authors: "Dao",
        highlights: 24,
        notes: 3,
        progress: 80,
        tags: ["attention", "CUDA"],
        title: "FlashAttention-2: Faster Attention with Better Parallelism",
        venue: "preprint",
        year: "2023",
      },
      {
        arxiv: "2011.13456",
        authors: "Song et al.",
        highlights: 11,
        notes: 2,
        progress: 45,
        tags: ["diffusion", "SDE"],
        title: "Score-based Generative Modeling via SDEs",
        venue: "ICLR",
        year: "2021",
      },
      {
        arxiv: "2206.00927",
        authors: "Lu et al.",
        highlights: 6,
        notes: 1,
        progress: 30,
        tags: ["diffusion", "solver"],
        title: "DPM-Solver: Fast Sampling of Diffusion Models",
        venue: "NeurIPS",
        year: "2022",
      },
    ],
  },
  {
    count: 18,
    key: "done",
    label: "Done",
    papers: [
      {
        arxiv: "1706.03762",
        authors: "Vaswani et al.",
        highlights: 42,
        notes: 6,
        tags: ["seminal", "transformer"],
        title: "Attention Is All You Need",
        venue: "NeurIPS",
        year: "2017",
      },
      {
        arxiv: "1707.06347",
        authors: "Schulman et al.",
        highlights: 31,
        notes: 5,
        tags: ["RL", "policy-grad"],
        title: "Proximal Policy Optimization Algorithms",
        venue: "preprint",
        year: "2017",
      },
      {
        arxiv: "1506.02438",
        authors: "Schulman et al.",
        highlights: 19,
        notes: 3,
        tags: ["RL", "advantage"],
        title: "High-Dimensional Continuous Control · GAE",
        venue: "ICLR",
        year: "2016",
      },
      {
        arxiv: "2305.18290",
        authors: "Rafailov et al.",
        highlights: 22,
        notes: 4,
        tags: ["RLHF", "alignment"],
        title: "Direct Preference Optimization",
        venue: "NeurIPS",
        year: "2023",
      },
      {
        arxiv: "2309.06180",
        authors: "Kwon et al.",
        highlights: 17,
        notes: 4,
        tags: ["inference", "KV-cache"],
        title: "vLLM: Efficient Memory Mgmt for LLM Serving",
        venue: "SOSP",
        year: "2023",
      },
      {
        arxiv: "2101.03961",
        authors: "Fedus et al.",
        highlights: 14,
        notes: 2,
        tags: ["MoE", "routing"],
        title: "Switch Transformer",
        venue: "JMLR",
        year: "2022",
      },
      {
        arxiv: "2006.11239",
        authors: "Ho et al.",
        highlights: 20,
        notes: 3,
        tags: ["diffusion", "seminal"],
        title: "Denoising Diffusion Probabilistic Models",
        venue: "NeurIPS",
        year: "2020",
      },
      {
        arxiv: "2205.14135",
        authors: "Dao et al.",
        highlights: 28,
        notes: 4,
        tags: ["attention", "systems"],
        title: "FlashAttention: IO-Aware Exact Attention",
        venue: "NeurIPS",
        year: "2022",
      },
    ],
  },
];

export const portfolioExperiments: readonly PortfolioExperiment[] = [
  {
    branch: "exp/grpo-baseline · seed 42",
    curve: [30, 28, 26, 22, 20, 16, 14, 11, 9, 8, 7],
    hypothesis: "GRPO 在 1B 模型上能否 match PPO 的 reward 曲线?",
    index: "01",
    metricLabel: "reward vs ref · step 4200",
    metricValue: "+8.7%",
    name: "grpo-tiny-llama-r3",
    progress: 52,
    status: "running",
    when: "2h ago",
  },
  {
    branch: "exp/spec-decoding",
    curve: [32, 28, 30, 22, 18, 14, 12, 11],
    hypothesis: "7B draft + 70B target 的接受率能否超过 60%?",
    index: "02",
    metricLabel: "accept rate",
    metricValue: "67.2%",
    name: "speculative-draft-7b",
    progress: 81,
    status: "running",
    when: "5h ago",
  },
  {
    branch: "exp/fa2-cuda · A100",
    curve: [28, 22, 18, 16, 15, 14],
    hypothesis: "把 Triton 版本搬到原生 CUDA,end-to-end 是否仍有 1.8× speedup?",
    index: "03",
    metricLabel: "throughput vs baseline",
    metricValue: "1.74×",
    name: "flashattn2-port-cuda",
    progress: 94,
    status: "running",
    when: "1d ago",
  },
  {
    branch: "main · seed 0..4",
    curve: [34, 30, 24, 18, 12, 9, 8, 8, 8],
    hypothesis: "在 cartpole 上能稳定复现 reward>195 吗?",
    index: "04",
    metricLabel: "avg reward · 5 seeds",
    metricValue: "198.4",
    name: "ppo-cleanrl-baseline",
    status: "done",
    when: "3d ago",
  },
  {
    branch: "exp/online-softmax",
    curve: [30, 24, 18, 14, 11, 9, 8],
    hypothesis: "single-pass online softmax 在长序列上是否更快?",
    index: "05",
    metricLabel: "vs naive · seq=8192",
    metricValue: "3.21×",
    name: "triton-online-softmax",
    status: "done",
    when: "5d ago",
  },
  {
    branch: "exp/kv-paging",
    curve: [30, 26, 22, 18, 14, 12, 10, 9],
    hypothesis: "分页式 KV 在高 batch 下能否减小 fragmentation?",
    index: "06",
    metricLabel: "throughput · bs=64",
    metricValue: "2.08×",
    name: "kv-cache-paging-bench",
    status: "done",
    when: "1w ago",
  },
  {
    branch: "exp/ddpm-mnist",
    curve: [12, 16, 22, 26, 28, 29, 30],
    hypothesis: "从零实现 DDPM,能在 MNIST 上达到 FID<10 吗?",
    index: "07",
    metricLabel: "FID · 50k samples",
    metricValue: "8.7",
    name: "ddpm-mnist-from-scratch",
    status: "done",
    when: "2w ago",
  },
  {
    branch: "exp/lora-rank · r∈{4,8,16,32,64}",
    curve: [28, 16, 11, 18, 26],
    hypothesis: "在指令微调上 LoRA rank 的甜蜜点在哪?",
    index: "08",
    metricLabel: "best val-loss 1.34",
    metricValue: "r=16",
    name: "lora-r-sweep",
    status: "done",
    when: "2w ago",
  },
  {
    branch: "exp/gae-lambda · λ∈[0,1]",
    curve: [28, 22, 16, 11, 10, 14, 22],
    hypothesis: "λ 对 bias-variance 的实际影响曲线?",
    index: "09",
    metricLabel: "best mean return",
    metricValue: "λ=0.95",
    name: "gae-lambda-sweep",
    status: "done",
    when: "3w ago",
  },
  {
    branch: "exp/softmax-fp16 · fp16",
    curve: [30, 28, 24, 8, 30, 28, 26],
    hypothesis: "在 fp16 上能否稳定复现 softmax overflow 并定位?",
    index: "10",
    metricLabel: "resolved in #f2a1",
    metricValue: "+ fix",
    name: "softmax-overflow-repro",
    status: "done",
    when: "1mo ago",
  },
  {
    branch: "exp/moe-router · 8 experts",
    curve: [28, 24, 22, 28, 32, 34],
    hypothesis: "无 aux loss 的 top-1 router 会自己学到负载均衡吗?",
    index: "11",
    metricLabel: "2 experts dominate",
    metricValue: "— —",
    name: "moe-router-toy",
    status: "failed",
    when: "3w ago",
  },
  {
    branch: "exp/dpo-baseline · pending GPU",
    curve: [19, 19],
    hypothesis: "同 preference data 下 DPO 是否比 PPO 更稳定?",
    index: "12",
    metricLabel: "queued for A100×8",
    metricValue: "— —",
    name: "dpo-vs-ppo-pref",
    status: "queued",
    when: "scheduled",
  },
];

export const graphNodes: readonly PortfolioGraphNode[] = [
  { id: "tx", label: "Transformer", r: 9, type: "hub", x: 280, y: 220 },
  { id: "rl", label: "PPO · RLHF", r: 9, type: "hub", x: 720, y: 240 },
  { id: "sf", label: "Softmax · FA", r: 9, type: "hub", x: 200, y: 500 },
  { id: "df", label: "Diffusion · SDE", r: 9, type: "hub", x: 540, y: 560 },
  { id: "inf", label: "Inference · KV", r: 9, type: "hub", x: 820, y: 520 },
  {
    focused: true,
    id: "n1",
    label: "Scaled Dot-Product 的几何直觉",
    r: 7,
    type: "text",
    x: 170,
    y: 240,
  },
  { id: "n2", r: 4, type: "math", x: 220, y: 205 },
  { id: "n3", r: 5, type: "paper", x: 310, y: 260 },
  { id: "n4", r: 3, type: "code", x: 350, y: 210 },
  { id: "n5", r: 4, type: "text", x: 245, y: 305 },
  { id: "n6", r: 5, type: "math", x: 205, y: 620 },
  { id: "n7", r: 3, type: "code", x: 145, y: 530 },
  { id: "n8", r: 4, type: "text", x: 305, y: 585 },
  { id: "n9", r: 5, type: "paper", x: 500, y: 625 },
  { id: "n10", r: 3, type: "math", x: 612, y: 612 },
  { id: "n11", r: 4, type: "code", x: 610, y: 520 },
  { id: "n12", r: 4, type: "math", x: 684, y: 278 },
  { id: "n13", r: 5, type: "paper", x: 648, y: 236 },
  { id: "n14", r: 3, type: "code", x: 775, y: 330 },
  { id: "n15", r: 4, type: "text", x: 805, y: 290 },
  { id: "n16", r: 5, type: "text", x: 842, y: 420 },
  { id: "n17", r: 4, type: "code", x: 890, y: 592 },
  { id: "n18", r: 3, type: "math", x: 760, y: 612 },
  { id: "n19", r: 5, type: "paper", x: 420, y: 410 },
  { id: "n20", r: 3, type: "text", x: 118, y: 420 },
];

export const graphEdges: readonly PortfolioGraphEdge[] = [
  ["n1", "tx"],
  ["n1", "n2"],
  ["n1", "n3"],
  ["n1", "n5"],
  ["n2", "tx"],
  ["n3", "tx"],
  ["n4", "tx"],
  ["n5", "tx"],
  ["n6", "sf"],
  ["n7", "sf"],
  ["n8", "sf"],
  ["n6", "n8"],
  ["n9", "df"],
  ["n10", "df"],
  ["n11", "df"],
  ["n9", "n10"],
  ["n12", "rl"],
  ["n13", "rl"],
  ["n14", "rl"],
  ["n15", "rl"],
  ["n12", "n13"],
  ["n16", "inf"],
  ["n17", "inf"],
  ["n18", "inf"],
  ["n16", "n18"],
  ["tx", "rl"],
  ["tx", "sf"],
  ["rl", "inf"],
  ["sf", "inf"],
  ["df", "sf"],
  ["df", "rl"],
  ["n19", "df"],
  ["n19", "tx"],
  ["n20", "sf"],
  ["n20", "n1"],
  ["n10", "inf"],
];

export const recentActivities: readonly PortfolioActivity[] = [
  {
    accent: "green",
    action: "published",
    target: "Scaled Dot-Product 的几何直觉",
    time: "昨天",
  },
  {
    accent: "ink",
    action: "linked",
    target: "PPO clipped objective → policy gradient",
    time: "2 天前",
  },
  {
    accent: "amber",
    action: "updated",
    target: "Softmax / Numerical Stability",
    time: "5 天前",
  },
];

export const blockDistribution = [
  { color: "#75E3B1", count: 68, label: "math", percent: 25 },
  { color: "#FFC247", count: 41, label: "code", percent: 15 },
  { color: "#9BC7FF", count: 27, label: "paper", percent: 10 },
  { color: "#53C7F5", count: 134, label: "text", percent: 50 },
] as const;

export const topTopics = [
  ["Transformer", 28],
  ["RL", 24],
  ["PPO", 18],
  ["论文精读", 16],
  ["Optimization", 12],
  ["Math", 11],
  ["Diffusion", 8],
  ["MoE", 5],
] as const;

const heatmapStart = Date.UTC(2025, 4, 15);
const dayMs = 24 * 60 * 60 * 1000;

export const contributionEntries: readonly ContributionEntry[] = Array.from(
  { length: 53 * 7 },
  (_, index) => {
    const date = new Date(heatmapStart + index * dayMs)
      .toISOString()
      .slice(0, 10);
    const inactive = index % 7 === 0 || index % 8 === 0 || index % 22 === 0;
    const rawCount = inactive
      ? 0
      : 1 + ((index * 7 + (index % 5) + (index % 29 > 20 ? 2 : 0)) % 8);
    const level = Math.min(4, Math.ceil(rawCount / 2)) as 0 | 1 | 2 | 3 | 4;
    const kind =
      index % 5 === 0 ? "commits" : index % 3 === 0 ? "cards" : "notes";

    return {
      count: rawCount,
      date,
      kind,
      level,
    };
  },
);

export function filterContributionEntries(filter: ContributionFilter) {
  if (filter === "all") {
    return contributionEntries;
  }

  return contributionEntries.filter((entry) => entry.kind === filter);
}

export function buildContributionWeeks(filter: ContributionFilter) {
  return Array.from({ length: 53 }, (_, weekIndex) =>
    contributionEntries
      .slice(weekIndex * 7, weekIndex * 7 + 7)
      .map((entry) =>
        filter === "all" || entry.kind === filter
          ? entry
          : { ...entry, count: 0, level: 0 as const },
      ),
  );
}

export function countActiveContributionDays(filter: ContributionFilter) {
  return buildContributionWeeks(filter)
    .flat()
    .filter((entry) => entry.count > 0).length;
}
