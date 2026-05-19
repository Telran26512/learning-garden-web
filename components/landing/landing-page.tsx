"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { SynapseLogo } from "@/components/synapse/synapse-logo";
import { ForceGraph, useAttentionGraph } from "./force-graph";
import { SynapseParticles } from "./synapse-particles";

const PALETTE = ["#4DD0FF", "#60A5FA", "#E07856"];

type BlockKind = "math" | "code" | "paper" | "concept";

export function LandingPage() {
  return (
    <main className="sn-page">
      <LandingNav />
      <LandingHero />
      <LandingPainSolution />
      <LandingThreeLayers />
      <LandingGraphDemo />
      <LandingCommunity />
      <LandingWorkflow />
      <LandingPricing />
      <LandingFAQ />
      <LandingFooter />
    </main>
  );
}

function LandingNav() {
  return (
    <header className="sn-nav">
      <a className="sn-brand" href="#top" aria-label="Synapse 首页">
        <SynapseLogo size={22} />
        <span className="sn-brand-name">Synapse</span>
        <span className="sn-beta">BETA</span>
      </a>
      <nav className="sn-nav-links" aria-label="首页导航">
        <a href="#product">产品</a>
        <a href="#community">社区 Explore</a>
        <a href="#workflow">文档</a>
        <a href="#pricing">定价</a>
        <a href="#faq">更新日志</a>
      </nav>
      <div className="sn-nav-actions">
        <a className="sn-btn sn-btn-ghost" href="#faq">
          登录
        </a>
        <a
          className="sn-btn sn-btn-primary"
          style={{ height: 36, paddingInline: 16, fontSize: 13 }}
          href="#pricing"
        >
          开始学习 →
        </a>
      </div>
    </header>
  );
}

function LandingHero() {
  return (
    <section id="top" className="sn-hero">
      <div className="sn-hero-radial" />
      <SynapseParticles nodeCount={280} colors={PALETTE} />

      <div className="sn-hero-content">
        <div className="sn-pill" style={{ marginBottom: 28 }}>
          <span className="sn-pill-dot" /> v0.7 · 知识图谱 · Embedding 推荐 ·
          全新发布
        </div>
        <h1 className="sn-hero-title">
          Learn AI as a <em>Network</em>
          <span style={{ color: "var(--text-muted)" }}>,</span>
          <br />
          not a Stack.
        </h1>
        <p className="sn-hero-copy">
          让你的 AI 学习不再是孤岛。
          <br />把{" "}
          <em style={{ color: "var(--block-math)", fontStyle: "normal" }}>
            数学推导
          </em>
          、
          <em style={{ color: "var(--block-code)", fontStyle: "normal" }}>
            可运行代码
          </em>{" "}
          与{" "}
          <em style={{ color: "var(--block-paper)", fontStyle: "normal" }}>
            原始论文
          </em>{" "}
          用同一套语义层打通,在公开社区里追踪每一次&quot;想通&quot;的瞬间。
        </p>
        <div className="sn-hero-ctas">
          <a className="sn-btn sn-btn-dark" href="#pricing">
            开始构建我的第二大脑 →
          </a>
          <a className="sn-btn sn-btn-glass" href="#community">
            浏览社区 Explore
          </a>
        </div>
        <div className="sn-hero-stats">
          <span>3,247 位学习者</span>
          <span aria-hidden="true" style={{ opacity: 0.4 }}>
            ·
          </span>
          <span>11,890 条公开 Note</span>
          <span aria-hidden="true" style={{ opacity: 0.4 }}>
            ·
          </span>
          <span>38,541 条跨学科 Link</span>
        </div>
      </div>

      <div className="sn-hero-preview">
        <HeroPreviewCard />
      </div>
    </section>
  );
}

