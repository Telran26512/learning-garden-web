import type { GraphLink, GraphNode } from "@/lib/types/synapse";

export type InternalNode = GraphNode & {
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

export type GraphState = {
  nodes: InternalNode[];
  links: InternalLink[];
  dragging: number | null;
  hovered: number | null;
  w: number;
  h: number;
};

export type GraphPick = {
  index: number;
  x: number;
  y: number;
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

export function createGraphState(width: number, height: number): GraphState {
  return {
    nodes: [],
    links: [],
    dragging: null,
    hovered: null,
    w: width,
    h: height,
  };
}

export function resetGraphState(
  state: GraphState,
  initialNodes: readonly GraphNode[],
  initialLinks: readonly GraphLink[],
  width: number,
  height: number,
) {
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
  state.nodes = nodes;
  state.links = initialLinks
    .map((link) => ({
      ...link,
      s: indexById.get(link.source) ?? -1,
      t: indexById.get(link.target) ?? -1,
    }))
    .filter((link) => link.s >= 0 && link.t >= 0);
  state.dragging = null;
  state.hovered = null;
  state.w = width;
  state.h = height;
}

export function configureGraphCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export function drawGraph(ctx: CanvasRenderingContext2D, state: GraphState) {
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
    const dim = hoveredIndex !== null && !isHovered && !neighbors.has(index);
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
}

export function pickGraphNode(
  canvas: HTMLCanvasElement,
  state: GraphState,
  event: PointerEvent,
): GraphPick {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  let best = -1;
  let bestDistance = 14 * 14;

  for (let index = 0; index < state.nodes.length; index += 1) {
    const node = state.nodes[index];
    const distance = (node.x - x) * (node.x - x) + (node.y - y) * (node.y - y);
    const hit = (node.r + 6) * (node.r + 6);
    if (distance < hit && distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  }

  return { index: best, x, y };
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
