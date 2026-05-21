import type { GraphLink, GraphNode } from "@/lib/types/synapse";

const edge = (source: string, target: string, type: string): GraphLink => ({
  source,
  target,
  type,
});

export const ATTENTION_GRAPH = {
  nodes: [
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
  ] as const satisfies readonly GraphNode[],
  links: [
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
  ] as const satisfies readonly GraphLink[],
} as const;

export function getAttentionGraph() {
  return ATTENTION_GRAPH;
}
