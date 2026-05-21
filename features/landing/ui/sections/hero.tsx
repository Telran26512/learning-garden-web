import { SynapseParticles } from "../synapse-particles";
import type { BlockKind } from "@/lib/types/synapse";
import { HERO_CITATIONS, HERO_TRACK_ITEMS } from "../../data/hero-preview";

const HERO_PARTICLE_PALETTE = ["#6B7280", "#A8A8B3", "#F4F4F7"];

export function LandingHero() {
  return (
    <section id="top" className="sn-hero">
      <div className="sn-hero-radial" />
      <SynapseParticles nodeCount={280} colors={HERO_PARTICLE_PALETTE} />

      <div className="sn-hero-content">
        <h1 className="mx-auto m-0 max-w-[760px] text-[clamp(28px,8.2vw,52px)] leading-[1.16] font-semibold tracking-normal whitespace-nowrap text-white [font-family:var(--font-sans)] sm:leading-[1.18]">
          让论文、公式和代码
          <br />
          互相指向
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[clamp(16px,1.8vw,18px)] leading-[1.6] font-normal text-text-secondary">
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
      </div>

      <div className="sn-hero-preview">
        <HeroPreviewCard />
      </div>
    </section>
  );
}

function HeroPreviewCard() {
  return (
    <div className="sn-card sn-browser-card">
      <div className="sn-browser-chrome">
        <span className="sn-browser-dot sn-browser-dot-red" />
        <span className="sn-browser-dot sn-browser-dot-yellow" />
        <span className="sn-browser-dot sn-browser-dot-green" />
        <div className="sn-browser-url">
          synapse.app/u/zhe-li/notes/attention-is-all-you-need
        </div>
        <div className="sn-browser-shortcut">⌘K 搜索</div>
      </div>

      <div className="sn-browser-layout">
        <aside className="sn-preview-side sn-preview-left">
          <div className="sn-preview-kicker">Track</div>
          <div className="sn-preview-track-title">Transformer 精读</div>
          <ul className="sn-preview-track-list">
            {HERO_TRACK_ITEMS.map((item, index) => {
              const active = index === 0;
              return (
                <li
                  key={item}
                  className={[
                    "sn-preview-track-item",
                    active ? "sn-preview-track-item-active" : "",
                  ].join(" ")}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="sn-preview-main">
          <div className="sn-preview-paper-meta">
            <span>PAPER</span>
            <span>Vaswani et al. · 2017 · arXiv:1706.03762</span>
          </div>
          <h2 className="sn-preview-paper-title">Attention Is All You Need</h2>
          <p className="sn-preview-paper-copy">
            从 Bahdanau 注意力出发,Transformer 用纯 attention 替换了 RNN
            中的循环结构。本文围绕 §3.2 Scaled Dot-Product Attention 重建推导……
          </p>
          <MiniBlock kind="math" />
          <MiniBlock kind="code" />
        </div>

        <aside className="sn-preview-side sn-preview-right">
          <div className="sn-preview-kicker">Cited by · 23</div>
          {HERO_CITATIONS.map(([title, relation]) => (
            <div key={title} className="sn-preview-citation">
              <div>{title}</div>
              <div className="sn-preview-citation-relation">· {relation}</div>
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
      <div className="sn-mini-block-accent" />
      <div className="sn-mini-block-head">
        <span className="sn-mini-block-label">{meta.label}</span>
        <span className="sn-mini-block-action">↗ Link · ⋯</span>
      </div>
      <pre
        className={[
          "sn-mini-block-body",
          kind === "paper" ? "sn-mini-block-body-paper" : "",
        ].join(" ")}
      >
        {meta.body}
      </pre>
    </div>
  );
}
