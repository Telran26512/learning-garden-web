"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type GraphNode = {
  id: string;
  label: string;
  group: "math" | "code" | "paper" | "concept";
  r?: number;
  meta?: string;
};

export type GraphLink = {
  source: string;
  target: string;
  type: string;
};

type InternalNode = GraphNode & {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
  r: number;
};

type InternalLink = GraphLink & {
  s: number;
  t: number;
};

type GraphState = {
  nodes: InternalNode[];
  links: InternalLink[];
  dragging: number | null;
  hovered: number | null;
  w: number;
  h: number;
};

const COLOR_VARIABLES = {
  math: "--color-math",
  code: "--color-code",
  paper: "--color-paper",
  concept: "--color-concept",
} as const;

const FALLBACK_PALETTE = {
  math: "#3DDC97",
  code: "#F5B85B",
  paper: "#6FA8DC",
  concept: "#4ABEFF",
};

const STATIC_LAYOUT: Record<string, [number, number]> = {
  attention: [0.5, 0.52],
  multihead: [0.6, 0.43],
  softmax: [0.4, 0.52],
  posenc: [0.29, 0.39],
  layernorm: [0.41, 0.7],
  ffn: [0.53, 0.76],
  mask: [0.31, 0.61],
  "py-attn": [0.68, 0.53],
  "py-mha": [0.74, 0.42],
  "py-train": [0.81, 0.64],
  "py-flash": [0.77, 0.28],
  "py-tok": [0.89, 0.7],
  vaswani: [0.48, 0.39],
  flash: [0.64, 0.25],
  gpt2: [0.53, 0.22],
  rope: [0.34, 0.28],
  mla: [0.22, 0.54],
  qkv: [0.61, 0.59],
  kvcache: [0.2, 0.68],
  context: [0.12, 0.74],
  training: [0.29, 0.77],
};

