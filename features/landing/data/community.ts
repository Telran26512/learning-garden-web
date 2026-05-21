import type { CommunityTrack, FeaturedCommunity } from "@/lib/types/synapse";

export const FEATURED_COMMUNITY = {
  handle: "aria-chen",
  name: "Aria Chen",
  quote:
    "我花了三天才搞懂 RoPE 的相对位置编码。把 Su 的原论文、苏剑林的中文推导、和 LLaMA 的 rotary_emb.py 拴在同一个节点上之后，它就再也没跑掉过。",
  meta: "@aria-chen · 位置编码精读 · 18 nodes · 3 天前",
  avatarColor: "var(--color-paper)",
} as const satisfies FeaturedCommunity;

export const COMMUNITY_TRACKS = [
  {
    handle: "zhe-li",
    name: "李哲",
    title: "RoPE → ALiBi → YaRN：位置编码三连",
    avatarColor: "var(--color-paper)",
    nodes: [
      { kind: "Paper", title: "RoFormer §2.1: rotary position embedding" },
      { kind: "Math", title: "复数旋转到相对位移内积" },
      { kind: "Code", title: "apply_rotary_pos_emb 的 broadcast 维度" },
    ],
  },
  {
    handle: "qixin",
    name: "齐欣",
    title: "从 PPO 的 importance ratio 到 GRPO 砍掉 critic",
    avatarColor: "var(--color-math)",
    nodes: [
      { kind: "Paper", title: "DeepSeekMath Appendix: GRPO objective" },
      { kind: "Math", title: "ratio clipping 与 KL 惩罚项" },
      { kind: "Code", title: "group_advantages_without_value_head.py" },
    ],
  },
  {
    handle: "lin-jiayi",
    name: "林佳怡",
    title: "Diffusion 三种参数化：ε / x₀ / v 各自的代码差异",
    avatarColor: "var(--color-code)",
    nodes: [
      { kind: "Paper", title: "Progressive Distillation §2.4 v-prediction" },
      { kind: "Math", title: "ε-pred 与 x₀-pred 的互换" },
      { kind: "Code", title: "scheduler.step(): prediction_type switch" },
    ],
  },
  {
    handle: "maxwell-tu",
    name: "Maxwell Tu",
    title: "FlashAttention 的 IO-aware 证明怎么落到 kernel",
    avatarColor: "var(--color-concept)",
    nodes: [
      { kind: "Paper", title: "FlashAttention §3: tiling strategy" },
      { kind: "Math", title: "HBM 访问次数的上界" },
      { kind: "Code", title: "flash_fwd_kernel.cu 的 block loop" },
    ],
  },
] as const satisfies readonly CommunityTrack[];
