"use client";

import { useEffect, useState } from "react";
import { SynapseLogo } from "@/components/synapse/synapse-logo";
import { ForceGraph, useAttentionGraph } from "./force-graph";
import { SynapseParticles } from "./synapse-particles";

const HERO_PARTICLE_PALETTE = ["#6B7280", "#A8A8B3", "#F4F4F7"];

type BlockKind = "math" | "code" | "paper" | "concept";
type CommunityNodeKind = "Math" | "Code" | "Paper";

export function LandingPage() {
  useScrollReveal();

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
      <LandingFinalCTA />
      <LandingFooter />
    </main>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".sn-reveal"),
    );
    if (!nodes.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
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
        {/* §1.a 删除右上角“开始学习”按钮。§1.b 登录改成纯文本链接。 */}
        <a
          className="text-sm font-normal text-[#6B7280] transition-colors hover:text-[#111827]"
          href="/auth?mode=login"
        >
          Log in
        </a>
      </div>
    </header>
  );
}

function LandingHero() {
  return (
    <section id="top" className="sn-hero">
      <div className="sn-hero-radial" />
      <SynapseParticles nodeCount={280} colors={HERO_PARTICLE_PALETTE} />

      <div className="sn-hero-content">
        {/* §1.c 删除 hero 中部发布 pill，BETA 信息只保留在导航。 */}
        {/* §4 重写 hero 标语，去掉衬线、中英混排和 Learn X as Y 句式。 */}
        <h1 className="mx-auto m-0 max-w-[760px] text-[clamp(28px,8.2vw,52px)] leading-[1.16] font-semibold tracking-normal whitespace-nowrap text-white [font-family:var(--font-sans)] sm:leading-[1.18]">
          让论文、公式和代码
          <br />
          互相指向
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[clamp(16px,1.8vw,18px)] leading-[1.6] font-normal text-[#9CA3AF]">
          下次想不起 §3.2 那一步时，能从代码一路反查回原文。
        </p>
        <div className="sn-hero-ctas">
          <a className="sn-btn sn-btn-primary" href="/auth?mode=register">
            开始构建我的第二大脑 →
          </a>
          <a className="sn-btn sn-btn-glass" href="#community">
            浏览社区 Explore
          </a>
        </div>
        {/* §3 删除 BETA 期假数据统计行。 */}
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
                      ? "2px solid var(--text-muted)"
                      : "2px solid transparent",
                    borderRadius: 6,
                    background: active
                      ? "rgba(255,255,255,.05)"
                      : "transparent",
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
            <span style={{ color: "var(--text-muted)" }}>PAPER</span>
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
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                }}
              >
                · {relation}
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
      label: "MATH · LaTeX",
      body: "Attention(Q,K,V) = softmax( QKᵀ / √dₖ ) V",
    },
    code: {
      label: "CODE · Python",
      body: "def scaled_dot_product(q, k, v, mask=None):\n    scores = q @ k.transpose(-2,-1) / math.sqrt(d_k)\n    if mask is not None: scores += mask\n    return softmax(scores, -1) @ v",
    },
    paper: {
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
          background: "var(--border-strong)",
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
            color: "var(--text-muted)",
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
    <section id="product" className="sn-section sn-reveal">
      <div className="sn-shell">
        <h2 className="m-0 max-w-[1080px] text-[clamp(32px,4vw,40px)] leading-[1.14] font-semibold tracking-normal text-balance [color:var(--text-primary)] [font-family:var(--font-sans)]">
          读完三遍论文还是想不起来 §3.2 那一步——这不是你的问题，是工具的问题。
        </h2>
        <div className="mt-[60px] grid items-center gap-10 lg:grid-cols-[minmax(0,720px)_minmax(320px,1fr)]">
          <div className="max-w-[720px] text-[18px] leading-[1.7] text-[#D1D5DB]">
            <p className="m-0">
              论文堆在 Zotero 里读完就忘。代码散落在 GitHub
              仓库里，半年回看搜不回是哪一步的推导。笔记孤立在 Notion
              里，公式截图既无法被检索，也不能被他人引用。
            </p>
            <p className="mt-7 mb-0">
              三个工具中间，永远缺一座桥——Synapse 是这座桥。
            </p>
          </div>
          <ProblemBridgeDiagram />
        </div>
      </div>
    </section>
  );
}

