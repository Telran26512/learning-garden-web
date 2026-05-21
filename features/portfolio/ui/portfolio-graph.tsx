import type {
  PortfolioGraphEdge,
  PortfolioGraphNode,
} from "../model/portfolio-model";
import { SectionHeading } from "./portfolio-section-heading";

export function GraphNotebook({
  graphEdges,
  graphNodes,
}: {
  graphEdges: readonly PortfolioGraphEdge[];
  graphNodes: readonly PortfolioGraphNode[];
}) {
  return (
    <section>
      <SectionHeading eyebrow="knowledge graph" title="知识图谱草图">
        图谱在这里不是主视觉,只作为一个索引: 哪些笔记把
        Transformer、RLHF、Softmax 和 Inference 串在了一起。
      </SectionHeading>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <GraphSketch graphEdges={graphEdges} graphNodes={graphNodes} />
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

function GraphSketch({
  graphEdges,
  graphNodes,
}: {
  graphEdges: readonly PortfolioGraphEdge[];
  graphNodes: readonly PortfolioGraphNode[];
}) {
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
