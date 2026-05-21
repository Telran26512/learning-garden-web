import {
  SynapseLinkMark,
  SynapseLogo,
} from "@/components/synapse/synapse-logo";

const readingNotes = [
  [
    "PPO from Bellman to Implementation",
    "rollout buffer 的形状决定了后面所有估计量的误差边界。",
  ],
  ["Scaled Dot-Product 的几何直觉", "把 Q·Kᵀ 看作查询向量在键空间上的投影。"],
  [
    "LogSumExp 与 fused softmax kernel",
    "online 统计量让 softmax 可以 streaming。",
  ],
] as const;

const workingLines = [
  "# Multi-Head Attention",
  "",
  "> 把单头注意力拆成 h 个并行的子空间,再 concat。",
  "",
  "## §1 直觉",
  "",
  "单个 attention 头只能学到 ::concept[一种相似度结构],",
  "多头让模型同时学习 ::concept[位置 / 句法 / 语义]。",
] as const;

export default function VisualSystemPage() {
  return (
    <main className="min-h-dvh bg-[#FAFAFA] p-6 text-[var(--syn-reading-ink)]">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[var(--syn-accent)]">
              <SynapseLogo size={26} />
            </span>
            <div>
              <h1 className="syn-title text-[28px] leading-none">
                Synapse visual system
              </h1>
              <p className="mt-1 text-[13px] text-[var(--syn-reading-secondary)]">
                Reading Mode and Editing Mode share one logo, one ink, one
                preprint grammar.
              </p>
            </div>
          </div>
          <p className="max-w-[420px] text-right text-[13px] leading-6 text-[var(--syn-reading-secondary)]">
            Synapse 的视觉不是在展示功能,而是在呈现概念之间的连接:
            阅读时像预印本, 写作时像正在批注的手稿。
          </p>
        </header>

        <div className="grid gap-5 xl:grid-cols-2">
          <ReadingMock />
          <WorkingMock />
          <NoteMock />
          <EmptyMock />
          <SearchMock />
          <GraphMock />
        </div>
        <ArxivComparison />
      </div>
    </main>
  );
}

function ReadingMock() {
  return (
    <section className="syn-reading-mode min-h-[760px] border border-[var(--syn-hairline-light)] p-8">
      <MockHeader mode="reading" />
      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article>
          <p className="syn-kicker text-[var(--syn-reading-muted)]">
            currently writing
          </p>
          <h2 className="syn-title mt-4 max-w-[650px] text-[58px] leading-[1.02]">
            PPO from Bellman to Implementation
          </h2>
          <blockquote className="mt-8 border-l-2 border-[var(--syn-accent)] pl-6 text-[21px] leading-[1.72] text-[var(--syn-reading-secondary)]">
            “我想把 PPO 写成一条能从 Bellman equation 走到可运行实现的线: 先把
            advantage 的估计讲清楚,再把 clipping、KL 和 rollout buffer
            放回工程约束里看。”
          </blockquote>

          <ol className="mt-14 border-l border-[var(--syn-hairline-light)]">
            {readingNotes.map(([title, excerpt]) => (
              <li className="relative pb-9 pl-6" key={title}>
                <span className="absolute -left-[4px] top-1 size-2 rounded-[2px] bg-[var(--syn-accent)]" />
                <h3 className="syn-title text-[24px] leading-tight">{title}</h3>
                <p className="mt-3 max-w-[620px] text-[15px] leading-[1.78] text-[var(--syn-reading-secondary)]">
                  {excerpt}
                </p>
              </li>
            ))}
          </ol>
        </article>

        <aside className="border-l border-[var(--syn-hairline-light)] pl-6">
          <p className="syn-kicker text-[var(--syn-reading-muted)]">margin</p>
          <div className="mt-5 grid grid-cols-9 gap-[3px]">
            {Array.from({ length: 63 }, (_, index) => (
              <span
                className={[
                  "aspect-square rounded-[1px]",
                  index % 7 === 0
                    ? "bg-[#F2F2F2]"
                    : index % 5 === 0
                      ? "bg-[#888888]"
                      : index % 3 === 0
                        ? "bg-[#CCCCCC]"
                        : "bg-[#E5E5E5]",
                ].join(" ")}
                key={index}
              />
            ))}
          </div>
          <p className="mt-6 text-[13px] leading-6 text-[var(--syn-reading-secondary)]">
            #transformer · #ppo · #论文精读 · #inference
          </p>
        </aside>
      </div>
    </section>
  );
}

