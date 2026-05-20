import type { FAQItem } from "@/lib/types/synapse";

export const FAQ_ITEMS = [
  {
    question: "Synapse 和 Notion / Obsidian 的区别？",
    answer: [
      "它们是通用笔记，Synapse 是 AI 学习专属的语义层。",
      "区别在三件事：Math / Code / Paper 三种原生 block；Link 是一等公民，能跨人跨笔记建立；公开社区里的 Track 可以被 cite。结构化优先于自由排版。",
    ],
  },
  {
    question: "可以保留隐私吗？",
    answer: [
      "当然。每个 Note / Track 有三档可见度 (private / unlisted / public),引用也只会指向你保留可见的 Block。",
    ],
  },
  {
    question: "代码会在服务器上跑吗？",
    answer: [
      "MVP 阶段不在服务器上执行用户代码。我们提供「一键复制环境」(requirements.txt / go.mod),让你本地可复现。",
    ],
  },
  {
    question: "支持中文公式 / 注释吗？",
    answer: [
      "全栈支持。KaTeX 渲染、CodeMirror 编辑、评论 Markdown 均覆盖中文。中文标题用 HarmonyOS Sans SC / PingFang SC。",
    ],
  },
  {
    question: "有 API / 数据导出吗？",
    answer: [
      "Pro 版本提供 JSON / Markdown 全量导出。注销账户后,数据软删 30 天后清理。",
    ],
  },
  {
    question: "数据存在哪里？我可以导出吗？",
    answer: [
      "数据默认存放在 Synapse 托管的数据库与对象存储中。Free 层可以导出单个 Track，Pro 会提供 JSON / Markdown 全量导出。",
    ],
  },
  {
    question: "支持哪些论文来源？arXiv / OpenReview / 自己的 PDF？",
    answer: [
      "MVP 优先支持 arXiv 元数据和本地 PDF 上传；OpenReview 会按 Track 引用需求接入，用户自己的 PDF 可以手动补全标题、作者和年份。",
    ],
  },
  {
    question: "能和 Zotero / Obsidian 互通吗？",
    answer: [
      "会优先支持 Zotero 条目导入和 Markdown 导出。Obsidian 双向同步不放在 MVP，但导出的 Markdown 会保留 block id 与 link 关系。",
    ],
  },
] as const satisfies readonly FAQItem[];
