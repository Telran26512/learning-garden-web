"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  buildContributionWeeks,
  contributionFilters,
  countActiveContributionDays,
  graphEdges,
  graphNodes,
  notes,
  paperColumns,
  pinnedTracks,
  portfolioExperiments,
  portfolioProfile,
  portfolioStats,
  portfolioTabs,
  portfolioTracks,
  topTopics,
  type ContributionFilter,
  type PortfolioTabKey,
  type PortfolioTrack,
} from "./portfolio-model";

const tabKeys = new Set(portfolioTabs.map((tab) => tab.key));

const currentWritingExcerpt =
  "我想把 PPO 写成一条能从 Bellman equation 走到可运行实现的线: 先把 advantage 的估计讲清楚,再把 clipping、KL 和 rollout buffer 放回工程约束里看。";

const trackWriting: Record<string, { context: string; excerpt: string }> = {
  "Transformer 精读": {
    context:
      "这条 track 不是逐段翻译 Attention is All You Need,而是在补齐读论文时真正会卡住的地方: Q/K/V 的几何直觉、LayerNorm 放在哪里、以及 FlashAttention 为什么变成 IO 问题。",
    excerpt:
      "把 Q·Kᵀ 看成查询向量在键空间上的投影之后,Multi-Head 才不只是“并行几次 attention”,而是同时保留几套相似度结构。",
  },
  "PPO from Bellman to Implementation": {
    context:
      "我把 PPO 当作一组可检查的工程妥协来写: value bootstrap 给了它可训练性,GAE 管住方差,clip 和 KL 则是在防止一次 update 把策略推离数据分布。",
    excerpt:
      "真正难的不是记住 clipped objective,而是知道什么时候这个 clip 在救你,什么时候它只是在掩盖 rollout 质量的问题。",
  },
  "Softmax / Numerical Stability": {
    context:
      "这部分从一个很小的数值技巧开始,一路写到 online softmax 和 fused kernel。目标是让每一个 max、exp、sum 都有明确的数值理由。",
    excerpt:
      "softmax(x)=softmax(x−max(x)) 看起来像 trick,但它其实是在利用 LogSumExp 的平移不变性保存同一个分布。",
  },
  "GRPO 复现 · Draft": {
    context:
      "这是正在拆的复现笔记: 先把 group baseline 的 variance 直觉写清楚,再记录 tiny-llama 实验里遇到的 reward、采样和显存问题。",
    excerpt:
      "GRPO 让我感兴趣的地方不是“去掉 value model”,而是它把 baseline 的问题改写成同一 prompt 下样本之间的相对比较。",
  },
  "Diffusion 入门 → SDE": {
    context:
      "这条线把 DDPM、DDIM、score matching 和 SDE 视角放在同一个坐标系里,少用比喻,多保留推导里真正发生变化的变量。",
    excerpt:
      "当时间变量换成 log-SNR,很多 sampler 的形式开始像是在同一条反向路径上选择不同的积分规则。",
  },
  "MoE: Routing & Load Balance": {
    context:
      "我在用一个 toy router 理解 top-k routing 和 aux loss。重点不是复刻 Mixtral,而是看清楚稀疏前向为什么会把优化问题推给负载均衡。",
    excerpt:
      "没有 aux loss 时,router 很快学会把难题交给少数 expert,吞吐和泛化一起开始变坏。",
  },
  "Flash Attention 拆解": {
    context:
      "这条 track 从 IO-aware 的 motivation 开始,把 tiled attention、running statistics 和 Triton 实现逐行连起来。",
    excerpt:
      "FlashAttention 的关键不是少算了什么,而是让每一块 Q/K/V 只在 HBM 和 SRAM 之间走必要的一次。",
  },
  "KV Cache · Quant · Paging": {
    context:
      "这里记录 inference 系统的内存账: paged attention、KV quant、continuous batching 和它们在高并发时互相牵制的地方。",
    excerpt:
      "把 KV cache 类比成 OS 的 paged memory 后,fragmentation 终于从一个抽象名词变成了能画出来的浪费。",
  },
};

