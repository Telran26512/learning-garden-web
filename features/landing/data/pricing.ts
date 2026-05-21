import type { PricingPlan } from "@/lib/types/synapse";

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "¥0",
    sub: "永久免费",
    feats: [
      "个人 Note 无限",
      "公开/私密自由切换",
      "3 个 Track",
      "基础知识图谱",
    ],
    cta: "免费开始",
    highlight: false,
  },
  {
    name: "Pro",
    price: "¥39",
    sub: "/月 · waitlist",
    feats: [
      "无限 Track",
      "embedding 推荐",
      "导出 PDF / Markdown",
      "PDF 高亮锚点",
      "优先客服",
    ],
    cta: "加入等待列表",
    highlight: true,
  },
  {
    name: "Team",
    price: "联系我们",
    sub: "机构与团队",
    feats: [
      "SSO · SAML",
      "团队共享 Track",
      "私有部署",
      "API & Webhooks",
      "专属审核",
    ],
    cta: "联系销售",
    highlight: false,
  },
] as const satisfies readonly PricingPlan[];
