import type { NavScreen } from "./synapse-types";

export const navItems: Array<{ screen: NavScreen; label: string }> = [
  { screen: "community", label: "Community" },
  { screen: "workspace", label: "Workspace" },
  { screen: "studio", label: "Studio" },
  { screen: "review", label: "Review" },
];

export const recentTopics = [
  ["线性回归 · 偏置项实现", "12 分钟前", true],
  ["最小二乘法 · 正规方程", "昨天", false],
  ["岭回归 · 矩阵推导", "2 天前", true],
  ["逻辑回归 · Sigmoid 实现", "3 天前", false],
  ["损失函数与优化 · 梯度检查", "3 天前", true],
] as const;

export const feedItems = [
  {
    author: "Alice",
    type: "题解",
    title: "Softmax + 交叉熵梯度的稳定实现",
    description: "从 logits 平移开始推导,给出 NumPy 版 forward / backward,并记录一次维度错误。",
    tags: ["含推导", "可运行", "错因复盘"],
    language: "Python",
    passRate: "93%",
    difficulty: "中等",
    likes: 24,
    comments: 6,
    time: "2 小时前",
  },
  {
    author: "Bob",
    type: "实现",
    title: "Transformer 多头注意力的最小实现",
    description: "只保留 Q/K/V 投影、mask 和 scaled dot-product,适合对照矩阵维度。",
    tags: ["含代码", "维度检查", "可运行"],
    language: "PyTorch",
    passRate: "88%",
    difficulty: "偏难",
    likes: 31,
    comments: 9,
    time: "5 小时前",
  },
  {
    author: "Catherine",
    type: "推导",
    title: "贝叶斯分类器从公式到代码",
    description: "用一个二分类样例解释先验、似然、后验,并实现朴素贝叶斯预测。",
    tags: ["含推导", "小样例", "公式到代码"],
    language: "Python",
    passRate: "79%",
    difficulty: "入门",
    likes: 16,
    comments: 3,
    time: "昨天",
  },
  {
    author: "David",
    type: "错因复盘",
    title: "PPO Clip 目标到底裁剪了什么",
    description: "对比两次错误实现,解释概率比、优势函数和 clip 区间的关系。",
    tags: ["错因复盘", "强化学习", "含图解"],
    language: "Python",
    passRate: "72%",
    difficulty: "偏难",
    likes: 42,
    comments: 11,
    time: "2 天前",
  },
] as const;

export const queueItems = [
  ["代码纠错", "线性回归 · 偏置项遗漏", "当前"],
  ["推导回放", "交叉熵梯度展开", "待复习"],
  ["代码纠错", "梯度下降 · 学习率更新顺序", "待复习"],
  ["推导回放", "R² 的定义与解释", "待复习"],
  ["代码纠错", "PCA · 中心化遗漏", "待复习"],
  ["推导回放", "L1 与 L2 惩罚项差异", "待复习"],
] as const;

export const tagRank = [
  ["正规方程", 128],
  ["梯度检查", 96],
  ["数值稳定", 85],
  ["矩阵维度", 74],
  ["偏置项", 63],
] as const;

export const masteryItems = [
  ["偏置项/截距处理", 3, "#1f8a47"],
  ["矩阵维度与转置", 5, "#f59e0b"],
  ["评估指标理解", 2, "#94a3b8"],
] as const;

export const starterCode = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

np.random.seed(42)
X = np.random.rand(100, 1)
y = 4 + 3 * X.squeeze() + np.random.randn(100)*.5

model = LinearRegression()
model.fit(X, y)
print("w =", model.coef_[0], "b =", model.intercept_)
print("R² =", r2_score(y, model.predict(X)))`;

export const defaultUserCode = `import numpy as np

def linear_regression(X, y):
    w = np.linalg.inv(X.T @ X) @ X.T @ y
    return w`;

export const studioDraft = `## 最小二乘推导

给定线性模型 ŷ = Xw + ε,最小二乘的目标是最小化残差平方和:

$$ J(w) = ||y - Xw||²₂ = (y - Xw)ᵀ(y - Xw) $$

对 w 求导并令导数为 0:

$$ ∇J(w) = -2Xᵀ(y - Xw) = 0 $$

得到正规方程:

$$ XᵀXw = Xᵀy  ⟹  ŵ = (XᵀX)⁻¹Xᵀy $$

---

## 几何意义

最小二乘寻找使得预测 Xŵ 在列空间中最接近观测值 y 的投影。`;