export function PortfolioPage() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab") as PortfolioTabKey | null;
  const activeTab =
    requestedTab && tabKeys.has(requestedTab) ? requestedTab : "overview";

  const [contributionFilter, setContributionFilter] =
    useState<ContributionFilter>("all");
  const [followed, setFollowed] = useState(false);
  const [shareNotice, setShareNotice] = useState("");
  const contributionWeeks = useMemo(
    () => buildContributionWeeks(contributionFilter),
    [contributionFilter],
  );
  const activeDays = countActiveContributionDays(contributionFilter);

  function handleShare() {
    const profileUrl = "https://synapse.app/u/zhe-li";
    void navigator.clipboard?.writeText(profileUrl);
    setShareNotice("已复制链接");
    window.setTimeout(() => setShareNotice(""), 1400);
  }

  return (
    <section className="min-h-[calc(100dvh-3.5rem)] bg-[var(--syn-reading-bg)] text-[var(--syn-reading-ink)]">
      <div className="mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
        <EditorialHero
          followed={followed}
          onFollowToggle={() => setFollowed((value) => !value)}
          onShare={handleShare}
          shareNotice={shareNotice}
        />

        <PortfolioTabs activeTab={activeTab} />

        {activeTab === "overview" ? (
          <OverviewPage
            activeDays={activeDays}
            contributionFilter={contributionFilter}
            contributionWeeks={contributionWeeks}
            onFilterChange={setContributionFilter}
          />
        ) : (
          <TabPage
            activeDays={activeDays}
            activeTab={activeTab}
            contributionFilter={contributionFilter}
            contributionWeeks={contributionWeeks}
            onFilterChange={setContributionFilter}
          />
        )}
      </div>
    </section>
  );
}

function EditorialHero({
  followed,
  onFollowToggle,
  onShare,
  shareNotice,
}: {
  followed: boolean;
  onFollowToggle: () => void;
  onShare: () => void;
  shareNotice: string;
}) {
  return (
    <header className="grid gap-12 border-b border-[var(--syn-hairline-light)] pb-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pb-16">
      <div className="min-w-0">
        <p className="font-mono text-[12px] text-[var(--syn-reading-secondary)]">
          {portfolioProfile.site} / machine learning notes
        </p>
        <h1 className="mt-5 max-w-[760px] text-balance [font-family:var(--font-display)] text-[52px] font-medium leading-[0.98] text-[var(--syn-reading-ink)] sm:text-[72px] lg:text-[88px]">
          {portfolioProfile.name}
        </h1>
        <p className="mt-8 max-w-[720px] text-[17px] leading-[1.75] text-[var(--syn-reading-secondary)] sm:text-[18px]">
          {portfolioProfile.bio}
        </p>

        <section className="mt-14 max-w-[900px] border-l-2 border-[var(--syn-accent)] pl-6 sm:pl-8">
          <p className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
            Currently writing
          </p>
          <h2 className="mt-4 text-balance [font-family:var(--font-display)] text-[34px] font-medium leading-[1.12] text-[var(--syn-reading-ink)] sm:text-[46px]">
            {portfolioProfile.currentWriting.replace(/\.$/, "")}
          </h2>
          <blockquote className="mt-6 max-w-[760px] text-[19px] leading-[1.7] text-[var(--syn-reading-ink)] sm:text-[21px]">
            “{currentWritingExcerpt}”
          </blockquote>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] text-[var(--syn-accent)]">
            <Link
              className="border-b border-[var(--syn-accent)] pb-0.5 transition hover:border-[var(--syn-accent)] hover:text-[var(--syn-accent-hover)]"
              href="/app?view=portfolio&tab=tracks"
            >
              Read the working track
            </Link>
            <Link
              className="border-b border-transparent pb-0.5 text-[var(--syn-reading-secondary)] transition hover:border-[var(--syn-hairline-light)] hover:text-[var(--syn-reading-ink)]"
              href="/app?view=portfolio&tab=notes"
            >
              Browse recent notes
            </Link>
          </div>
        </section>
      </div>

      <aside className="self-start border-t border-[var(--syn-hairline-light)] pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center border border-[var(--syn-hairline-light)] bg-[var(--syn-reading-surface)] [font-family:var(--font-display)] text-[26px] text-[var(--syn-reading-ink)]">
            {portfolioProfile.avatar}
          </div>
          <div>
            <p className="text-[15px] font-medium text-[var(--syn-reading-ink)]">
              {portfolioProfile.handle}
            </p>
            <p className="mt-1 text-[13px] text-[var(--syn-reading-secondary)]">
              {portfolioProfile.location} · joined {portfolioProfile.joined}
            </p>
          </div>
        </div>

        <dl className="mt-8 space-y-4 border-t border-[var(--syn-hairline-light)] pt-6 text-[13px] leading-6">
          <div>
            <dt className="font-mono text-[11px] text-[var(--syn-reading-muted)]">
              Contact
            </dt>
            <dd className="mt-1 text-[var(--syn-reading-ink)]">
              {portfolioProfile.email}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-[var(--syn-reading-muted)]">
              Code
            </dt>
            <dd className="mt-1 text-[var(--syn-reading-ink)]">
              {portfolioProfile.github}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex gap-3">
          <button
            className="h-9 border border-[var(--syn-hairline-light)] px-4 text-[13px] text-[var(--syn-reading-ink)] transition hover:border-[var(--syn-accent)] hover:text-[var(--syn-accent)] active:translate-y-px"
            onClick={onShare}
            type="button"
          >
            {shareNotice || "Share"}
          </button>
          <button
            className="h-9 bg-[var(--syn-accent)] px-4 text-[13px] font-medium text-[#FFFFFF] transition hover:bg-[var(--syn-accent-hover)] active:translate-y-px"
            onClick={onFollowToggle}
            type="button"
          >
            {followed ? "Following" : "Follow"}
          </button>
        </div>
      </aside>
    </header>
  );
}