function ProblemBridgeDiagram() {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full text-[#F4F4F7]"
      viewBox="0 0 420 260"
    >
      <g fontFamily="Inter, system-ui, sans-serif" fontSize="12">
        {[
          ["Zotero", 24, 34],
          ["GitHub", 24, 106],
          ["Notion", 24, 178],
        ].map(([label, x, y]) => (
          <g key={label}>
            <rect
              fill="rgba(255,255,255,0.035)"
              height="46"
              rx="6"
              stroke="rgba(255,255,255,0.16)"
              width="92"
              x={x}
              y={y}
            />
            <text
              fill="rgba(244,244,247,0.72)"
              x={Number(x) + 18}
              y={Number(y) + 29}
            >
              {label}
            </text>
          </g>
        ))}

        {[
          "M126 57 C166 57 174 62 204 74",
          "M126 129 C164 129 176 128 204 126",
          "M126 201 C166 201 174 190 204 178",
        ].map((path, index) => (
          <path
            d={path}
            fill="none"
            key={path}
            stroke="rgba(255,255,255,0.28)"
            strokeDasharray="8 9"
            strokeLinecap="round"
            strokeWidth="1.4"
            opacity={index === 1 ? 0.9 : 0.62}
          />
        ))}

        <g transform="translate(234 42)">
          <path
            d="M74 26 L34 66 L82 106 L124 70 M82 106 L58 156 M82 106 L132 156 M34 66 L18 132"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1.4"
          />
          {[
            ["Paper", 74, 26, 15],
            ["Math", 34, 66, 13],
            ["Code", 82, 106, 17],
            ["Note", 124, 70, 13],
            ["Quote", 18, 132, 12],
            ["Run", 58, 156, 12],
            ["Link", 132, 156, 12],
          ].map(([label, cx, cy, r]) => (
            <g key={label}>
              <circle
                cx={cx}
                cy={cy}
                fill="rgba(255,255,255,0.1)"
                r={r}
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="1.2"
              />
              <text
                fill="rgba(244,244,247,0.82)"
                fontSize="10"
                textAnchor="middle"
                x={cx}
                y={Number(cy) + Number(r) + 14}
              >
                {label}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

function LandingThreeLayers() {
  return (
    <section className="sn-section sn-reveal" style={{ overflow: "hidden" }}>
      <div className="sn-shell">
        <div>
          <div className="text-[11px] tracking-[0.08em] [color:var(--text-muted)] [font-family:var(--font-mono)]">
            02 / 结构
          </div>
          <h2 className="mt-3 mb-0 max-w-[720px] text-[28px] leading-[1.22] font-semibold tracking-normal [color:var(--text-primary)] [font-family:var(--font-sans)]">
            三类 Block,一个语义层。
          </h2>
          <p className="sn-section-sub">
            一个 Note 由若干 Block 组成。Math / Code / Paper 三种核心 Block
            类型是 Synapse 的原语,任意两块之间可以建立带语义的 Link。
          </p>
        </div>

        <div style={{ marginTop: 64 }}>
          <div
            className="sn-grid-3 sn-reveal sn-reveal-list"
            style={{ gap: 28 }}
          >
            <LayerCard
              kind="math"
              icon="∑"
              label="MathBlock"
              title="LaTeX,按推导步切片"
              desc="每个 \\\\ 即一步,每一步是独立锚点,可被外部 Block 指向。KaTeX 实时渲染。"
              file="attention.tex"
            >
              <MathRender />
            </LayerCard>
            <LayerCard
              kind="code"
              icon="</>"
              label="CodeBlock"
              title="可运行代码 + 环境"
              desc="多语言,一键复制环境到剪贴板。implements 标注指向它实现的推导步骤。"
              file="attention.py"
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
              kind="paper"
              icon="¶"
              label="PaperBlock"
              title="规范化论文引用"
              desc="粘贴 arXiv 链接自动抓取元数据,划词建立 quote + anchor,全站去重。"
              file="1706.03762"
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
  kind,
  icon,
  label,
  title,
  desc,
  file,
  children,
}: {
  kind: Exclude<BlockKind, "concept">;
  icon: string;
  label: string;
  title: string;
  desc: string;
  file: string;
  children: React.ReactNode;
}) {
  const color = blockColor(kind);
  return (
    <article
      data-layer-card
      data-kind={kind}
      className="sn-card"
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
            background: "rgba(255,255,255,.04)",
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
    <section id="graph" className="sn-section sn-reveal">
      <div className="sn-shell">
        <div className="sn-graph-layout">
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
                    color: "#EF4444",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                  }}
                >
                  ● LIVE
                </span>
                <span>u/zhe-li · Transformer 精读 · 28 nodes · 41 edges</span>
              </div>
            </div>
            <div
              style={{
                overflowX: "auto",
                padding: 16,
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,.035), transparent 70%)",
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
                ["Scaled Dot-Product", "12 edges", "2h ago"],
                ["Multi-Head Attention", "9 edges", "5h ago"],
                ["Positional Encoding", "7 edges", "1d ago"],
                ["LayerNorm", "5 edges", "2d ago"],
              ]}
            />
            <SideList
              title="Recent Links"
              rows={[
                ["Multi-Head → Q,K,V 投影", "implements", "18m ago"],
                ["Softmax → log-sum-exp 稳定", "extends", "47m ago"],
                ["MLA (DeepSeek) → Attention 原文", "cites", "3h ago"],
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
    ["Math", "var(--color-math)"],
    ["Code", "var(--color-code)"],
    ["Paper", "var(--color-paper)"],
    ["Concept", "var(--color-concept)"],
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
  rows: Array<[string, string, string]>;
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
      {rows.map(([left, right, time]) => (
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
                color: "var(--text-muted)",
                fontFamily: accent ? "var(--font-mono)" : undefined,
                fontSize: accent ? 10 : undefined,
              }}
            >
              {right}
              <span style={{ color: "#6B7280", fontSize: 11 }}> · {time}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LandingCommunity() {
  const featured = {
    handle: "aria-chen",
    name: "Aria Chen",
    quote:
      "我花了三天才搞懂 RoPE 的相对位置编码。把 Su 的原论文、苏剑林的中文推导、和 LLaMA 的 rotary_emb.py 拴在同一个节点上之后，它就再也没跑掉过。",
    meta: "@aria-chen · 位置编码精读 · 18 nodes · 3 天前",
    avatarColor: "var(--color-paper)",
  };

  const tracks: Array<{
    handle: string;
    name: string;
    title: string;
    avatarColor: string;
    nodes: Array<{ kind: CommunityNodeKind; title: string }>;
  }> = [
    {
      handle: "zhe-li",
      name: "李哲",
      title: "RoPE → ALiBi → YaRN：位置编码三连",
      avatarColor: "var(--color-paper)",
      nodes: [
        { kind: "Paper", title: "RoFormer §2.1: rotary position embedding" },
        { kind: "Math", title: "复数旋转到相对位移内积" },
        { kind: "Code", title: "apply_rotary_pos_emb 的 broadcast 维度" },
      ],
    },
    {
      handle: "qixin",
      name: "齐欣",
      title: "从 PPO 的 importance ratio 到 GRPO 砍掉 critic",
      avatarColor: "var(--color-math)",
      nodes: [
        { kind: "Paper", title: "DeepSeekMath Appendix: GRPO objective" },
        { kind: "Math", title: "ratio clipping 与 KL 惩罚项" },
        { kind: "Code", title: "group_advantages_without_value_head.py" },
      ],
    },
    {
      handle: "lin-jiayi",
      name: "林佳怡",
      title: "Diffusion 三种参数化：ε / x₀ / v 各自的代码差异",
      avatarColor: "var(--color-code)",
      nodes: [
        { kind: "Paper", title: "Progressive Distillation §2.4 v-prediction" },
        { kind: "Math", title: "ε-pred 与 x₀-pred 的互换" },
        { kind: "Code", title: "scheduler.step(): prediction_type switch" },
      ],
    },
    {
      handle: "maxwell-tu",
      name: "Maxwell Tu",
      title: "FlashAttention 的 IO-aware 证明怎么落到 kernel",
      avatarColor: "var(--color-concept)",
      nodes: [
        { kind: "Paper", title: "FlashAttention §3: tiling strategy" },
        { kind: "Math", title: "HBM 访问次数的上界" },
        { kind: "Code", title: "flash_fwd_kernel.cu 的 block loop" },
      ],
    },
  ];

  return (
    <section id="community" className="sn-section sn-reveal">
      <div className="sn-shell">
        {/* §2 社区 label 改为“数字 / 中文”格式。 */}
        <div className="text-[11px] tracking-[0.05em] text-[#9CA3AF] [font-family:var(--font-mono)]">
          03 / 社区 · 最近一周 23 个新 Track
        </div>

        <div className="sn-reveal sn-reveal-list mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FeaturedCommunityCard item={featured} />
          {tracks.map((track) => (
            <CommunityTrackCard key={track.handle} track={track} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCommunityCard({
  item,
}: {
  item: {
    handle: string;
    name: string;
    quote: string;
    meta: string;
    avatarColor: string;
  };
}) {
  return (
    <article className="relative overflow-hidden rounded-md border border-[#1F1F1F] bg-[#0A0A0A] p-6 transition-colors hover:border-[#2F2F2F] lg:col-span-2">
      <a
        href="/app"
        className="absolute top-5 right-5 text-xs font-medium [color:var(--text-secondary)] transition-colors hover:[color:var(--text-primary)]"
      >
        查看完整 Track →
      </a>

      <div className="grid gap-6 pr-0 md:grid-cols-[220px_1fr] md:pr-36">
        <div className="flex items-center gap-4 md:block">
          <CommunityAvatar
            color={item.avatarColor}
            name={item.name}
            size="lg"
          />
          <div className="md:mt-4">
            <div className="text-base font-medium [color:var(--text-primary)]">
              {item.name}
            </div>
            <div className="mt-1 text-[11px] [color:var(--text-muted)] [font-family:var(--font-mono)]">
              @{item.handle}
            </div>
          </div>
        </div>

        <blockquote className="m-0 text-[clamp(18px,2.1vw,25px)] leading-[1.48] font-medium tracking-normal [color:var(--text-primary)] [font-family:var(--font-sans)]">
          “{item.quote}”
        </blockquote>
      </div>

      <div className="mt-6 border-t border-[#1F1F1F] pt-4 text-xs [color:var(--text-muted)]">
        {item.meta}
      </div>
    </article>
  );
}

function CommunityTrackCard({
  track,
}: {
  track: {
    handle: string;
    name: string;
    title: string;
    avatarColor: string;
    nodes: Array<{ kind: CommunityNodeKind; title: string }>;
  };
}) {
  return (
    <article className="group flex min-h-[272px] flex-col rounded-md border border-[#1F1F1F] bg-[#111111] p-5 transition-colors hover:border-[#2F2F2F]">
      <h3 className="m-0 text-lg leading-snug font-medium tracking-normal [color:var(--text-primary)]">
        {track.title}
      </h3>

      <div className="mt-5 flex flex-col gap-0">
        {track.nodes.map((node) => (
          <div
            key={`${node.kind}-${node.title}`}
            className="grid grid-cols-[74px_1fr] gap-3 border-t border-[#1F1F1F] py-2.5 text-sm first:border-t-0 first:pt-0"
          >
            <div className="flex items-center gap-2 text-[11px] [color:var(--text-muted)] [font-family:var(--font-mono)]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-[#242424] bg-[#161616] text-[10px] [color:var(--text-secondary)]">
                {communityNodeIcon(node.kind)}
              </span>
              {node.kind}
            </div>
            <div className="min-w-0 leading-relaxed [color:var(--text-secondary)]">
              {node.title}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-[#1F1F1F] pt-4">
        <CommunityAvatar color={track.avatarColor} name={track.name} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium [color:var(--text-primary)]">
            {track.name}
          </div>
          <div className="truncate text-[10.5px] [color:var(--text-muted)] [font-family:var(--font-mono)]">
            @{track.handle}
          </div>
        </div>
        <button
          type="button"
          className="pointer-events-none h-7 rounded border border-[#2A2A2A] bg-transparent px-3 text-[11px] font-medium opacity-0 [color:var(--text-secondary)] transition-all group-hover:pointer-events-auto group-hover:opacity-100 hover:border-[#3A3A3A] hover:[color:var(--text-primary)]"
        >
          Follow
        </button>
      </div>
    </article>
  );
}

function CommunityAvatar({
  color = "#1A1A1A",
  name,
  size = "sm",
}: {
  color?: string;
  name: string;
  size?: "sm" | "lg";
}) {
  const isLarge = size === "lg";

  return (
    <div
      className={[
        "flex shrink-0 items-center justify-center rounded-md border border-[#2A2A2A] bg-[#1A1A1A] font-semibold text-white",
        isLarge ? "h-16 w-16 text-xl" : "h-8 w-8 text-xs",
      ].join(" ")}
      style={{ background: color }}
    >
      {name[0]}
    </div>
  );
}

function communityNodeIcon(kind: CommunityNodeKind) {
  return {
    Math: "∑",
    Code: "</>",
    Paper: "¶",
  }[kind];
}

function LandingWorkflow() {
  const events = [
    {
      time: "09:41",
      label: "PaperBlock",
      title: "导入 Vaswani 2017",
      kind: "paper" as BlockKind,
      detail:
        "Attention Is All You Need 进入 Transformer 精读，标题、作者、年份自动归一。",
      meta: ["arxiv:1706.03762", "6 highlights", "23 quotes"],
    },
    {
      time: "10:08",
      label: "MathBlock",
      title: "固定 §3.2 的 scale 推导",
      kind: "math" as BlockKind,
      detail: "把 QK^T / √d_k 拆成 12 个推导步，其中 3 步被标成可引用 anchor。",
      meta: ["12 steps", "KaTeX rendered", "3 anchors"],
    },
    {
      time: "10:36",
      label: "CodeBlock",
      title: "提交 attention.py 片段",
      kind: "code" as BlockKind,
      detail:
        "78 行 PyTorch 代码通过 smoke test，implements 指向 MathBlock #scale。",
      meta: ["78 LOC", "python", "1 test"],
    },
    {
      time: "10:52",
      label: "Track",
      title: "发布 Transformer 精读",
      kind: "concept" as BlockKind,
      detail:
        "Track 切换为 public，embedding worker 完成索引，并发现 2 条 incoming cites。",
      meta: ["public", "embedded", "2 incoming cites"],
    },
  ];

  return (
    <section id="workflow" className="sn-section sn-section-quiet sn-reveal">
      <div className="sn-shell">
        <div className="sn-workflow-head">
          <div>
            <SectionEyebrow>04 / 使用流</SectionEyebrow>
            <h2 className="sn-section-title sn-section-title-small">
              一条 Track 是这样长出来的。
            </h2>
          </div>
          <p>
            不把步骤包装成营销流程，只保留产品里会留下的真实事件：导入、锚定、实现、发布。
          </p>
        </div>

        <div className="sn-workflow-log sn-reveal sn-reveal-list">
          {events.map((event) => (
            <article key={event.time} className="sn-workflow-event">
              <div className="sn-workflow-time">{event.time}</div>
              <div
                className="sn-workflow-dot"
                style={{ background: blockColor(event.kind) }}
              />
              <div className="sn-workflow-body">
                <div className="sn-workflow-label">{event.label}</div>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
                <div className="sn-workflow-meta">
                  {event.meta.map((item, index) => (
                    <span key={item}>
                      {index > 0 ? "· " : ""}
                      {item}
                    </span>
                  ))}
                </div>
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
      sub: "/月 · waitlist",
      feats: [
        "无限 Track",
        "embedding 推荐",
        "导出 PDF / Markdown",
        "PDF 高亮锚点",
        "优先客服",
      ],
      cta: "加入等待列表",
      highlight: true,
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
    <section id="pricing" className="sn-section sn-section-quiet sn-reveal">
      <div className="sn-shell">
        <div className="sn-quiet-heading">
          <SectionEyebrow>05 / 账户</SectionEyebrow>
          <h2 className="sn-section-title sn-section-title-small">
            Beta 期间的账户规则。
          </h2>
          <p>
            免费层先保证能长期使用；Pro 和 Team
            只把更重的导出、协作和部署能力放进去。
          </p>
        </div>
        <div
          className="sn-grid-3 sn-reveal sn-reveal-list"
          style={{ marginTop: 40, gap: 16 }}
        >
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="sn-card sn-pricing-card"
              style={{
                position: "relative",
                borderColor: plan.highlight ? "#3F3F3F" : undefined,
                borderWidth: plan.highlight ? 2 : undefined,
                background: plan.highlight ? "#111111" : undefined,
              }}
            >
              {/* §5.a Pro 卡片改为推荐态，删除 Coming Soon 标签。 */}
              {plan.highlight ? (
                <div className="mb-5 inline-flex rounded bg-[#1F1F1F] px-3 py-1.5 text-[11px] font-medium text-white">
                  最适合工程师 / 研究生
                </div>
              ) : null}
              <div style={{ fontSize: 14, fontWeight: 650, letterSpacing: 0 }}>
                {plan.name}
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: 0,
                }}
              >
                {plan.price}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                {plan.sub}
              </div>
              {/* §5.b / §5.c / §5.d 三个 CTA 高度统一，Pro 实心，Free/Team outline。 */}
              <a
                className={[
                  "mt-5 flex h-10 w-full items-center justify-center rounded-[8px] text-[13px] font-medium transition-colors",
                  plan.highlight
                    ? "bg-[#0A0A0A] text-white hover:bg-[#1F1F1F]"
                    : "border border-[#3F3F3F] text-white hover:bg-[#1F1F1F]",
                ].join(" ")}
                href="#faq"
              >
                {plan.cta}
              </a>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  margin: "20px 0 0",
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
                    <span style={{ color: "var(--text-muted)" }}>✓</span>
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
  const items: Array<[string, React.ReactNode]> = [
    [
      "Synapse 和 Notion / Obsidian 的区别？",
      <>
        <p style={{ margin: 0 }}>
          它们是通用笔记，Synapse 是 AI 学习专属的语义层。
        </p>
        <p style={{ margin: "12px 0 0" }}>
          区别在三件事：Math / Code / Paper 三种原生 block；Link
          是一等公民，能跨人跨笔记建立；公开社区里的 Track 可以被
          cite。结构化优先于自由排版。
        </p>
      </>,
    ],
    [
      "可以保留隐私吗？",
      "当然。每个 Note / Track 有三档可见度 (private / unlisted / public),引用也只会指向你保留可见的 Block。",
    ],
    [
      "代码会在服务器上跑吗？",
      "MVP 阶段不在服务器上执行用户代码。我们提供「一键复制环境」(requirements.txt / go.mod),让你本地可复现。",
    ],
    [
      "支持中文公式 / 注释吗？",
      "全栈支持。KaTeX 渲染、CodeMirror 编辑、评论 Markdown 均覆盖中文。中文标题用 HarmonyOS Sans SC / PingFang SC。",
    ],
    [
      "有 API / 数据导出吗？",
      "Pro 版本提供 JSON / Markdown 全量导出。注销账户后,数据软删 30 天后清理。",
    ],
    [
      "数据存在哪里？我可以导出吗？",
      "数据默认存放在 Synapse 托管的数据库与对象存储中。Free 层可以导出单个 Track，Pro 会提供 JSON / Markdown 全量导出。",
    ],
    [
      "支持哪些论文来源？arXiv / OpenReview / 自己的 PDF？",
      "MVP 优先支持 arXiv 元数据和本地 PDF 上传；OpenReview 会按 Track 引用需求接入，用户自己的 PDF 可以手动补全标题、作者和年份。",
    ],
    [
      "能和 Zotero / Obsidian 互通吗？",
      "会优先支持 Zotero 条目导入和 Markdown 导出。Obsidian 双向同步不放在 MVP，但导出的 Markdown 会保留 block id 与 link 关系。",
    ],
  ];
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="sn-section sn-section-quiet sn-reveal">
      <div className="sn-shell" style={{ maxWidth: 800 }}>
        <div className="sn-quiet-heading">
          <SectionEyebrow>06 / 支持</SectionEyebrow>
          <h2 className="sn-section-title sn-section-title-small">问题</h2>
        </div>
        <div
          className="sn-faq-panel"
          style={{ marginTop: 28, borderTop: "1px solid var(--border-subtle)" }}
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
                  padding: "16px 4px",
                  background: "transparent",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 500,
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
                    padding: "0 4px 18px",
                    color: "var(--text-secondary)",
                    fontSize: 13.5,
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

function LandingFinalCTA() {
  return (
    <section className="sn-reveal py-[120px]">
      <div className="sn-shell text-center">
        {/* §6 在 FAQ 和 footer 之间增加最后 CTA，不加背景、装饰、cyan 或 glow。 */}
        <h2 className="m-0 text-[clamp(32px,4vw,36px)] leading-tight font-semibold tracking-normal text-white [font-family:var(--font-sans)]">
          准备把你的学习连成网了吗？
        </h2>
        <p className="mx-auto mt-6 max-w-[560px] text-sm leading-6 text-[#9CA3AF]">
          免费开始，永久免费层支持无限 Note 和 3 个 Track。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#0A0A0A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1F1F1F]"
            href="/auth?mode=register"
          >
            免费开始 →
          </a>
          <a
            className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#3F3F3F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1F1F1F]"
            href="#community"
          >
            浏览社区
          </a>
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  const groups: Array<[string, string[]]> = [
    ["Product", ["Tour", "Pricing", "Changelog", "Roadmap"]],
    ["Community", ["Explore", "Top Tracks", "Tags", "Discord"]],
    ["Resources", ["Docs", "API", "Blog"]],
    ["Company", ["About", "Privacy", "Terms", "Contact"]],
  ];

  return (
    <footer className="sn-footer">
      <div className="sn-shell">
        <div className="relative">
          {/* §7.c Footer 右上角增加社交 icon，不包含 GitHub。 */}
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <FooterSocialLink href="https://x.com" label="Twitter / X">
              <path d="M13.6 2h2.1l-4.7 5.4 5.5 7.3h-4.3L8.9 10.3 5 14.7H2.9l5-5.7L2.6 2h4.4l3 4 3.6-4Zm-.7 11.4h1.2L6.4 3.2H5.1l7.8 10.2Z" />
            </FooterSocialLink>
            <FooterSocialLink href="https://discord.com" label="Discord">
              <path d="M13.5 4.1A11 11 0 0 0 10.8 3l-.1.2c-.1.2-.2.4-.3.6a10.2 10.2 0 0 0-3 0 4.8 4.8 0 0 0-.4-.8 11 11 0 0 0-2.7 1.1A11.5 11.5 0 0 0 2.3 12c1.1.8 2.2 1.3 3.3 1.7l.7-1.1-1.1-.5.3-.2c2.1 1 4.3 1 6.4 0l.3.2-1.1.5.7 1.1c1.1-.3 2.2-.9 3.3-1.7a11.5 11.5 0 0 0-1.6-7.9ZM6.8 10.4c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Zm4.4 0c-.7 0-1.2-.6-1.2-1.3s.5-1.3 1.2-1.3c.6 0 1.1.6 1.1 1.3s-.5 1.3-1.1 1.3Z" />
            </FooterSocialLink>
            <FooterSocialLink href="mailto:hello@synapse.dev" label="Email">
              <path d="M2.5 3.5h11A1.5 1.5 0 0 1 15 5v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11V5a1.5 1.5 0 0 1 1.5-1.5Zm.2 1.3 5.3 4 5.3-4H2.7Zm11 1.2-5.2 3.9a.8.8 0 0 1-1 0L2.3 6V11c0 .1.1.2.2.2h11c.1 0 .2-.1.2-.2V6Z" />
            </FooterSocialLink>
          </div>
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
                {/* §7.a 修正 Footer tagline。 */}
                让你的 AI 学习不再是孤岛。数学 ↔ 代码 ↔ 论文
                三位一体的学习社区。
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
        </div>
        <div className="sn-footer-bottom">
          {/* §7.b Footer 最底部改为产品 metadata。 */}
          <div>© 2026 Synapse · Made in Hangzhou · v0.7.2</div>
          <div style={{ display: "flex", gap: 18 }}>
            <span>中文</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      aria-label={label}
      className="inline-flex size-4 text-[#6B7280] transition-colors hover:text-white"
      href={href}
    >
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
        {children}
      </svg>
    </a>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  // §2 统一 section header 小字格式：数字 / 中文。
  return (
    <div className="mb-4 text-[11px] tracking-[0.05em] text-[#9CA3AF] [font-family:var(--font-mono)]">
      {children}
    </div>
  );
}

function blockColor(kind: BlockKind) {
  return {
    math: "var(--color-math)",
    code: "var(--color-code)",
    paper: "var(--color-paper)",
    concept: "var(--color-concept)",
  }[kind];
}
