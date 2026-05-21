import type { GraphLegendItem, GraphSideListRow } from "@/lib/types/synapse";

export const GRAPH_LEGEND_ITEMS = [
  ["Math", "var(--color-math)"],
  ["Code", "var(--color-code)"],
  ["Paper", "var(--color-paper)"],
  ["Concept", "var(--color-concept)"],
] as const satisfies readonly GraphLegendItem[];

export const TOP_HUB_ROWS = [
  ["Scaled Dot-Product", "12 edges", "2h ago"],
  ["Multi-Head Attention", "9 edges", "5h ago"],
  ["Positional Encoding", "7 edges", "1d ago"],
  ["LayerNorm", "5 edges", "2d ago"],
] as const satisfies readonly GraphSideListRow[];

export const RECENT_LINK_ROWS = [
  ["Multi-Head → Q,K,V 投影", "implements", "18m ago"],
  ["Softmax → log-sum-exp 稳定", "extends", "47m ago"],
  ["MLA (DeepSeek) → Attention 原文", "cites", "3h ago"],
] as const satisfies readonly GraphSideListRow[];
