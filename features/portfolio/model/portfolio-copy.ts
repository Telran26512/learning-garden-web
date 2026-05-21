export const currentWritingExcerpt =
  "我想把 PPO 写成一条能从 Bellman equation 走到可运行实现的线: 先把 advantage 的估计讲清楚,再把 clipping、KL 和 rollout buffer 放回工程约束里看。";

export const trackWriting: Record<
  string,
  { context: string; excerpt: string }
> = {
  "Transformer 精读": {
    context:
      "这条 track 不是逐段翻译 Attention is All You Need,而是在补齐读论文时真正会卡住的地方: Q/K/V 的几何直觉、LayerNorm 放在哪里、以及 FlashAttention 为什么变成 IO 问题。",
    excerpt:
      "把 Q·Kᵀ 看成查询向量在键空间上的投影之后,Multi-Head 才不只是“并行几次 attention”,而是同时保留几套相似度结构。",
  },
  "PPO from Bellman to Implementation": {
    context:
      "我把 PPO 当作一组可检查的工程妥协来写: value bootstrap 给了它可训练性,GAE 管住方差,clip 和 KL 则是在防止一次 update 把策略推离数据分布。",
    excerpt:
      "真正难的不是记住 clipped objective,而是知道什么时候这个 clip 在救你,什么时候它只是在掩盖 rollout 质量的问题。",
  },
  "Softmax / Numerical Stability": {
    context:
      "这部分从一个很小的数值技巧开始,一路写到 online softmax 和 fused kernel。目标是让每一个 max、exp、sum 都有明确的数值理由。",
    excerpt:
      "softmax(x)=softmax(x−max(x)) 看起来像 trick,但它其实是在利用 LogSumExp 的平移不变性保存同一个分布。",
  },
  "GRPO 复现 · Draft": {
    context:
      "这是正在拆的复现笔记: 先把 group baseline 的 variance 直觉写清楚,再记录 tiny-llama 实验里遇到的 reward、采样和显存问题。",
    excerpt:
      "GRPO 让我感兴趣的地方不是“去掉 value model”,而是它把 baseline 的问题改写成同一 prompt 下样本之间的相对比较。",
  },
  "Diffusion 入门 → SDE": {
    context:
      "这条线把 DDPM、DDIM、score matching 和 SDE 视角放在同一个坐标系里,少用比喻,多保留推导里真正发生变化的变量。",
    excerpt:
      "当时间变量换成 log-SNR,很多 sampler 的形式开始像是在同一条反向路径上选择不同的积分规则。",
  },
  "MoE: Routing & Load Balance": {
    context:
      "我在用一个 toy router 理解 top-k routing 和 aux loss。重点不是复刻 Mixtral,而是看清楚稀疏前向为什么会把优化问题推给负载均衡。",
    excerpt:
      "没有 aux loss 时,router 很快学会把难题交给少数 expert,吞吐和泛化一起开始变坏。",
  },
  "Flash Attention 拆解": {
    context:
      "这条 track 从 IO-aware 的 motivation 开始,把 tiled attention、running statistics 和 Triton 实现逐行连起来。",
    excerpt:
      "FlashAttention 的关键不是少算了什么,而是让每一块 Q/K/V 只在 HBM 和 SRAM 之间走必要的一次。",
  },
  "KV Cache · Quant · Paging": {
    context:
      "这里记录 inference 系统的内存账: paged attention、KV quant、continuous batching 和它们在高并发时互相牵制的地方。",
    excerpt:
      "把 KV cache 类比成 OS 的 paged memory 后,fragmentation 终于从一个抽象名词变成了能画出来的浪费。",
  },
};
