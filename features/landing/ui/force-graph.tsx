"use client";

import { useEffect, useRef, useState } from "react";
import type { GraphLink, GraphNode } from "@/lib/types/synapse";
import {
  configureGraphCanvas,
  createGraphState,
  drawGraph,
  pickGraphNode,
  resetGraphState,
  type GraphState,
  type InternalNode,
} from "../model/force-graph-renderer";

type HoveredOverlay = {
  x: number;
  y: number;
  label: string;
  meta?: string;
};

export function ForceGraph({
  nodes: initialNodes,
  links: initialLinks,
  width = 720,
  height = 440,
}: {
  nodes: readonly GraphNode[];
  links: readonly GraphLink[];
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredOverlay, setHoveredOverlay] = useState<HoveredOverlay | null>(
    null,
  );
  const stateRef = useRef<GraphState>(createGraphState(width, height));

  useEffect(() => {
    resetGraphState(
      stateRef.current,
      initialNodes,
      initialLinks,
      width,
      height,
    );
  }, [height, initialLinks, initialNodes, width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    configureGraphCanvas(canvas, ctx, width, height);

    const state = stateRef.current;
    const draw = () => drawGraph(ctx, state);
    const showOverlay = (node: InternalNode, x = node.x, y = node.y) => {
      setHoveredOverlay({ x, y, label: node.label, meta: node.meta });
    };

    const onMove = (event: PointerEvent) => {
      const picked = pickGraphNode(canvas, state, event);
      if (state.dragging !== null) {
        const node = state.nodes[state.dragging];
        node.fx = picked.x;
        node.fy = picked.y;
        node.x = picked.x;
        node.y = picked.y;
        showOverlay(node, picked.x, picked.y);
        draw();
        return;
      }

      const nextHovered = picked.index === -1 ? null : picked.index;
      if (state.hovered !== nextHovered) {
        state.hovered = nextHovered;
        const node = nextHovered !== null ? state.nodes[nextHovered] : null;
        if (node) showOverlay(node);
        else setHoveredOverlay(null);
        canvas.style.cursor = nextHovered !== null ? "grab" : "default";
        draw();
      }
    };

    const onDown = (event: PointerEvent) => {
      const picked = pickGraphNode(canvas, state, event);
      if (picked.index !== -1) {
        state.dragging = picked.index;
        const node = state.nodes[picked.index];
        node.fx = picked.x;
        node.fy = picked.y;
        node.x = picked.x;
        node.y = picked.y;
        canvas.style.cursor = "grabbing";
        draw();
      }
    };

    const onUp = () => {
      if (state.dragging !== null) {
        const node = state.nodes[state.dragging];
        node.fx = null;
        node.fy = null;
        state.dragging = null;
        canvas.style.cursor = state.hovered !== null ? "grab" : "default";
        draw();
      }
    };

    const onLeave = () => {
      state.hovered = null;
      setHoveredOverlay(null);
      canvas.style.cursor = "default";
      draw();
    };

    draw();
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [height, width]);

  return (
    <div className="sn-force-graph" style={{ width, height }}>
      <canvas ref={canvasRef} className="block" />
      {hoveredOverlay ? (
        <div
          className="sn-graph-tooltip"
          style={{
            left: Math.min(hoveredOverlay.x + 18, width - 200),
            top: Math.max(hoveredOverlay.y - 30, 8),
          }}
        >
          <div className="sn-graph-tooltip-title">{hoveredOverlay.label}</div>
          {hoveredOverlay.meta ? (
            <div className="sn-graph-tooltip-meta">{hoveredOverlay.meta}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
