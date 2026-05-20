import type { WorkflowEvent } from "@/lib/types/synapse";

export const WORKFLOW_EVENTS = [
  {
    time: "09:41",
    label: "PaperBlock",
    title: "导入 Vaswani 2017",
    kind: "paper",
    detail:
      "Attention Is All You Need 进入 Transformer 精读，标题、作者、年份自动归一。",
    meta: ["arxiv:1706.03762", "6 highlights", "23 quotes"],
  },
  {
    time: "10:08",
    label: "MathBlock",
    title: "固定 §3.2 的 scale 推导",
    kind: "math",
    detail: "把 QK^T / √d_k 拆成 12 个推导步，其中 3 步被标成可引用 anchor。",
    meta: ["12 steps", "KaTeX rendered", "3 anchors"],
  },
  {
    time: "10:36",
    label: "CodeBlock",
    title: "提交 attention.py 片段",
    kind: "code",
    detail:
      "78 行 PyTorch 代码通过 smoke test，implements 指向 MathBlock #scale。",
    meta: ["78 LOC", "python", "1 test"],
  },
  {
    time: "10:52",
    label: "Track",
    title: "发布 Transformer 精读",
    kind: "concept",
    detail:
      "Track 切换为 public，embedding worker 完成索引，并发现 2 条 incoming cites。",
    meta: ["public", "embedded", "2 incoming cites"],
  },
] as const satisfies readonly WorkflowEvent[];
