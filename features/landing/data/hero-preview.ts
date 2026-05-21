export const HERO_TRACK_ITEMS = [
  "Attention Is All You Need",
  "Scaled Dot-Product 直觉",
  "Multi-Head 拆分推导",
  "Positional Encoding",
  "PyTorch 复现",
  "训练 IWSLT-14 De-En",
] as const satisfies readonly string[];

export const HERO_CITATIONS = [
  ["Chen 思维链拆解", "implements"],
  ["Flash-Attn 精读", "extends"],
  ["MoE 路由设计", "cites"],
] as const satisfies readonly (readonly [string, string])[];