function HeroPreviewCard() {
  const trackItems = [
    "Attention Is All You Need",
    "Scaled Dot-Product 直觉",
    "Multi-Head 拆分推导",
    "Positional Encoding",
    "PyTorch 复现",
    "训练 IWSLT-14 De-En",
  ];
  const citations = [
    ["Chen 思维链拆解", "implements"],
    ["Flash-Attn 精读", "extends"],
    ["MoE 路由设计", "cites"],
  ];

  return (
    <div className="sn-card sn-browser-card">
      <div className="sn-browser-chrome">
        <span className="sn-browser-dot" style={{ background: "#FF5F57" }} />
        <span className="sn-browser-dot" style={{ background: "#FEBC2E" }} />
        <span className="sn-browser-dot" style={{ background: "#28C840" }} />
        <div className="sn-browser-url">
          synapse.app/u/zhe-li/notes/attention-is-all-you-need
        </div>
        <div
          style={{
            marginLeft: "auto",
            color: "var(--text-muted)",
            fontSize: 11,
          }}
        >
          ⌘K 搜索
        </div>
      </div>

      <div className="sn-browser-layout">
        <aside className="sn-preview-side sn-preview-left">
          <div
            style={{
              marginBottom: 10,
              color: "var(--text-muted)",
              fontSize: 11,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            Track
          </div>
          <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>
            Transformer 精读
          </div>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {trackItems.map((item, index) => {
              const active = index === 0;
              return (
                <li
                  key={item}
                  style={{
                    borderLeft: active
                      ? "2px solid var(--brand-cyan)"
                      : "2px solid transparent",
                    borderRadius: 6,
                    background: active ? "rgba(77,208,255,.08)" : "transparent",
                    color: active
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    fontSize: 12,
                    padding: "6px 8px 6px 10px",
                  }}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </aside>

        <div style={{ overflow: "hidden", padding: "24px 28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "var(--text-muted)",
              fontSize: 11,
            }}
          >
            <span style={{ color: "var(--block-paper)" }}>● PAPER</span>
            <span>Vaswani et al. · 2017 · arXiv:1706.03762</span>
          </div>
          <h2
            style={{
              margin: "8px 0 0",
              fontSize: 22,
              fontWeight: 650,
              letterSpacing: 0,
            }}
          >
            Attention Is All You Need
          </h2>
          <p
            style={{
              marginTop: 12,
              color: "var(--text-secondary)",
              fontSize: 13,
              lineHeight: 1.65,
            }}
          >
            从 Bahdanau 注意力出发,Transformer 用纯 attention 替换了 RNN
            中的循环结构。本文围绕 §3.2 Scaled Dot-Product Attention 重建推导……
          </p>
          <MiniBlock kind="math" />
          <MiniBlock kind="code" />
        </div>

        <aside className="sn-preview-side sn-preview-right">
          <div
            style={{
              marginBottom: 10,
              color: "var(--text-muted)",
              fontSize: 11,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            Cited by · 23
          </div>
          {citations.map(([title, relation]) => (
            <div
              key={title}
              style={{
                borderTop: "1px solid var(--border-subtle)",
                padding: "8px 0",
                fontSize: 12,
              }}
            >
              <div>{title}</div>
              <div
                style={{
                  marginTop: 4,
                  color: "var(--brand-cyan)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                }}
              >
                → {relation}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function MiniBlock({ kind }: { kind: Exclude<BlockKind, "concept"> }) {
  const meta = {
    math: {
      color: "var(--block-math)",
      label: "MATH · LaTeX",
      body: "Attention(Q,K,V) = softmax( QKᵀ / √dₖ ) V",
    },
    code: {
      color: "var(--block-code)",
      label: "CODE · Python",
      body: "def scaled_dot_product(q, k, v, mask=None):\n    scores = q @ k.transpose(-2,-1) / math.sqrt(d_k)\n    if mask is not None: scores += mask\n    return softmax(scores, -1) @ v",
    },
    paper: {
      color: "var(--block-paper)",
      label: "PAPER · Vaswani 2017",
      body: '"the dominant sequence transduction models are based on complex recurrent or convolutional neural networks..." — §1',
    },
  }[kind];

  return (
    <div className="sn-mini-block">
      <div
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: 3,
          background: meta.color,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "8px 12px 8px 16px",
          fontSize: 11,
        }}
      >
        <span
          style={{
            color: meta.color,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
          }}
        >
          {meta.label}
        </span>
        <span style={{ color: "var(--text-muted)" }}>↗ Link · ⋯</span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "12px 16px",
          color: "var(--text-primary)",
          fontFamily:
            kind === "paper" ? "var(--font-display)" : "var(--font-mono)",
          fontSize: 12,
          fontStyle: kind === "paper" ? "italic" : "normal",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {meta.body}
      </pre>
    </div>
  );
}

function LandingPainSolution() {
  return (
    <section id="product" className="sn-section">
      <div className="sn-shell">
        <SectionEyebrow>The Problem</SectionEyebrow>
        <SectionTitle>
          笔记越记越多,但
          <em style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
            从来没真正&quot;通&quot;过。
          </em>
        </SectionTitle>
        <div className="sn-grid-3" style={{ marginTop: 64 }}>
          <PainCard
            before
            n="01"
            title="论文堆在 Zotero"
            desc="读完三遍,公式编号都对不上,推导卡在 Eq. (7) 那一步没人能问。"
          />
          <PainCard
            before
            n="02"
            title="代码散在 GitHub"
            desc="跑通的小 demo 没法关联回它实现的是哪段推导。隔半年回看,都是孤岛。"
          />
          <PainCard
            before
            n="03"
            title="笔记孤立在 Notion"
            desc="文字 + 截图 + 公式图片,搜不到、引不回、不能被他人 cite。"
          />
        </div>
        <div
          style={{
            display: "flex",
            height: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg aria-hidden="true" width="80" height="80" viewBox="0 0 80 80">
            <path
              d="M40 8 L40 60 M28 48 L40 60 L52 48"
              stroke="var(--brand-cyan)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="sn-grid-3">
          <PainCard
            n="01"
            title="Math ↔ Paper"
            desc="选中推导某一步,直接 link 回论文 Eq. (7),hover 即可看到对端预览。"
          />
          <PainCard
            n="02"
            title="Code ↔ Math"
            desc="代码块标注 implements 关系,跨人引用形成可追踪的知识网络。"
          />
          <PainCard
            n="03"
            title="Public ↔ Private"
            desc="一键发布部分内容,被 cite 也只会指向你保留可见的 block。"
          />
        </div>
      </div>
    </section>
  );
}

function PainCard({
  before = false,
  n,
  title,
  desc,
}: {
  before?: boolean;
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="sn-card"
      style={{ position: "relative", padding: 24, opacity: before ? 0.65 : 1 }}
    >
      {!before ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 24,
            right: 24,
            height: 1,
            background: "var(--brand-cyan)",
          }}
        />
      ) : null}
      <div
        style={{
          color: before ? "var(--text-muted)" : "var(--brand-cyan)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
        }}
      >
        {before ? `BEFORE / ${n}` : `WITH SYNAPSE / ${n}`}
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: 0,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 10,
          color: "var(--text-secondary)",
          fontSize: 13.5,
          lineHeight: 1.65,
        }}
      >
        {desc}
      </div>
    </div>
  );
}

function LandingThreeLayers() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [centers, setCenters] = useState<Array<{
    x: number;
    y: number;
  }> | null>(null);

  useLayoutEffect(() => {
    if (!wrapRef.current) return;

    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const wrapBox = wrap.getBoundingClientRect();
      const cards = wrap.querySelectorAll("[data-layer-card]");
      const nextCenters: Array<{ x: number; y: number }> = [];
      cards.forEach((card) => {
        const box = card.getBoundingClientRect();
        nextCenters.push({
          x: box.left - wrapBox.left + box.width / 2,
          y: box.top - wrapBox.top + box.height / 2,
        });
      });
      setCenters(nextCenters);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="sn-section" style={{ overflow: "hidden" }}>
      <div className="sn-shell">
        <SectionEyebrow>The Three Layers</SectionEyebrow>
        <SectionTitle sub="一个 Note 由若干 Block 组成。Math / Code / Paper 三种核心 Block 类型是 Synapse 的原语,任意两块之间可以建立带语义的 Link。">
          三类 Block,一个语义层。
        </SectionTitle>

        <div ref={wrapRef} style={{ position: "relative", marginTop: 64 }}>
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <defs>
              <linearGradient id="layer-link-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--brand-cyan)" />
                <stop offset="55%" stopColor="var(--brand-cyan)" />
                <stop offset="100%" stopColor="var(--warning)" />
              </linearGradient>
              <filter id="layer-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {hover !== null && centers
              ? centers.map((from, index) => {
                  if (index !== hover) return null;
                  return centers.map((to, targetIndex) => {
                    if (targetIndex === index) return null;
                    const dx = to.x - from.x;
                    const cx = (from.x + to.x) / 2;
                    const cy = (from.y + to.y) / 2 - Math.abs(dx) * 0.22 - 30;
                    const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
                    return (
                      <g
                        key={`${index}-${targetIndex}`}
                        style={{ filter: "url(#layer-glow)" }}
                      >
                        <path
                          d={d}
                          stroke="url(#layer-link-grad)"
                          strokeWidth="1.8"
                          fill="none"
                          strokeDasharray="600"
                          strokeDashoffset="600"
                          opacity="0.9"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            from="600"
                            to="0"
                            dur="0.8s"
                            fill="freeze"
                          />
                        </path>
                        <circle r="3.5" fill="white">
                          <animateMotion
                            dur="1.6s"
                            repeatCount="indefinite"
                            path={d}
                          />
                        </circle>
                      </g>
                    );
                  });
                })
              : null}
          </svg>

          <div className="sn-grid-3" style={{ gap: 28 }}>
            <LayerCard
              index={0}
              kind="math"
              icon="∑"
              label="MathBlock"
              title="LaTeX,按推导步切片"
              desc="每个 \\\\ 即一步,每一步是独立锚点,可被外部 Block 指向。KaTeX 实时渲染。"
              file="attention.tex"
              setHover={setHover}
            >
              <MathRender />
            </LayerCard>
            <LayerCard
              index={1}
              kind="code"
              icon="</>"
              label="CodeBlock"
              title="可运行代码 + 环境"
              desc="多语言,一键复制环境到剪贴板。implements 标注指向它实现的推导步骤。"
              file="attention.py"
              setHover={setHover}
            >
              <pre style={snippetStyle}>
                {`def attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    s = (Q @ K.transpose(-2,-1)) / d_k**0.5
    if mask is not None: s += mask
    return softmax(s, -1) @ V`}
              </pre>
            </LayerCard>
            <LayerCard
              index={2}
              kind="paper"
              icon="¶"
              label="PaperBlock"
              title="规范化论文引用"
              desc="粘贴 arXiv 链接自动抓取元数据,划词建立 quote + anchor,全站去重。"
              file="1706.03762"
              setHover={setHover}
            >
              <pre
                style={{
                  ...snippetStyle,
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                }}
              >
                {`Vaswani et al. (2017)
Attention Is All You Need
arXiv:1706.03762  ·  NeurIPS

"...the dominant sequence transduction
models are based on complex recurrent
or convolutional neural networks..."  — §1`}
              </pre>
            </LayerCard>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 32,
            color: "var(--text-muted)",
            fontSize: 12,
          }}
        >
          <span>Hover 任意一张卡片查看跨块 Link 效果</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>5 种 relation 类型:</span>
          {[
            "implements",
            "derives_from",
            "cites",
            "contradicts",
            "extends",
          ].map((relation) => (
            <code className="sn-muted-code" key={relation}>
              {relation}
            </code>
          ))}
        </div>
      </div>
    </section>
  );
}

const snippetStyle = {
  margin: 0,
  padding: "12px 14px",
  color: "var(--text-primary)",
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  lineHeight: 1.55,
  whiteSpace: "pre-wrap",
} as const;

function LayerCard({
  index,
  kind,
  icon,
  label,
  title,
  desc,
  file,
  setHover,
  children,
}: {
  index: number;
  kind: Exclude<BlockKind, "concept">;
  icon: string;
  label: string;
  title: string;
  desc: string;
  file: string;
  setHover: (value: number | null) => void;
  children: React.ReactNode;
}) {
  const color = `var(--block-${kind})`;
  return (
    <article
      data-layer-card
      className="sn-card"
      onMouseEnter={() => setHover(index)}
      onMouseLeave={() => setHover(null)}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "24px 24px 24px 28px",
        cursor: "default",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 24,
          bottom: 24,
          left: 0,
          width: 3,
          borderRadius: 2,
          background: color,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${color}`,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${color}, transparent 80%)`,
            color,
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            color,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
          }}
        >
          {label.toUpperCase()}
        </span>
      </div>
      <h3
        style={{
          margin: "16px 0 0",
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: "8px 0 0",
          color: "var(--text-secondary)",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
      <div
        style={{
          marginTop: 18,
          overflow: "hidden",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          background: "rgba(0,0,0,.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "6px 12px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
          }}
        >
          <span>{file}</span>
          <span>↗ + Link</span>
        </div>
        {children}
      </div>
    </article>
  );
}

function MathRender() {
  return (
    <div
      style={{
        padding: "20px 4px",
        color: "var(--text-primary)",
        fontFamily: "var(--font-display)",
        fontSize: 19,
        letterSpacing: 0,
        textAlign: "center",
      }}
    >
      <span>
        Attention(<i>Q,K,V</i>) = softmax
      </span>
      <span
        style={{
          display: "inline-block",
          margin: "0 6px",
          textAlign: "center",
          verticalAlign: "middle",
        }}
      >
        <span
          style={{
            display: "block",
            borderBottom: "1.2px solid currentColor",
            padding: "0 4px",
          }}
        >
          <i>QK</i>
          <sup>⊤</sup>
        </span>
        <span style={{ display: "block", padding: "0 4px" }}>
          √
          <span style={{ borderTop: "1.2px solid currentColor" }}>
            <i>
              d<sub>k</sub>
            </i>
          </span>
        </span>
      </span>
      <span>
        <i>V</i>
      </span>
    </div>
  );
}

function LandingGraphDemo() {
  const graph = useAttentionGraph();

  return (
    <section id="graph" className="sn-section">
      <div className="sn-shell">
        <SectionEyebrow>Live Knowledge Graph</SectionEyebrow>
        <SectionTitle sub="拖动节点观察一个真实学习历程的拓扑。颜色区分 Math / Code / Paper / 关键概念,边代表显式建立的 Link。">
          每个 Note 是节点,
          <br />
          每次&quot;通了&quot;都是一条边。
        </SectionTitle>
        <div className="sn-graph-layout" style={{ marginTop: 56 }}>
          <div
            className="sn-card"
            style={{ position: "relative", overflow: "hidden", padding: 0 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border-subtle)",
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  color: "var(--text-secondary)",
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    color: "var(--brand-cyan)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                >
                  ● LIVE
                </span>
                <span>u/zhe-li · Transformer 精读 · 28 nodes · 41 edges</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["2D", "3D", "Tags"].map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    style={{
                      height: 26,
                      padding: "0 10px",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 6,
                      background:
                        index === 0 ? "rgba(77,208,255,.08)" : "transparent",
                      color:
                        index === 0
                          ? "var(--brand-cyan)"
                          : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: 11,
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                overflowX: "auto",
                padding: 16,
                background:
                  "radial-gradient(ellipse at center, rgba(77,208,255,.04), transparent 70%)",
              }}
            >
              <ForceGraph
                nodes={graph.nodes}
                links={graph.links}
                width={720}
                height={440}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <GraphLegend />
            <SideList
              title="Top hubs"
              rows={[
                ["Scaled Dot-Product", "12 edges"],
                ["Multi-Head Attention", "9 edges"],
                ["Positional Encoding", "7 edges"],
                ["LayerNorm", "5 edges"],
              ]}
            />
            <SideList
              title="Recent Links"
              rows={[
                ["Multi-Head → Q,K,V 投影", "implements"],
                ["Softmax → log-sum-exp 稳定", "extends"],
                ["MLA (DeepSeek) → Attention 原文", "cites"],
              ]}
              accent
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GraphLegend() {
  const items: Array<[string, string]> = [
    ["Math", "var(--block-math)"],
    ["Code", "var(--block-code)"],
    ["Paper", "var(--block-paper)"],
    ["Concept", "var(--brand-cyan)"],
  ];
  return (
    <div className="sn-card" style={{ padding: 18 }}>
      <div
        style={{
          marginBottom: 12,
          color: "var(--text-muted)",
          fontSize: 11,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        Legend
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(([name, color]) => (
          <div
            key={name}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 12px ${color}`,
              }}
            />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

function SideList({
  title,
  rows,
  accent = false,
}: {
  title: string;
  rows: string[][];
  accent?: boolean;
}) {
  return (
    <div className="sn-card" style={{ padding: 18 }}>
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: 11,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      {rows.map(([left, right]) => (
        <div
          key={left}
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "8px 0",
            fontSize: 12,
          }}
        >
          <div
            style={{
              display: accent ? "block" : "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>{left}</span>
            <span
              className="sn-num"
              style={{
                color: accent ? "var(--brand-cyan)" : "var(--text-muted)",
                fontFamily: accent ? "var(--font-mono)" : undefined,
                fontSize: accent ? 10 : undefined,
              }}
            >
              {right}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LandingCommunity() {
  const cards = [
    {
      handle: "zhe-li",
      name: "李哲",
      title: "PPO from Bellman to Implementation",
      meta: "24 Notes · 12 Tracks",
      tags: ["RL", "Math"],
      color: "#4DD0FF",
    },
    {
      handle: "aria-chen",
      name: "Aria Chen",
      title: "扩散模型推导精读 · DDPM 到 DDIM",
      meta: "18 Notes · 6 Tracks",
      tags: ["Diffusion"],
      color: "#60A5FA",
    },
    {
      handle: "qixin",
      name: "齐欣",
      title: "Attention Is All You Need 逐节拆解",
      meta: "31 Notes · 8 Tracks",
      tags: ["Transformer", "Paper"],
      color: "#E07856",
    },
    {
      handle: "maxwell-tu",
      name: "Maxwell Tu",
      title: "GRPO 复现:从原理到 8x H100",
      meta: "12 Notes · 3 Tracks",
      tags: ["RLHF", "2025"],
      color: "#6EE7B7",
    },
    {
      handle: "lin-jiayi",
      name: "林佳怡",
      title: "CS-MoE 路由设计实验日志",
      meta: "9 Notes · 2 Tracks",
      tags: ["MoE"],
      color: "#FBBF24",
    },
    {
      handle: "shubham-r",
      name: "Shubham R.",
      title: "Linear Algebra Done Right · 习题集",
      meta: "47 Notes · 4 Tracks",
      tags: ["Math", "基础"],
      color: "#93C5FD",
    },
  ];

  return (
    <section id="community" className="sn-section">
      <div className="sn-shell">
        <SectionEyebrow>Community</SectionEyebrow>
        <SectionTitle sub="每个公开的 Track 都是一份可追踪、可派生、可被 cite 的学习历程。点开任意 Track 看到从论文到代码的完整跳转链路。">
          看别人是怎么&quot;想通&quot;的。
        </SectionTitle>
        <div className="sn-grid-3" style={{ marginTop: 56, gap: 20 }}>
          {cards.map((card) => (
            <CommunityCard key={card.handle} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityCard({
  card,
}: {
  card: {
    handle: string;
    name: string;
    title: string;
    meta: string;
    tags: string[];
    color: string;
  };
}) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--border-subtle)",
        padding: "18px 0 24px",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 76,
          overflow: "hidden",
          background: `radial-gradient(ellipse at 30% 100%, ${card.color}22, transparent 64%)`,
        }}
      >
        <MiniGraphTexture color={card.color} />
      </div>
      <div style={{ paddingTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-strong)",
              borderRadius: "50%",
              background: card.color,
              color: "#fff",
              fontSize: 12,
              fontWeight: 650,
            }}
          >
            {card.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 550 }}>{card.name}</div>
            <div
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
              }}
            >
              @{card.handle}
            </div>
          </div>
          <button
            type="button"
            style={{
              height: 26,
              marginLeft: "auto",
              padding: "0 12px",
              border: "1px solid var(--border-strong)",
              borderRadius: 999,
              background: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            + Follow
          </button>
        </div>
        <h3
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            fontWeight: 650,
            lineHeight: 1.35,
            letterSpacing: 0,
          }}
        >
          {card.title}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 12,
            color: "var(--text-muted)",
            fontSize: 11,
          }}
        >
          <span>{card.meta}</span>
          <span style={{ display: "flex", gap: 6 }}>
            {card.tags.map((tag) => (
              <code
                className="sn-muted-code"
                key={tag}
                style={{ fontSize: 10 }}
              >
                {tag}
              </code>
            ))}
          </span>
        </div>
      </div>
    </article>
  );
}

function MiniGraphTexture({ color }: { color: string }) {
  const points = [
    [22, 50],
    [54, 32],
    [86, 60],
    [118, 28],
    [148, 64],
    [180, 36],
    [212, 58],
    [244, 30],
    [276, 56],
    [306, 38],
    [70, 76],
    [134, 80],
    [200, 78],
    [258, 76],
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [0, 10],
    [2, 10],
    [3, 11],
    [5, 11],
    [6, 12],
    [8, 12],
    [8, 13],
    [9, 13],
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 340 92"
      style={{ width: "100%", height: "100%" }}
    >
      {edges.map(([a, b], index) => (
        <line
          key={index}
          x1={points[a][0]}
          y1={points[a][1]}
          x2={points[b][0]}
          y2={points[b][1]}
          stroke={color}
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      ))}
      {points.map(([x, y], index) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={index % 4 === 0 ? 3 : 2}
          fill={color}
          fillOpacity={index % 4 === 0 ? 0.9 : 0.6}
        />
      ))}
    </svg>
  );
}

function LandingWorkflow() {
  const steps = [
    {
      keyword: "01 · Read",
      title: "读论文",
      kind: "paper" as BlockKind,
      desc: "粘贴 arXiv 链接,自动抓取元数据并去重。划词建立 quote + 公式锚点。",
      meta: ["arxiv:1706.03762", "Vaswani 2017", "6 quotes"],
    },
    {
      keyword: "02 · Derive",
      title: "写推导",
      kind: "math" as BlockKind,
      desc: "LaTeX 编辑器实时 KaTeX 预览。按 \\\\ 切分推导步,每一步都可被外部 Link 指向。",
      meta: ["KaTeX", "12 steps", "3 anchors"],
    },
    {
      keyword: "03 · Implement",
      title: "写代码",
      kind: "code" as BlockKind,
      desc: "CodeMirror 6 多语言;一键复制环境到剪贴板。implements 链回推导第 N 步。",
      meta: ["python · torch", "78 LOC", "implements: §3.2(7)"],
    },
    {
      keyword: "04 · Publish",
      title: "发布并被引",
      kind: "concept" as BlockKind,
      desc: "切换 visibility 至 public,触发 embedding worker,自动出现在相关 Note 的推荐位。",
      meta: ["public", "+ embedding", "2 hops away from PPO"],
    },
  ];

  return (
    <section id="workflow" className="sn-section">
      <div className="sn-shell">
        <SectionEyebrow>How it works</SectionEyebrow>
        <SectionTitle sub="从一篇论文到被社区引用,一条线走完。每一步留下的不只是文字,而是结构化的、可被检索的、可被打通的 Block。">
          四步,从论文到被引用。
        </SectionTitle>
        <div
          className="sn-grid-4"
          style={{ position: "relative", marginTop: 56 }}
        >
          <div
            style={{
              position: "absolute",
              top: 60,
              left: "12.5%",
              right: "12.5%",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--brand-cyan) 30%, var(--warning) 70%, transparent)",
            }}
          />
          {steps.map((step, index) => (
            <article
              key={step.keyword}
              className="sn-card"
              style={{ position: "relative", padding: 22 }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -16,
                  left: 22,
                  display: "flex",
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1.5px solid ${blockColor(step.kind)}`,
                  borderRadius: "50%",
                  background: "var(--bg-base)",
                  color: blockColor(step.kind),
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  marginTop: 14,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                }}
              >
                {step.keyword}
              </div>
              <h3
                style={{
                  margin: "6px 0 0",
                  fontSize: 19,
                  fontWeight: 650,
                  letterSpacing: 0,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  margin: "10px 0 0",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginTop: 16,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                }}
              >
                {step.meta.map((item) => (
                  <span key={item}>→ {item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingPricing() {
  const plans = [
    {
      name: "Free",
      price: "¥0",
      sub: "永久免费",
      feats: [
        "个人 Note 无限",
        "公开/私密自由切换",
        "3 个 Track",
        "基础知识图谱",
      ],
      cta: "免费开始",
    },
    {
      name: "Pro",
      price: "¥39",
      sub: "/月 · 即将上线",
      feats: [
        "无限 Track",
        "embedding 推荐",
        "导出 PDF / Markdown",
        "PDF 高亮锚点",
        "优先客服",
      ],
      cta: "加入等待列表",
      highlight: true,
      badge: "Coming Soon",
    },
    {
      name: "Team",
      price: "联系我们",
      sub: "机构与团队",
      feats: [
        "SSO · SAML",
        "团队共享 Track",
        "私有部署",
        "API & Webhooks",
        "专属审核",
      ],
      cta: "联系销售",
    },
  ];

  return (
    <section id="pricing" className="sn-section">
      <div className="sn-shell">
        <SectionEyebrow>Pricing</SectionEyebrow>
        <SectionTitle sub="个人学习永远免费。Pro 加入向量推荐与导出能力。团队版面向高校实验室与企业训练团队。">
          为认真学习的人定价。
        </SectionTitle>
        <div className="sn-grid-3" style={{ marginTop: 56, gap: 20 }}>
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="sn-card"
              style={{
                position: "relative",
                borderColor: plan.highlight
                  ? "var(--brand-cyan)"
                  : "var(--border-subtle)",
                padding: 28,
              }}
            >
              {plan.badge ? (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "var(--brand-cyan)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                  }}
                >
                  {plan.badge}
                </div>
              ) : null}
              <div style={{ fontSize: 14, fontWeight: 650, letterSpacing: 0 }}>
                {plan.name}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "var(--font-display)",
                  fontSize: 40,
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                {plan.price}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                {plan.sub}
              </div>
              <a
                className={`sn-btn ${plan.highlight ? "sn-btn-dark" : "sn-btn-glass"}`}
                href="#faq"
                style={{ width: "100%", marginTop: 22 }}
              >
                {plan.cta}
              </a>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  margin: "22px 0 0",
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {plan.feats.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      gap: 8,
                      color: "var(--text-secondary)",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "var(--brand-cyan)" }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFAQ() {
  const items = [
    [
      "Synapse 和 Notion / Obsidian 的区别?",
      "它们是通用笔记;Synapse 是 AI 学习专属的语义层:Math/Code/Paper 三种原语 + 一等公民的 Link + embedding 推荐 + 公开社区图谱。结构化优先于自由排版。",
    ],
    [
      "可以保留隐私吗?",
      "当然。每个 Note / Track 有三档可见度 (private / unlisted / public),被引也只会指向你保留可见的 Block。",
    ],
    [
      "代码会在服务器上跑吗?",
      "MVP 阶段不在服务器上执行用户代码。我们提供「一键复制环境」(requirements.txt / go.mod),让你本地可复现。",
    ],
    [
      "支持中文公式 / 注释吗?",
      "全栈支持。KaTeX 渲染、CodeMirror 编辑、评论 Markdown 均覆盖中文。中文标题用 HarmonyOS Sans SC / PingFang SC。",
    ],
    [
      "有 API / 数据导出吗?",
      "Pro 版本提供 JSON / Markdown 全量导出。注销账户后,数据软删 30 天后清理。",
    ],
  ];
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="sn-section">
      <div className="sn-shell" style={{ maxWidth: 880 }}>
        <SectionEyebrow>FAQ</SectionEyebrow>
        <SectionTitle>常见问题</SectionTitle>
        <div
          style={{ marginTop: 48, borderTop: "1px solid var(--border-subtle)" }}
        >
          {items.map(([question, answer], index) => (
            <div
              key={question}
              style={{ borderBottom: "1px solid var(--border-subtle)" }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 4px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 550,
                  textAlign: "left",
                }}
              >
                <span>{question}</span>
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 18,
                    transform: open === index ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform .2s",
                  }}
                >
                  +
                </span>
              </button>
              {open === index ? (
                <div
                  style={{
                    padding: "0 4px 20px",
                    color: "var(--text-secondary)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {answer}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  const groups: Array<[string, string[]]> = [
    ["Product", ["Tour", "Pricing", "Changelog", "Roadmap"]],
    ["Community", ["Explore", "Top Tracks", "Tags", "Discord"]],
    ["Resources", ["Docs", "API", "Design System", "Blog"]],
    ["Company", ["About", "Privacy", "Terms", "Contact"]],
  ];

  return (
    <footer className="sn-footer">
      <div className="sn-shell">
        <div className="sn-footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SynapseLogo size={20} />
              <span style={{ fontWeight: 650 }}>Synapse</span>
            </div>
            <p
              style={{
                maxWidth: 320,
                margin: "12px 0 0",
                color: "var(--text-secondary)",
                fontSize: 13,
                lineHeight: 1.65,
              }}
            >
              让你的 AI 学习不再是孤岛。数学 ↔ 代码 ↔ 论文
              三位一体的开源学习社区。
            </p>
          </div>
          {groups.map(([group, links]) => (
            <div key={group}>
              <div
                style={{
                  marginBottom: 14,
                  color: "var(--text-muted)",
                  fontSize: 11,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {group}
              </div>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {links.map((item) => (
                  <li
                    key={item}
                    style={{ color: "var(--text-secondary)", fontSize: 13 }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="sn-footer-bottom">
          <div>© 2026 Synapse Labs. 保留所有权利.</div>
          <div style={{ display: "flex", gap: 18 }}>
            <span>中文</span>
            <span>GitHub</span>
            <span>Twitter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <div className="sn-eyebrow">● {children}</div>;
}

function SectionTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) {
  return (
    <>
      <h2 className="sn-section-title">{children}</h2>
      {sub ? <p className="sn-section-sub">{sub}</p> : null}
    </>
  );
}

function blockColor(kind: BlockKind) {
  if (kind === "concept") return "var(--brand-cyan)";
  return `var(--block-${kind})`;
}
