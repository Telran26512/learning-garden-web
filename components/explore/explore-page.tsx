"use client";

import { useMemo, useState } from "react";

const discoverItems = [
  { id: "trending", label: "Trending", mark: "↑" },
  { id: "latest", label: "Latest", mark: "new" },
  { id: "following", label: "Following", mark: "••" },
  { id: "graph", label: "Knowledge Graph", mark: "link" },
  { id: "papers", label: "Papers", mark: "§" },
] as const;

const tagStats = [
  ["Transformer", "1,284"],
  ["Reinforcement-Learning", "962"],
  ["Diffusion-Model", "781"],
  ["Linear-Algebra", "524"],
  ["Optimization", "412"],
  ["MoE", "318"],
  ["RLHF", "287"],
] as const;

const feedTabs = ["Trending", "Latest", "Following", "Tags"] as const;
const ranges = ["24h", "7d", "30d", "all"] as const;

const feedItems = [
  {
    author: "Aria Chen",
    avatar: "A",
    color: "bg-[var(--syn-accent)]",
    handle: "@aria-chen",
    meta: "2 小时前 · in 扩散模型推导精读",
    title: 'DDIM 是不是 DDPM 的"确定性版本"? —— 从 reverse process 重写',
    body: "把 DDPM 的 q(x_t-1 | x_t, x_0) 重写为非马尔可夫形式,DDIM 的 σ_t=0 退化即是确定性采样。本节给出从 §4.1 推到 σ_t 的完整 12 步。",
    votes: 187,
    comments: 24,
    cites: 6,
    tags: ["Diffusion", "论文精读"],
    swatches: ["math", "paper", "math"],
  },
  {
    author: "齐欣",
    avatar: "齐",
    color: "bg-[#8A5B45]",
    handle: "@qixin",
    meta: "5 小时前 · in Transformer 精读",
    title: "KV-Cache 到底省了什么: 逐 token 复杂度重算",
    body: "把 prefill / decode 两阶段拆开,每 token 的 FLOPs 与 HBM 读写都列成表。结论: KV-Cache 主要降的是 HBM 带宽,FLOPs 反而几乎不变。",
    votes: 142,
    comments: 18,
    cites: 9,
    tags: ["Transformer", "推理优化"],
    swatches: ["paper", "code"],
  },
  {
    author: "Shubham R.",
    avatar: "S",
    color: "bg-[#7A7066]",
    handle: "@shubham-r",
    meta: "昨天 · in Linear Algebra Done Right",
    title: "SVD 的几何直觉: 椭球、投影和低秩近似",
    body: "从单位圆被线性变换成椭圆开始,把 UΣVᵀ 拆成三次空间变换。最后用 rank-k approximation 解释 LoRA 的低秩约束。",
    votes: 98,
    comments: 12,
    cites: 4,
    tags: ["Linear Algebra", "LoRA"],
    swatches: ["paper", "math", "code"],
  },
] as const;

const tracks = [
  ["01", "GRPO 实战日志", "@maxwell-tu", "↑412"],
  ["02", "Diffusion 全景手册", "@aria-chen", "↑287"],
  ["03", "PPO from Bellman", "@zhe-li", "↑213"],
  ["04", "Axler 习题集", "@shubham-r", "↑154"],
] as const;

const papers = [
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
] as const;

const people = [
  ["Maxwell Tu", "@maxwell-tu", "RLHF · 12 Notes", "bg-[var(--syn-accent)]"],
  ["Aria Chen", "@aria-chen", "Diffusion · 18 Notes", "bg-[#8A5B45]"],
  ["Sho Tanaka", "@sho-t", "NLP · 22 Notes", "bg-[#7A7066]"],
] as const;