function WorkingMock() {
  return (
    <section className="syn-working-mode min-h-[760px] border border-[var(--syn-hairline-dark)] p-8">
      <MockHeader mode="working" />
      <div className="mt-10 grid min-h-[620px] grid-cols-[190px_minmax(0,1fr)_230px] border-t border-[var(--syn-hairline-dark)]">
        <aside className="border-r border-[var(--syn-hairline-dark)] py-7 pr-5">
          <p className="syn-kicker text-[var(--syn-working-muted)]">type</p>
          <div className="mt-5 space-y-4 text-[13px]">
            {["Concept", "Paper Note", "Experiment", "Journal"].map((item) => (
              <p
                className={
                  item === "Concept"
                    ? "border-l-2 border-[var(--syn-accent)] pl-3 text-[var(--syn-working-ink)]"
                    : "pl-3 text-[var(--syn-working-secondary)]"
                }
                key={item}
              >
                {item}
              </p>
            ))}
          </div>
        </aside>

        <main className="bg-[var(--syn-working-surface)] px-8 py-7">
          <div className="flex items-center justify-between border-b border-[var(--syn-hairline-dark)] pb-4">
            <div className="flex gap-5 text-[13px]">
              <span className="border-b border-[var(--syn-accent)] pb-1">
                Edit
              </span>
              <span className="text-[var(--syn-working-muted)]">Preview</span>
            </div>
            <span className="font-mono text-[11px] text-[var(--syn-working-muted)]">
              multi-head-attention.md
            </span>
          </div>

          <h2 className="syn-title mt-8 text-[38px] leading-tight">
            Multi-Head Attention
          </h2>
          <div className="mt-8 grid grid-cols-[34px_minmax(0,1fr)] font-mono text-[13px] leading-8">
            <div className="select-none text-right text-[#BBBBBB]">
              {workingLines.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
            <pre className="m-0 pl-5 text-[var(--syn-working-ink)]">
              {workingLines.join("\n")}
            </pre>
          </div>
        </main>

        <aside className="border-l border-[var(--syn-hairline-dark)] py-7 pl-6">
          <p className="syn-kicker text-[var(--syn-working-muted)]">links</p>
          <div className="mt-5 space-y-5 text-[13px]">
            <div>
              <p className="font-mono text-[10.5px] text-[var(--syn-working-muted)]">
                derives from
              </p>
              <p className="mt-1">Attention §3.2.1</p>
            </div>
            <div>
              <p className="font-mono text-[10.5px] text-[var(--syn-working-muted)]">
                implements
              </p>
              <p className="mt-1">attention.py L34-L58</p>
            </div>
          </div>
          <button
            className="syn-link-mark-trigger mt-8 inline-flex items-center gap-2 text-[14px] text-[var(--syn-accent)]"
            type="button"
          >
            <SynapseLinkMark size={15} />
            建立 Link
          </button>
        </aside>
      </div>
    </section>
  );
}

function MockHeader({ mode }: { mode: "reading" | "working" }) {
  const reading = mode === "reading";

  return (
    <header
      className={[
        "flex items-center justify-between border-b pb-4",
        reading
          ? "border-[var(--syn-hairline-light)]"
          : "border-[var(--syn-hairline-dark)]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="text-[var(--syn-accent)]">
          <SynapseLogo size={23} />
        </span>
        <span className="text-[15px] font-semibold">Synapse</span>
      </div>
      <nav className="flex gap-6 text-[13px]">
        <span
          className={
            reading
              ? "text-[var(--syn-accent)]"
              : "text-[var(--syn-working-ink)]"
          }
        >
          {reading ? "Portfolio" : "Studio"}
        </span>
        <span
          className={
            reading
              ? "text-[var(--syn-reading-muted)]"
              : "text-[var(--syn-working-muted)]"
          }
        >
          {reading ? "Explore" : "Workspace"}
        </span>
      </nav>
    </header>
  );
}

function NoteMock() {
  return (
    <section className="syn-reading-mode min-h-[520px] border border-[var(--syn-hairline-light)] p-8">
      <p className="text-[12px] text-[var(--syn-reading-muted)]">
        note reading
      </p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article className="max-w-[720px] text-[18px] leading-[1.6]">
          <h2 className="syn-title text-[38px] leading-tight">
            §2.1 Bellman optimality as a fixed point
          </h2>
          <p className="mt-6 indent-[1.2em]">
            The value function is useful only after we treat it as an operator
            equation. The update is no longer a heuristic, but a contraction on
            a space of functions.
          </p>
          <div className="my-6 border-l-2 border-[var(--syn-accent)] pl-5">
            <p>
              <strong>Theorem 2.1.</strong> (Bellman optimality) Let <i>T</i> be
              the Bellman optimality operator. Then <i>V*</i> is a fixed point
              of <i>T</i>.
            </p>
          </div>
          <p className="indent-[1.2em]">
            <i>Proof.</i> The contraction follows from γ &lt; 1. Repeated
            application converges in the sup norm. ∎
          </p>
        </article>
        <aside className="text-[13px] leading-6 text-[var(--syn-reading-secondary)]">
          <p>see §1.3 for rollout notation</p>
          <p className="mt-5">
            [Vaswani 2017] is cited only as an analogy for attention as weighted
            retrieval.
          </p>
        </aside>
      </div>
    </section>
  );
}

function EmptyMock() {
  return (
    <section className="syn-reading-mode min-h-[520px] border border-[var(--syn-hairline-light)] p-8">
      <p className="text-[12px] text-[var(--syn-reading-muted)]">empty state</p>
      <div className="grid min-h-[420px] place-items-center">
        <div className="max-w-[480px] text-center">
          <SynapseLinkMark size={54} />
          <h2 className="syn-title mt-8 text-[36px]">
            Your first synapse begins here.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.6] text-[var(--syn-reading-secondary)]">
            Start with a paragraph, a theorem, or a citation. The first link is
            allowed to be provisional.
          </p>
        </div>
      </div>
    </section>
  );
}

function SearchMock() {
  return (
    <section className="syn-reading-mode min-h-[520px] border border-[var(--syn-hairline-light)] p-8">
      <p className="text-[12px] text-[var(--syn-reading-muted)]">search</p>
      <div className="mt-8 border-b border-[var(--syn-hairline-light)] pb-3 font-mono text-[18px]">
        <span className="text-[var(--syn-reading-muted)]">/</span> KL penalty
        reference model
      </div>
      <div className="mt-8 space-y-7">
        {[
          "Reference Model 的 KL 项究竟在约束什么",
          "PPO clipped objective",
          "GAE λ 的 bias-variance trade-off",
        ].map((item, index) => (
          <article
            className="grid gap-5 border-b border-[var(--syn-hairline-light)] pb-6 md:grid-cols-[80px_minmax(0,1fr)]"
            key={item}
          >
            <span className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
              0{index + 1}
            </span>
            <div>
              <h3 className="syn-title text-[24px]">{item}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-[var(--syn-reading-secondary)]">
                Matching paragraph with one linked concept and two citations.
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function GraphMock() {
  return (
    <section className="syn-reading-mode min-h-[520px] border border-[var(--syn-hairline-light)] p-8">
      <p className="text-[12px] text-[var(--syn-reading-muted)]">graph</p>
      <svg
        className="mt-8 h-[390px] w-full"
        viewBox="0 0 640 390"
        role="img"
        aria-label="knowledge graph mock"
      >
        {[
          [90, 210, 260, 110],
          [260, 110, 430, 180],
          [260, 110, 360, 300],
          [430, 180, 540, 90],
          [360, 300, 540, 280],
        ].map(([x1, y1, x2, y2], index) => (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#E0E0E0"
            strokeWidth="1"
          />
        ))}
        {[
          [90, 210, "Bellman"],
          [260, 110, "PPO"],
          [430, 180, "KL"],
          [360, 300, "GAE"],
          [540, 90, "Ref model"],
          [540, 280, "Rollout"],
        ].map(([x, y, label]) => (
          <g key={label}>
            <circle cx={x} cy={y} r="5" fill="#1F4332" />
            <text
              x={Number(x) + 12}
              y={Number(y) + 4}
              fontSize="13"
              fill="#1A1A1A"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

function ArxivComparison() {
  return (
    <section className="mt-5 grid gap-5 xl:grid-cols-2">
      <div className="border border-[var(--syn-hairline-light)] bg-white p-8">
        <p className="text-[12px] text-[var(--syn-reading-muted)]">
          arXiv source
        </p>
        <h2 className="syn-title mt-6 text-[34px]">
          Attention Is All You Need
        </h2>
        <p className="mt-5 text-[17px] leading-[1.6]">
          The dominant sequence transduction models are based on complex
          recurrent or convolutional neural networks.
        </p>
      </div>
      <div className="border border-[var(--syn-hairline-light)] bg-white p-8">
        <p className="text-[12px] text-[var(--syn-reading-muted)]">
          Synapse note
        </p>
        <h2 className="syn-title mt-6 text-[34px]">
          §1 Scaled dot-product attention
        </h2>
        <p className="mt-5 text-[17px] leading-[1.6]">
          把 Q·Kᵀ 看作查询向量在键空间上的投影,√dₖ 是为了让 dot product
          的方差与维度脱钩。
        </p>
      </div>
    </section>
  );
}
