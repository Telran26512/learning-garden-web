"use client";

import { useEffect, useMemo, useState } from "react";

import { GraphNotebook } from "@/features/portfolio/ui/portfolio-graph";
import type {
  PortfolioGraphEdge,
  PortfolioGraphNode,
} from "@/features/portfolio/model/portfolio-model";
import { fetchNoteGraph } from "@/lib/api/p4";
import type { P2Graph } from "@/lib/api/p2";

export function KnowledgeGraphPage({ handle }: { handle?: string }) {
  const [graph, setGraph] = useState<P2Graph | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchNoteGraph({ handle, limit: 100 })
      .then((next) => {
        if (!cancelled) setGraph(next);
      })
      .catch(() => {
        if (!cancelled) setGraph(null);
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  const mapped = useMemo(() => mapNoteGraph(graph), [graph]);

  return (
    <section className="syn-reading-mode min-h-[calc(100dvh-3.5rem)] bg-[var(--syn-reading-bg)] text-[var(--syn-reading-ink)]">
      <div className="mx-auto max-w-[1320px] px-6 py-14 lg:px-12">
        <GraphNotebook graphEdges={mapped.edges} graphNodes={mapped.nodes} />
      </div>
    </section>
  );
}

function mapNoteGraph(graph: P2Graph | null): {
  edges: PortfolioGraphEdge[];
  nodes: PortfolioGraphNode[];
} {
  const source = graph ?? { edges: [], nodes: [] };
  const radius = 285;
  const centerX = 500;
  const centerY = 360;
  const nodes = source.nodes.map((node, index) => {
    const angle =
      (index / Math.max(1, source.nodes.length)) * Math.PI * 2 - Math.PI / 2;
    return {
      focused: index === 0,
      id: node.id,
      label: index < 10 ? node.title : undefined,
      r: 8,
      type: "text",
      x: Math.round(centerX + Math.cos(angle) * radius),
      y: Math.round(centerY + Math.sin(angle) * radius),
    } satisfies PortfolioGraphNode;
  });

  return {
    edges: source.edges.map((edge) => [edge.sourceId, edge.targetId] as const),
    nodes,
  };
}