function PortfolioTabs({ activeTab }: { activeTab: PortfolioTabKey }) {
  return (
    <nav
      aria-label="Portfolio sections"
      className="flex gap-8 overflow-x-auto border-b border-[var(--syn-hairline-light)] pt-7"
    >
      {portfolioTabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Link
            className={[
              "shrink-0 border-b-2 pb-3 text-[14px] transition",
              isActive
                ? "border-[var(--syn-accent)] text-[var(--syn-reading-ink)]"
                : "border-transparent text-[var(--syn-reading-secondary)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            href={tab.href}
            key={tab.key}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function OverviewPage({
  activeDays,
  contributionFilter,
  contributionWeeks,
  onFilterChange,
}: {
  activeDays: number;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <div className="grid gap-14 py-14 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-18">
      <main className="min-w-0 space-y-20">
        <TrackSection
          description="每条 track 都是一组正在被反复修订的理解路径,不是一个用于展示数量的项目卡。"
          tracks={pinnedTracks}
        />
        <NotesTimeline
          description="按更新时间排,保留写作现场的痕迹。"
          notesToShow={notes.slice(0, 7)}
        />
      </main>

      <PortfolioMargin
        activeDays={activeDays}
        contributionFilter={contributionFilter}
        contributionWeeks={contributionWeeks}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

function TabPage({
  activeDays,
  activeTab,
  contributionFilter,
  contributionWeeks,
  onFilterChange,
}: {
  activeDays: number;
  activeTab: PortfolioTabKey;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <div className="grid gap-14 py-14 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-18">
      <main className="min-w-0">
        {activeTab === "tracks" ? (
          <TrackSection
            description="这些条目按研究问题组织,每个条目都留下最近一次真正推动理解的句子。"
            tracks={portfolioTracks}
          />
        ) : null}
        {activeTab === "notes" ? (
          <NotesTimeline
            description="不是发布公告,而是研究笔记的变更记录。"
            notesToShow={notes}
          />
        ) : null}
        {activeTab === "papers" ? <ReadingDesk /> : null}
        {activeTab === "experiments" ? <ExperimentLog /> : null}
        {activeTab === "graph" ? <GraphNotebook /> : null}
      </main>

      <PortfolioMargin
        activeDays={activeDays}
        contributionFilter={contributionFilter}
        contributionWeeks={contributionWeeks}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

function TrackSection({
  description,
  tracks,
}: {
  description: string;
  tracks: readonly PortfolioTrack[];
}) {
  return (
    <section>
      <SectionHeading eyebrow="tracks in progress" title="正在推进的研究线索">
        {description}
      </SectionHeading>

      <div className="mt-10 divide-y divide-[var(--syn-hairline-light)] border-y border-[var(--syn-hairline-light)]">
        {tracks.map((track) => {
          const writing = trackWriting[track.title] ?? {
            context: track.description,
            excerpt: track.description,
          };

          return (
            <article
              className="grid gap-6 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:py-10"
              key={track.title}
            >
              <div>
                <h3 className="[font-family:var(--font-display)] text-[26px] font-medium leading-[1.12] text-[var(--syn-reading-ink)]">
                  {track.title}
                </h3>
                <p className="mt-4 font-mono text-[11px] text-[var(--syn-reading-muted)]">
                  updated {track.updated}
                </p>
              </div>
              <div className="max-w-[760px]">
                <p className="text-[16px] leading-[1.8] text-[#4F463D]">
                  {writing.context}
                </p>
                <blockquote className="mt-5 border-l border-[var(--syn-hairline-light)] pl-5 text-[17px] leading-[1.75] text-[var(--syn-reading-ink)]">
                  “{writing.excerpt}”
                </blockquote>
                <Link
                  className="mt-6 inline-flex border-b border-[var(--syn-accent)] pb-0.5 text-[13px] text-[var(--syn-accent)] transition hover:border-[var(--syn-accent-hover)] hover:text-[var(--syn-accent-hover)]"
                  href="/app?view=portfolio&tab=notes"
                >
                  Read related notes
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function NotesTimeline({
  description,
  notesToShow,
}: {
  description: string;
  notesToShow: typeof notes;
}) {
  return (
    <section>
      <SectionHeading eyebrow="recent notes" title="最近发布和更新">
        {description}
      </SectionHeading>

      <ol className="mt-10 border-l border-[#D1C8BC]">
        {notesToShow.map((note) => (
          <li className="relative pl-7" key={`${note.title}-${note.time}`}>
            <span className="absolute -left-[4.5px] top-2 size-[8px] rounded-full bg-[var(--syn-accent)]" />
            <article className="border-b border-[var(--syn-hairline-light)] pb-8 pt-0 first:pt-0 [&+&]:pt-8">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <time className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
                  {note.time}
                </time>
                <span className="text-[13px] text-[#A09689]">/</span>
                <span className="text-[13px] text-[var(--syn-accent)]">
                  {note.track}
                </span>
              </div>
              <h3 className="mt-2 [font-family:var(--font-display)] text-[24px] font-medium leading-[1.2] text-[var(--syn-reading-ink)]">
                {note.title}
              </h3>
              <p className="mt-3 max-w-[760px] text-[15px] leading-[1.75] text-[var(--syn-reading-secondary)]">
                {note.excerpt}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PortfolioMargin({
  activeDays,
  contributionFilter,
  contributionWeeks,
  onFilterChange,
}: {
  activeDays: number;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <aside className="space-y-10 text-[13px] leading-6 text-[#6A6056] xl:sticky xl:top-24 xl:self-start">
      <ContributionAside
        activeDays={activeDays}
        contributionFilter={contributionFilter}
        contributionWeeks={contributionWeeks}
        onFilterChange={onFilterChange}
      />
      <QuietStats />
      <TopicsList />
    </aside>
  );
}

function ContributionAside({
  activeDays,
  contributionFilter,
  contributionWeeks,
  onFilterChange,
}: {
  activeDays: number;
  contributionFilter: ContributionFilter;
  contributionWeeks: ReturnType<typeof buildContributionWeeks>;
  onFilterChange: (filter: ContributionFilter) => void;
}) {
  return (
    <section className="border-t border-[var(--syn-hairline-light)] pt-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="[font-family:var(--font-display)] text-[18px] font-medium text-[var(--syn-reading-ink)]">
          Writing rhythm
        </h2>
        <span className="font-mono text-[11px] text-[var(--syn-reading-muted)]">
          {activeDays} days
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
        {contributionFilters.map((filter) => (
          <button
            className={[
              "border-b pb-0.5 text-[12px] transition",
              contributionFilter === filter.key
                ? "border-[var(--syn-accent)] text-[var(--syn-accent)]"
                : "border-transparent text-[var(--syn-reading-muted)] hover:border-[var(--syn-hairline-light)] hover:text-[var(--syn-reading-ink)]",
            ].join(" ")}
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-hidden">
        <div
          className="grid gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${contributionWeeks.length}, minmax(0, 1fr))`,
          }}
        >
          {contributionWeeks.map((week, weekIndex) => (
            <div className="grid grid-rows-7 gap-[3px]" key={weekIndex}>
              {week.map((entry) => (
                <span
                  aria-label={`${entry.date}: ${entry.count} contributions`}
                  className={`aspect-square rounded-[1px] ${heatmapColor(entry.level)}`}
                  key={entry.date}
                  title={`${entry.date}: ${entry.count}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuietStats() {
  return (
    <section className="border-t border-[var(--syn-hairline-light)] pt-5">
      <h2 className="[font-family:var(--font-display)] text-[18px] font-medium text-[var(--syn-reading-ink)]">
        Archive
      </h2>
      <dl className="mt-4 space-y-2">
        {portfolioStats.map((item) => (
          <div className="flex justify-between gap-5" key={item.label}>
            <dt className="text-[var(--syn-reading-secondary)]">
              {item.label}
            </dt>
            <dd className="font-mono text-[12px] text-[var(--syn-reading-ink)]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TopicsList() {
  return (
    <section className="border-t border-[var(--syn-hairline-light)] pt-5">
      <h2 className="[font-family:var(--font-display)] text-[18px] font-medium text-[var(--syn-reading-ink)]">
        Marginal tags
      </h2>
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
        {topTopics.map(([topic, count]) => (
          <Link
            className="border-b border-transparent pb-0.5 text-[12px] text-[var(--syn-reading-secondary)] transition hover:border-[var(--syn-hairline-light)] hover:text-[var(--syn-reading-ink)]"
            href={`/app?view=portfolio&tag=${encodeURIComponent(topic)}`}
            key={topic}
          >
            #{topic} <span className="font-mono">{count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ReadingDesk() {
  return (
    <section>
      <SectionHeading eyebrow="reading desk" title="论文阅读桌">
        论文不再按彩色状态卡展示,而是像书桌上的几摞材料:
        等待读、正在读、已经写完笔记。
      </SectionHeading>

      <div className="mt-10 space-y-12">
        {paperColumns.map((column) => (
          <section key={column.key}>
            <h3 className="border-b border-[var(--syn-hairline-light)] pb-3 [font-family:var(--font-display)] text-[24px] font-medium text-[var(--syn-reading-ink)]">
              {column.label}
            </h3>
            <ol className="divide-y divide-[var(--syn-hairline-light)]">
              {column.papers.map((paper) => (
                <li
                  className="grid gap-4 py-6 md:grid-cols-[150px_minmax(0,1fr)]"
                  key={paper.title}
                >
                  <p className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
                    arXiv:{paper.arxiv}
                    <br />
                    {paper.year} · {paper.venue}
                  </p>
                  <div>
                    <h4 className="text-[19px] font-medium leading-7 text-[var(--syn-reading-ink)]">
                      {paper.title}
                    </h4>
                    <p className="mt-2 text-[14px] leading-6 text-[var(--syn-reading-secondary)]">
                      {paper.authors}
                      {paper.notes ? ` · ${paper.notes} notes` : ""}
                      {paper.highlights
                        ? ` · ${paper.highlights} highlights`
                        : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[var(--syn-reading-secondary)]">
                      {paper.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}

function ExperimentLog() {
  return (
    <section>
      <SectionHeading eyebrow="lab log" title="实验记录">
        这里只保留假设、分支和目前读数,避免把研究过程包装成运行状态大屏。
      </SectionHeading>

      <div className="mt-10 divide-y divide-[var(--syn-hairline-light)] border-y border-[var(--syn-hairline-light)]">
        {portfolioExperiments.map((experiment) => (
          <article
            className="grid gap-5 py-6 md:grid-cols-[110px_minmax(0,1fr)_180px]"
            key={experiment.index}
          >
            <div className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
              {experiment.index}
              <br />
              {experiment.when}
            </div>
            <div>
              <h3 className="text-[18px] font-medium text-[var(--syn-reading-ink)]">
                {experiment.name}
              </h3>
              <p className="mt-2 max-w-[680px] text-[15px] leading-[1.7] text-[var(--syn-reading-secondary)]">
                {experiment.hypothesis}
              </p>
              <p className="mt-3 font-mono text-[12px] text-[var(--syn-reading-secondary)]">
                {experiment.branch}
              </p>
            </div>
            <div className="md:text-right">
              <MiniSparkline curve={experiment.curve} />
              <p className="mt-3 text-[15px] font-medium text-[var(--syn-reading-ink)]">
                {experiment.metricValue}
              </p>
              <p className="text-[12px] text-[var(--syn-reading-secondary)]">
                {experiment.metricLabel}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GraphNotebook() {
  return (
    <section>
      <SectionHeading eyebrow="knowledge graph" title="知识图谱草图">
        图谱在这里不是主视觉,只作为一个索引: 哪些笔记把
        Transformer、RLHF、Softmax 和 Inference 串在了一起。
      </SectionHeading>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <GraphSketch />
        <div className="space-y-6 text-[15px] leading-[1.75] text-[var(--syn-reading-secondary)]">
          <p>
            当前最密集的连接发生在 Transformer 与 PPO 之间: KL 项、reference
            model 和 attention mask 的实现细节会在同一组训练脚本里相遇。
          </p>
          <p>
            下一步会把 GRPO 复现产生的新 note 接入这张图,重点检查它和 GAE、PPO
            clipping 之间到底共享了哪些假设。
          </p>
          <p className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
            {graphNodes.length} nodes · {graphEdges.length} links
          </p>
        </div>
      </div>
    </section>
  );
}

function GraphSketch() {
  const nodeMap = new Map(graphNodes.map((node) => [node.id, node]));

  return (
    <svg
      aria-label="Knowledge graph sketch"
      className="h-auto w-full border border-[var(--syn-hairline-light)] bg-[#FAFAFA]"
      role="img"
      viewBox="0 0 1000 720"
    >
      {graphEdges.map(([sourceId, targetId]) => {
        const source = nodeMap.get(sourceId);
        const target = nodeMap.get(targetId);

        if (!source || !target) {
          return null;
        }

        return (
          <line
            key={`${sourceId}-${targetId}`}
            stroke="#E0E0E0"
            strokeWidth="2"
            x1={source.x}
            x2={target.x}
            y1={source.y}
            y2={target.y}
          />
        );
      })}
      {graphNodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            fill={
              node.focused
                ? "var(--syn-accent)"
                : node.type === "hub"
                  ? "var(--syn-reading-ink)"
                  : "var(--syn-hairline-light)"
            }
            r={node.r + (node.type === "hub" ? 6 : 3)}
          />
          {node.label ? (
            <text
              fill="var(--syn-reading-ink)"
              fontFamily="var(--font-sans)"
              fontSize="24"
              fontWeight="500"
              x={node.x + 18}
              y={node.y + 7}
            >
              {node.label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function SectionHeading({
  children,
  eyebrow,
  title,
}: {
  children: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header>
      <p className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance [font-family:var(--font-display)] text-[34px] font-medium leading-[1.15] text-[var(--syn-reading-ink)] sm:text-[42px]">
        {title}
      </h2>
      <p className="mt-4 max-w-[690px] text-[16px] leading-[1.75] text-[var(--syn-reading-secondary)]">
        {children}
      </p>
    </header>
  );
}

function MiniSparkline({ curve }: { curve: readonly number[] }) {
  const max = Math.max(...curve);
  const min = Math.min(...curve);
  const span = Math.max(1, max - min);
  const points = curve
    .map((value, index) => {
      const x = (index / Math.max(1, curve.length - 1)) * 140;
      const y = 44 - ((value - min) / span) * 36;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" className="ml-auto h-12 w-36" viewBox="0 0 140 52">
      <polyline
        fill="none"
        points={points}
        stroke="var(--syn-accent)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <line
        stroke="var(--syn-hairline-light)"
        x1="0"
        x2="140"
        y1="48"
        y2="48"
      />
    </svg>
  );
}

function heatmapColor(level: 0 | 1 | 2 | 3 | 4) {
  switch (level) {
    case 0:
      return "bg-[#F2F2F2]";
    case 1:
      return "bg-[#E5E5E5]";
    case 2:
      return "bg-[#CCCCCC]";
    case 3:
      return "bg-[#888888]";
    case 4:
      return "bg-[#3F3329]";
    default:
      return "bg-[#F2F2F2]";
  }
}
