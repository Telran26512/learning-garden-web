"use client";

import Link from "next/link";
import { useState } from "react";
import type { GraphEdge, GraphNode, GraphNodeStatus, KnowledgeGraph } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

type GraphFilter = GraphNodeStatus | "all";

export function GraphScreen({ graph }: { graph: KnowledgeGraph }) {
  const [selectedNodeId, setSelectedNodeId] = useState("node_linear_regression");
  const [statusFilter, setStatusFilter] = useState<GraphFilter>("all");
  const visibleNodes = graph.nodes.filter(
    (node) => statusFilter === "all" || node.status === statusFilter,
  );
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = graph.edges.filter(
    (edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to),
  );
  const selectedNode = graph.nodes.find((node) => node.id === selectedNodeId) ?? graph.nodes[0]!;

  return (
    <section className="py-8">
      <header className="border-b hair pb-6">
        <div className="sect-label">M5 Knowledge Graph</div>
        <h1 className="mt-2 font-serif text-[34px] font-semibold tracking-[-0.05em]">
          关系图谱
        </h1>
        <p className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-slate-500">
          使用 mock 坐标渲染概念关系。复杂布局库和自动布局等后端图谱数据稳定后再接。
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="py-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {(["all", "active", "locked", "mastered", "next"] as GraphFilter[]).map((filter) => (
              <button
                className={cn(
                  "focus-ring border-b px-1 pb-1 text-[12px] transition",
                  statusFilter === filter
                    ? "border-garden-700 font-semibold text-garden-700"
                    : "border-transparent text-slate-500 hover:text-garden-700",
                )}
                key={filter}
                onClick={() => setStatusFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>

          <svg className="h-[360px] w-full border-y hair" viewBox="0 0 680 360" role="img">
            <title>学习关系图谱</title>
            {visibleEdges.map((edge) => (
              <GraphLine edge={edge} key={edge.id} nodes={graph.nodes} />
            ))}
            {visibleNodes.map((node) => (
              <g
                className="cursor-pointer"
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                role="button"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  fill={node.id === selectedNode.id ? "#1f8a47" : getNodeColor(node.status)}
                  r={node.id === selectedNode.id ? 25 : 20}
                />
                <text
                  fill={node.id === selectedNode.id ? "#0f4e2a" : "#334155"}
                  fontSize="13"
                  fontWeight={node.id === selectedNode.id ? 700 : 500}
                  textAnchor="middle"
                  x={node.x}
                  y={node.y + 42}
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <aside className="py-6 lg:border-l lg:pl-8 hair">
          <div className="sect-label">Selected Node</div>
          <h2 className="mt-2 text-[22px] font-semibold">{selectedNode.label}</h2>
          <p className="mt-2 text-[13px] text-slate-500">状态: {selectedNode.status}</p>
          {selectedNode.relatedContentId ? (
            <Link
              className="mt-4 inline-block text-[13px] font-medium text-garden-700 hover:text-garden-800"
              href="/community/concepts/linear-regression-ols"
            >
              打开关联内容
            </Link>
          ) : null}
          <div className="mt-6 border-t hair pt-4">
            <h3 className="mb-2 text-[15px] font-semibold">相邻关系</h3>
            <div className="divide-y hair text-[12px]">
              {graph.edges
                .filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id)
                .map((edge) => (
                  <div className="py-2" key={edge.id}>
                    {edge.from === selectedNode.id ? "输出" : "输入"} · {edge.label}
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function GraphLine({ edge, nodes }: { edge: GraphEdge; nodes: GraphNode[] }) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);

  if (!from || !to) {
    return null;
  }

  return (
    <line
      stroke="rgba(38,46,42,0.22)"
      strokeDasharray="5 7"
      strokeWidth="2"
      x1={from.x}
      x2={to.x}
      y1={from.y}
      y2={to.y}
    />
  );
}

function getNodeColor(status: GraphNodeStatus) {
  if (status === "mastered") return "#86cfa0";
  if (status === "active") return "#f4bd5e";
  if (status === "next") return "#8fb3d9";
  return "#cbd5e1";
}
