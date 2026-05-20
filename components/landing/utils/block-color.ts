import type { BlockKind } from "@/lib/types/synapse";

export function blockColor(kind: BlockKind) {
  return {
    math: "var(--color-math)",
    code: "var(--color-code)",
    paper: "var(--color-paper)",
    concept: "var(--color-concept)",
  }[kind];
}