export function ForceGraph({
  nodes: initialNodes,
  links: initialLinks,
  width = 720,
  height = 440,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredOverlay, setHoveredOverlay] = useState<{
    x: number;
    y: number;
    label: string;
    meta?: string;
  } | null>(null);
  const stateRef = useRef<GraphState>({
    nodes: [],
    links: [],
    dragging: null,
    hovered: null,
    w: width,
    h: height,
  });

  useEffect(() => {
    const nodes: InternalNode[] = initialNodes.map((node, index) => {
      const layout =
        STATIC_LAYOUT[node.id] ?? fallbackLayout(index, initialNodes.length);
      return {
        ...node,
        x: layout[0] * width,
        y: layout[1] * height,
        fx: null,
        fy: null,
        r: node.r ?? 8,
      };
    });

    const indexById = new Map(nodes.map((node, index) => [node.id, index]));
    const links = initialLinks
      .map((link) => ({
        ...link,
        s: indexById.get(link.source) ?? -1,
        t: indexById.get(link.target) ?? -1,
      }))
      .filter((link) => link.s >= 0 && link.t >= 0);

    stateRef.current.nodes = nodes;
    stateRef.current.links = links;
    stateRef.current.w = width;
    stateRef.current.h = height;
  }, [height, initialLinks, initialNodes, width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const state = stateRef.current;

    const draw = () => {
      const { nodes, links } = state;
      const hoveredIndex = state.hovered;
      const neighbors = new Set<number>();
      ctx.clearRect(0, 0, state.w, state.h);

      if (hoveredIndex !== null) {
        for (const link of links) {
          if (link.s === hoveredIndex) neighbors.add(link.t);
          if (link.t === hoveredIndex) neighbors.add(link.s);
        }
      }

      for (const link of links) {
        const a = nodes[link.s];
        const b = nodes[link.t];
        if (!a || !b) continue;
        const active =
          hoveredIndex !== null &&
          (link.s === hoveredIndex || link.t === hoveredIndex);
        ctx.strokeStyle = active
          ? "rgba(255,255,255,0.36)"
          : "rgba(255,255,255,0.08)";
        ctx.lineWidth = active ? 1.5 : 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        const color = readGraphColor(node.group);
        const isHovered = hoveredIndex === index;
        const dim =
          hoveredIndex !== null && !isHovered && !neighbors.has(index);
        const radius = node.r * (isHovered ? 1.4 : 1);

        ctx.globalAlpha = dim ? 0.25 : 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isHovered ? "#fff" : "rgba(255,255,255,0.18)";
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        if (isHovered || neighbors.has(index) || node.r > 11) {
          ctx.globalAlpha = dim ? 0.35 : 1;
          ctx.fillStyle = "#F4F4F7";
          ctx.font = '500 11px "Inter", system-ui, sans-serif';
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y + radius + 14);
        }
        ctx.globalAlpha = 1;
      }
    };

    const pickNode = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let best = -1;
      let bestDistance = 14 * 14;

      for (let index = 0; index < state.nodes.length; index += 1) {
        const node = state.nodes[index];
        const distance =
          (node.x - x) * (node.x - x) + (node.y - y) * (node.y - y);
        const hit = (node.r + 6) * (node.r + 6);
        if (distance < hit && distance < bestDistance) {
          best = index;
          bestDistance = distance;
        }
      }

      return { index: best, x, y };
    };

    const onMove = (event: PointerEvent) => {
      const picked = pickNode(event);
      if (state.dragging !== null) {
        const node = state.nodes[state.dragging];
        node.fx = picked.x;
        node.fy = picked.y;
        node.x = picked.x;
        node.y = picked.y;
        setHoveredOverlay({
          x: picked.x,
          y: picked.y,
          label: node.label,
          meta: node.meta,
        });
        draw();
        return;
      }

      const nextHovered = picked.index === -1 ? null : picked.index;
      if (state.hovered !== nextHovered) {
        state.hovered = nextHovered;
        const node = nextHovered !== null ? state.nodes[nextHovered] : null;
        setHoveredOverlay(
          node
            ? {
                x: node.x,
                y: node.y,
                label: node.label,
                meta: node.meta,
              }
            : null,
        );
        canvas.style.cursor = nextHovered !== null ? "grab" : "default";
        draw();
      }
    };

    const onDown = (event: PointerEvent) => {
      const picked = pickNode(event);
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
    <div style={{ position: "relative", width, height }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      {hoveredOverlay ? (
        <div
          style={{
            position: "absolute",
            left: Math.min(hoveredOverlay.x + 18, width - 200),
            top: Math.max(hoveredOverlay.y - 30, 8),
            maxWidth: 220,
            padding: "8px 12px",
            border: "1px solid var(--border-strong)",
            borderRadius: 10,
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 6px 22px rgba(0,0,0,.35)",
            color: "var(--text-primary)",
            fontSize: 12,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontWeight: 600 }}>{hoveredOverlay.label}</div>
          {hoveredOverlay.meta ? (
            <div
              style={{
                marginTop: 2,
                color: "var(--text-secondary)",
                fontSize: 11,
              }}
            >
              {hoveredOverlay.meta}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function readGraphColor(group: GraphNode["group"]) {
  if (typeof window === "undefined") return FALLBACK_PALETTE[group];
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(COLOR_VARIABLES[group])
    .trim();
  return value || FALLBACK_PALETTE[group];
}

function fallbackLayout(index: number, total: number): [number, number] {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  return [0.5 + Math.cos(angle) * 0.34, 0.52 + Math.sin(angle) * 0.32];
}

export function useAttentionGraph() {
  return useMemo(() => {
    const nodes: GraphNode[] = [
      { id: "attention", label: "Scaled Dot-Product", group: "math", r: 13 },
      { id: "multihead", label: "Multi-Head", group: "math", r: 11 },
      { id: "softmax", label: "Softmax", group: "math", r: 9 },
      { id: "posenc", label: "Positional Encoding", group: "math", r: 9 },
      { id: "layernorm", label: "LayerNorm", group: "math", r: 8 },
      { id: "ffn", label: "Position-wise FFN", group: "math", r: 8 },
      { id: "mask", label: "Causal Mask", group: "math", r: 7 },
      { id: "py-attn", label: "attention.py", group: "code", r: 11 },
      { id: "py-mha", label: "multi_head.py", group: "code", r: 10 },
      { id: "py-train", label: "train_iwslt.py", group: "code", r: 9 },
      { id: "py-flash", label: "flash_attn_v2.py", group: "code", r: 8 },
      { id: "py-tok", label: "bpe_tokenizer.py", group: "code", r: 7 },
      { id: "vaswani", label: "Vaswani 2017", group: "paper", r: 12 },
      { id: "flash", label: "FlashAttn 2022", group: "paper", r: 9 },
      { id: "gpt2", label: "Radford GPT-2", group: "paper", r: 8 },
      { id: "rope", label: "RoFormer 2021", group: "paper", r: 8 },
      { id: "mla", label: "DeepSeek MLA", group: "paper", r: 8 },
      { id: "qkv", label: "Q,K,V 投影", group: "concept", r: 9 },
      { id: "kvcache", label: "KV-Cache", group: "concept", r: 8 },
      { id: "context", label: "Context Window", group: "concept", r: 7 },
      { id: "training", label: "Teacher Forcing", group: "concept", r: 7 },
    ];

    const edge = (source: string, target: string, type: string): GraphLink => ({
      source,
      target,
      type,
    });
    const links = [
      edge("attention", "vaswani", "derives_from"),
      edge("attention", "softmax", "uses"),
      edge("attention", "mask", "uses"),
      edge("attention", "qkv", "uses"),
      edge("multihead", "attention", "extends"),
      edge("multihead", "qkv", "uses"),
      edge("multihead", "vaswani", "derives_from"),
      edge("posenc", "vaswani", "derives_from"),
      edge("posenc", "rope", "extended_by"),
      edge("layernorm", "vaswani", "cites"),
      edge("ffn", "vaswani", "cites"),
      edge("py-attn", "attention", "implements"),
      edge("py-attn", "softmax", "implements"),
      edge("py-mha", "multihead", "implements"),
      edge("py-mha", "py-attn", "uses"),
      edge("py-flash", "flash", "implements"),
      edge("py-flash", "py-attn", "extends"),
      edge("py-train", "py-mha", "uses"),
      edge("py-train", "training", "uses"),
      edge("py-tok", "py-train", "used_by"),
      edge("flash", "vaswani", "cites"),
      edge("gpt2", "vaswani", "cites"),
      edge("mla", "vaswani", "extends"),
      edge("mla", "kvcache", "addresses"),
      edge("rope", "posenc", "extends"),
      edge("kvcache", "attention", "enables"),
      edge("context", "kvcache", "limits"),
      edge("training", "mask", "requires"),
      edge("qkv", "vaswani", "derives_from"),
    ];

    return { nodes, links };
  }, []);
}