export function ExplorePage() {
  const [activeDiscover, setActiveDiscover] = useState("trending");
  const [activeTab, setActiveTab] =
    useState<(typeof feedTabs)[number]>("Trending");
  const [activeRange, setActiveRange] = useState<(typeof ranges)[number]>("7d");
  const [followed, setFollowed] = useState<string[]>([]);
  const filteredFeed = useMemo(() => {
    if (activeTab === "Latest") return [...feedItems].reverse();
    if (activeTab === "Following") return feedItems.slice(0, 2);
    if (activeTab === "Tags")
      return feedItems.filter((item) => item.tags.length);
    return feedItems;
  }, [activeTab]);

  return (
    <section className="syn-reading-mode grid min-h-[calc(100dvh-3.5rem)] min-w-[1200px] grid-cols-[260px_minmax(0,1fr)_330px]">
      <ExploreSidebar
        activeDiscover={activeDiscover}
        onDiscoverChange={setActiveDiscover}
      />

      <main className="min-w-0 overflow-auto px-12 py-12">
        <div className="mx-auto max-w-[940px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="syn-title text-[52px] leading-none text-[var(--syn-reading-ink)]">
                Explore
              </h1>
              <p className="mt-4 max-w-[520px] text-[16px] leading-[1.75] text-[var(--syn-reading-secondary)]">
                看正在被认真讨论的学习历程。
              </p>
            </div>
            <p className="mt-5 text-right font-mono text-[11px] text-[var(--syn-reading-muted)]">
              past 7 days · weighted
            </p>
          </div>

          <div className="mt-10 flex items-end justify-between border-b border-[var(--syn-hairline-light)]">
            <div className="flex items-center gap-7">
              {feedTabs.map((tab) => (
                <button
                  className={[
                    "relative pb-3 text-[14px] transition",
                    activeTab === tab
                      ? "text-[var(--syn-reading-ink)] after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-full after:bg-[var(--syn-accent)]"
                      : "text-[var(--syn-reading-muted)] hover:text-[var(--syn-reading-ink)]",
                  ].join(" ")}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[12px] text-[var(--syn-reading-muted)]">
                Range
              </span>
              {ranges.map((range) => (
                <button
                  className={[
                    "h-7 rounded-[var(--syn-radius)] border px-2.5 font-mono text-[11px] transition",
                    activeRange === range
                      ? "border-[var(--syn-accent)] bg-[var(--syn-accent-soft)] text-[var(--syn-accent)]"
                      : "border-[var(--syn-hairline-light)] text-[var(--syn-reading-muted)] hover:text-[var(--syn-reading-ink)]",
                  ].join(" ")}
                  key={range}
                  onClick={() => setActiveRange(range)}
                  type="button"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <FeaturedTrack />

          <div className="mt-5 space-y-5">
            {filteredFeed.map((item) => (
              <FeedCard item={item} key={item.title} />
            ))}
          </div>
        </div>
      </main>

      <ExploreRail
        followed={followed}
        onFollowToggle={(name) =>
          setFollowed((items) =>
            items.includes(name)
              ? items.filter((item) => item !== name)
              : [...items, name],
          )
        }
      />
    </section>
  );
}

function ExploreSidebar({
  activeDiscover,
  onDiscoverChange,
}: {
  activeDiscover: string;
  onDiscoverChange: (id: string) => void;
}) {
  return (
    <aside className="min-h-0 overflow-auto border-r border-[var(--syn-hairline-light)] px-5 py-10">
      <SidebarHeading>Discover</SidebarHeading>
      <div className="space-y-1">
        {discoverItems.map((item) => (
          <button
            className={[
              "flex w-full items-center gap-3 rounded-[var(--syn-radius)] px-3 py-3 text-left transition",
              activeDiscover === item.id
                ? "bg-[var(--syn-accent-soft)] text-[var(--syn-accent)]"
                : "text-[var(--syn-reading-secondary)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            key={item.id}
            onClick={() => onDiscoverChange(item.id)}
            type="button"
          >
            <span className="w-8 font-mono text-[10px] text-[var(--syn-reading-muted)]">
              {item.mark}
            </span>
            <span className="text-[14px]">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <SidebarHeading>Tags</SidebarHeading>
        <div className="space-y-3">
          {tagStats.map(([tag, count]) => (
            <button
              className="flex w-full items-center justify-between gap-4 bg-transparent px-1 text-left text-[12px] text-[var(--syn-reading-secondary)] transition hover:text-[var(--syn-reading-ink)]"
              key={tag}
              type="button"
            >
              <span>#{tag}</span>
              <span className="font-mono text-[var(--syn-reading-muted)]">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-9 border-t border-[var(--syn-hairline-light)] pt-4">
        <div className="syn-kicker text-[var(--syn-reading-muted)]">TIP</div>
        <p className="mt-3 text-[12px] leading-6 text-[var(--syn-reading-secondary)]">
          关注一个 Tag, Feed 里会出现这个 Tag 下被高质量 cite 的新 Block。
        </p>
      </div>
    </aside>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="syn-kicker mb-3 px-1 text-[var(--syn-reading-muted)]">
      {children}
    </h2>
  );
}

function FeaturedTrack() {
  return (
    <article className="mt-8 grid overflow-hidden border-y border-[var(--syn-hairline-light)] bg-transparent lg:grid-cols-[1fr_300px]">
      <div className="py-8 pr-8">
        <div className="flex items-center gap-3">
          <span className="syn-kicker text-[var(--syn-accent)]">Featured</span>
          <span className="text-[12px] text-[var(--syn-reading-muted)]">
            本周编辑精选
          </span>
        </div>
        <h2 className="syn-title mt-5 text-[31px] leading-tight text-[var(--syn-reading-ink)]">
          GRPO 复现日志: 8x H100 上的 4 天
        </h2>
        <p className="mt-5 max-w-[620px] text-[16px] leading-[1.78] text-[var(--syn-reading-secondary)]">
          从 DeepSeekMath 提出的 GRPO 原理推导出发,跨过 ε-clip、KL 估计与
          advantage 归一化这三个工程坑,产出一份 320 行的 PyTorch + DeepSpeed
          复现。
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12px] text-[var(--syn-reading-muted)]">
          <span className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-[var(--syn-radius)] bg-[var(--syn-accent)] text-white" />
            @maxwell-tu
          </span>
          <span>3 Block · 2 Paper · 4 Code</span>
          <span>↑ 412</span>
          <span>38 comments</span>
          <span>12 cites</span>
        </div>
      </div>
      <div className="border-l border-[var(--syn-hairline-light)] py-8 pl-7">
        <div className="syn-kicker text-[var(--syn-reading-muted)]">
          Block 预览
        </div>
        <MiniChart />
        <button
          className="mt-12 h-10 w-full rounded-[var(--syn-radius)] border border-[var(--syn-accent)] text-[13px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)]"
          type="button"
        >
          查看 Track →
        </button>
      </div>
    </article>
  );
}

function MiniChart() {
  return (
    <svg
      aria-label="GRPO track score trend"
      className="mt-6 h-28 w-full text-[var(--syn-accent)]"
      role="img"
      viewBox="0 0 260 110"
    >
      <path
        d="M0 92 L0 18 L38 48 L72 58 L105 70 L143 74 L180 83 L222 90 L260 94 L260 110 L0 110 Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M0 18 L38 48 L72 58 L105 70 L143 74 L180 83 L222 90 L260 94"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function FeedCard({ item }: { item: (typeof feedItems)[number] }) {
  return (
    <article className="border-b border-[var(--syn-hairline-light)] py-7 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-[var(--syn-radius)] text-[13px] font-semibold text-white ${item.color}`}
          >
            {item.avatar}
          </span>
          <div className="min-w-0 text-[12px]">
            <span className="font-medium text-[var(--syn-reading-ink)]">
              {item.author}
            </span>
            <span className="ml-2 text-[var(--syn-reading-muted)]">
              {item.handle}
            </span>
            <span className="ml-2 text-[var(--syn-reading-muted)]">
              · {item.meta}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2 font-mono text-[10px] text-[var(--syn-reading-muted)]">
          {item.swatches.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      </div>

      <h3 className="syn-title mt-5 text-[26px] leading-snug text-[var(--syn-reading-ink)]">
        {item.title}
      </h3>
      <p className="mt-4 max-w-[760px] text-[15px] leading-[1.78] text-[var(--syn-reading-secondary)]">
        {item.body}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5 font-mono text-[12px] text-[var(--syn-reading-muted)]">
          <span>↑ {item.votes}</span>
          <span>● {item.comments}</span>
          <span>↗ {item.cites} cites</span>
        </div>
        <div className="flex flex-wrap gap-x-2 text-[12px] text-[var(--syn-reading-muted)]">
          {item.tags.map((tag, index) => (
            <span key={tag}>
              #{tag}
              {index < item.tags.length - 1 ? " ·" : ""}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ExploreRail({
  followed,
  onFollowToggle,
}: {
  followed: string[];
  onFollowToggle: (name: string) => void;
}) {
  return (
    <aside className="min-h-0 overflow-auto border-l border-[var(--syn-hairline-light)] px-6 py-10">
      <SidebarHeading>本周热门 Track</SidebarHeading>
      <div className="space-y-5">
        {tracks.map(([rank, title, handle, score]) => (
          <button
            className="grid w-full grid-cols-[34px_minmax(0,1fr)_52px] items-start gap-3 bg-transparent text-left"
            key={title}
            type="button"
          >
            <span className="font-mono text-[20px] font-semibold text-[var(--syn-reading-muted)]">
              {rank}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-[var(--syn-reading-ink)]">
                {title}
              </span>
              <span className="mt-1 block truncate font-mono text-[11px] text-[var(--syn-reading-muted)]">
                {handle}
              </span>
            </span>
            <span className="text-right font-mono text-[12px] text-[var(--syn-accent)]">
              {score}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-9">
        <SidebarHeading>Recently cited papers</SidebarHeading>
        <div className="space-y-3">
          {papers.map(([id, title, author, cites]) => (
            <button
              className="block w-full border-b border-[var(--syn-hairline-light)] py-4 text-left transition hover:text-[var(--syn-accent)]"
              key={id}
              type="button"
            >
              <div className="font-mono text-[12px] text-[var(--syn-accent)]">
                {id}
              </div>
              <div className="mt-2 text-[13px] font-medium leading-5 text-[var(--syn-reading-ink)]">
                {title}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-[var(--syn-reading-muted)]">
                <span>{author}</span>
                <span>↗ {cites}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-9">
        <SidebarHeading>建议关注</SidebarHeading>
        <div className="space-y-4">
          {people.map(([name, handle, meta, color]) => {
            const isFollowed = followed.includes(name);

            return (
              <div
                className="grid grid-cols-[36px_minmax(0,1fr)_84px] items-center gap-3"
                key={name}
              >
                <span
                  className={`size-8 rounded-[var(--syn-radius)] ${color}`}
                />
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-[var(--syn-reading-ink)]">
                    {name}
                  </div>
                  <div className="truncate font-mono text-[11px] text-[var(--syn-reading-muted)]">
                    {handle} · {meta}
                  </div>
                </div>
                <button
                  className={[
                    "h-7 rounded-[var(--syn-radius)] border px-3 text-[11px] transition",
                    isFollowed
                      ? "border-[var(--syn-accent)] bg-[var(--syn-accent-soft)] text-[var(--syn-accent)]"
                      : "border-[var(--syn-hairline-light)] text-[var(--syn-reading-secondary)] hover:text-[var(--syn-reading-ink)]",
                  ].join(" ")}
                  onClick={() => onFollowToggle(name)}
                  type="button"
                >
                  {isFollowed ? "Following" : "+ Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
