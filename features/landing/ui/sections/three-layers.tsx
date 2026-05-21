import type { CSSProperties, ReactNode } from "react";
import type { BlockKind } from "@/lib/types/synapse";
import { blockColor } from "../../model/block-color";

export function LandingThreeLayers() {
  return (
    <section className="sn-section sn-reveal overflow-hidden">
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

        <div className="sn-layer-stack">
          <div className="sn-grid-3 sn-layer-grid sn-reveal sn-reveal-list">
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
              <pre className="sn-code-snippet">
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
              <pre className="sn-code-snippet sn-code-snippet-paper">
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
  children: ReactNode;
}) {
  const color = blockColor(kind);
  return (
    <article
      data-layer-card
      data-kind={kind}
      className="sn-card sn-layer-card"
      style={{ "--layer-color": color } as CSSProperties}
    >
      <div className="sn-layer-card-accent" />
      <div className="sn-layer-card-head">
        <div className="sn-layer-card-icon">{icon}</div>
        <span className="sn-layer-card-label">{label.toUpperCase()}</span>
      </div>
      <h3 className="sn-layer-card-title">{title}</h3>
      <p className="sn-layer-card-desc">{desc}</p>
      <div className="sn-layer-card-preview">
        <div className="sn-layer-card-preview-head">
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
    <div className="sn-math-render">
      <span>
        Attention(<i>Q,K,V</i>) = softmax
      </span>
      <span className="sn-math-fraction">
        <span className="sn-math-fraction-num">
          <i>QK</i>
          <sup>⊤</sup>
        </span>
        <span className="sn-math-fraction-den">
          √
          <span className="sn-math-root-over">
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
