import type { StudioDraft } from "./studio-editor-model";

export const contentTypes = [
  ["Concept", "思想 / 推导 / 直觉", true],
  ["Paper Note", "论文阅读笔记", false],
  ["Experiment", "实验日志 / 复现", false],
  ["Journal", "日记 / 周记", false],
] as const;

export const visibilityOptions = [
  ["Private", "·"],
  ["Unlisted", "↗"],
  ["Public", "○"],
] as const;

export const roadmapOptions = {
  stage: [
    "Stage 1 · Foundations",
    "Stage 2 · Deep Learning",
    "Stage 3 · Systems",
  ],
  track: ["Transformer 精读", "NLP 工程", "Representation Learning"],
  week: ["W2 · Attention 基础", "W3 · Transformer 精读", "W4 · Encoder 实现"],
} as const;

const markdownSource = `# Multi-Head Attention

> 把单头注意力拆成 \`h\` 个并行的子空间,再 concat。

## §1 直觉

单个 attention 头只能学到 ::concept[一种相似度结构],
多头让模型同时学习 ::concept[位置 / 句法 / 语义] 等不同的对齐方式。

## §2 推导 (3 步)

::math
\\\\text{head}_i = \\\\text{Attention}(QW_i^Q, KW_i^K, VW_i^V) \\\\\\\\
\\\\text{MultiHead}(Q,K,V) = \\\\text{Concat}(\\\\text{head}_1,\\\\dots,\\\\text{head}_h) W^O
::

每步用 \\\\\\\\ 切分,会成为独立锚点,可被外部 Note Link 指向。

## §3 代码

::code{lang=python ref=attention.py#L34-L58}

::card{front="Multi-Head 拆分维度是?" back="d_model = h × d_k"}

::paper{ref=1706.03762 anchor=§3.2.2}`;

export const initialDrafts: StudioDraft[] = [
  {
    allowComments: true,
    allowDerivatives: true,
    contentType: "Concept",
    history: [
      {
        id: "version-1",
        label: "12 分钟前",
        markdown: "# Multi-Head Attention\n\n## 初稿\n\n单头到多头的推导。",
        summary: "初版结构草稿。",
        title: "Multi-Head Attention",
      },
      {
        id: "version-2",
        label: "4 分钟前",
        markdown: markdownSource,
        summary:
          "把 Q,K,V 各自线性投影 h 次,得到 h 组并行的 attention,再 concat 投影。",
        title: "Multi-Head Attention",
      },
    ],
    id: "draft-1",
    license: "CC BY-SA 4.0",
    markdown: markdownSource,
    relationships: [
      {
        icon: "⟶",
        id: "rel-1",
        rel: "derives_from",
        target: "Attention §3.2.1",
      },
      {
        icon: "≡",
        id: "rel-2",
        rel: "implements",
        target: "attention.py L34-L58",
      },
      { icon: "※", id: "rel-3", rel: "cites", target: "Vaswani 2017" },
    ],
    resources: [
      {
        icon: ">_",
        id: "res-1",
        kind: "code",
        name: "attention.py",
        source: "github · zhe-li/transformer",
      },
      {
        icon: "§",
        id: "res-2",
        kind: "pdf",
        name: "Vaswani 2017 · PDF",
        source: "arxiv.org · 1706.03762",
      },
      {
        icon: "{}",
        id: "res-3",
        kind: "notebook",
        name: "multi-head.ipynb",
        source: "colab",
      },
    ],
    roadmap: {
      stage: "Stage 2 · Deep Learning",
      track: "Transformer 精读",
      week: "W3 · Transformer 精读",
    },
    slug: "multi-head-attention",
    status: "draft",
    summary:
      "把 Q,K,V 各自线性投影 h 次,得到 h 组并行的 attention,再 concat 投影。本节给出从单头到多头的逐步推导,并对应到 attention.py L34-L58 的实现。",
    tags: ["transformer", "attention", "multi-head", "nlp", "论文精读"],
    title: "Multi-Head Attention",
    updatedAtLabel: "4s ago",
    visibility: "Public",
  },
  {
    allowComments: false,
    allowDerivatives: true,
    contentType: "Concept",
    history: [],
    id: "draft-2",
    license: "CC BY-SA 4.0",
    markdown:
      "# Softmax 数值稳定性\n\n## 直觉\n\n先减去 max logit,再做 exp,避免溢出。",
    relationships: [],
    resources: [],
    roadmap: {
      stage: "Stage 2 · Deep Learning",
      track: "Transformer 精读",
      week: "W3 · Transformer 精读",
    },
    slug: "softmax",
    status: "draft",
    summary: "记录 softmax 的数值稳定写法和 log-sum-exp 关系。",
    tags: ["softmax", "numerics"],
    title: "Softmax 数值稳定性",
    updatedAtLabel: "昨天",
    visibility: "Private",
  },
  {
    allowComments: true,
    allowDerivatives: false,
    contentType: "Paper Note",
    history: [],
    id: "draft-3",
    license: "CC BY-SA 4.0",
    markdown: "# RoFormer 阅读\n\n::paper{ref=2104.09864 anchor=RoPE}",
    relationships: [],
    resources: [
      {
        icon: "§",
        id: "res-1",
        kind: "pdf",
        name: "RoFormer · PDF",
        source: "arxiv.org · 2104.09864",
      },
    ],
    roadmap: {
      stage: "Stage 2 · Deep Learning",
      track: "Transformer 精读",
      week: "W4 · Encoder 实现",
    },
    slug: "roformer",
    status: "draft",
    summary: "RoPE 位置编码阅读笔记。",
    tags: ["rope", "paper"],
    title: "RoFormer 阅读",
    updatedAtLabel: "3 天前",
    visibility: "Unlisted",
  },
  {
    allowComments: true,
    allowDerivatives: true,
    contentType: "Journal",
    history: [],
    id: "draft-4",
    license: "CC BY-SA 4.0",
    markdown: "# Adam 推导稿\n\n## 目标\n\n把一阶矩和二阶矩校正写清楚。",
    relationships: [],
    resources: [],
    roadmap: {
      stage: "Stage 1 · Foundations",
      track: "Representation Learning",
      week: "W2 · Attention 基础",
    },
    slug: "adam",
    status: "draft",
    summary: "Adam bias correction 推导草稿。",
    tags: ["optimizer"],
    title: "Adam 推导稿",
    updatedAtLabel: "上周",
    visibility: "Private",
  },
];
