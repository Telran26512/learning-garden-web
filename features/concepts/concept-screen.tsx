"use client";

import { starterCode } from "@/lib/demo/synapse-data";
import type { GoToScreen } from "@/lib/demo/synapse-types";
import { cn } from "@/lib/utils/cn";

type ConceptScreenProps = {
  goTo: GoToScreen;
  showRunOutput: boolean;
  onRun: () => void;
};

export function ConceptScreen({ goTo, showRunOutput, onRun }: ConceptScreenProps) {
  return (
    <section className="py-6">
      <div className="mb-1.5 text-[12px] text-slate-400">训练主题 / raymond / 线性回归</div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-[28px] font-bold">线性回归实现训练</h1>
            <span className="text-[13px] text-slate-400">Linear Regression Drill</span>
          </div>
          <p className="mt-2 max-w-[72ch] text-[13px] text-slate-600">
            这里不是概念百科,而是一条完整训练链路:
            先用最少的数学推导确认公式来源,再写出带偏置项的最小二乘实现,最后用可运行反馈检查理解是否真的落到代码里。
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            className="focus-ring rounded-md border hair px-3 py-1.5 text-[12px] transition hover:bg-slate-50"
            onClick={() => goTo("review")}
            type="button"
          >
            加入纠错队列
          </button>
          <button
            className="focus-ring rounded-md border hair px-3 py-1.5 text-[12px] transition hover:bg-slate-50"
            onClick={() => goTo("studio")}
            type="button"
          >
            ✎ 编辑素材
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 border-y hair py-4 md:grid-cols-3">
        <ConceptMetric label="训练目标" title="写对正规方程实现" text="输出参数向量,并正确处理截距项。" />
        <ConceptMetric
          label="先懂什么"
          title="为什么要补偏置列"
          text="理解截距项和矩阵形式之间的转换关系。"
          bordered
        />
        <ConceptMetric label="完成标准" title="能解释错因" text="不仅写出代码,还要说清楚为什么上次写错。" bordered />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[330px_minmax(0,1fr)]">
        <ConceptDerivation />
        <ConceptImplementation showRunOutput={showRunOutput} onRun={onRun} />
      </div>
    </section>
  );
}

function ConceptMetric({
  label,
  title,
  text,
  bordered,
}: {
  label: string;
  title: string;
  text: string;
  bordered?: boolean;
}) {
  return (
    <div className={cn(bordered && "md:border-l md:pl-8 hair")}>
      <div className="sect-label">{label}</div>
      <div className="mt-1 text-[15px] font-semibold">{title}</div>
      <p className="mt-1 text-[12px] text-slate-500">{text}</p>
    </div>
  );
}

function ConceptDerivation() {
  return (
    <div className="min-w-0">
      <div className="border-b hair pb-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">1. 先看最小必要推导</h3>
          <span className="sect-label">3 步就够</span>
        </div>
        <div className="divide-y divide-slate-100 text-[13px]">
          <DerivationStep step="Step 1" title="目标函数写成矩阵形式" formula="J(w) = ‖y − Xw‖²₂" />
          <DerivationStep step="Step 2" title="对参数求导并令导数为 0" formula="∇J(w) = -2Xᵀ(y - Xw) = 0" />
          <DerivationStep
            active
            step="Step 3"
            title="得到正规方程并转成可实现形式"
            formula="XᵀXw = Xᵀy  ⟹  ŵ = (XᵀX)⁻¹Xᵀy"
          />
          <div className="border-l-2 border-amber-400 py-3 pl-3">
            <div className="font-medium text-amber-900">实现提醒</div>
            <p className="mt-1 text-[12px] text-amber-800">
              如果想让模型学到截距项,需要先把输入改成{" "}
              <code className="rounded bg-amber-50 px-1">X_b = [1, x]</code>{" "}
              的形式,也就是补一列全 1。
            </p>
          </div>
        </div>
      </div>
      <div className="pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">2. 你要实现什么</h3>
          <span className="sect-label">像做一个小型 ML coding task</span>
        </div>
        <div className="space-y-2.5 text-[13px]">
          <div>
            <span className="text-slate-400">函数签名</span>
            <div className="mt-1 border-y hair bg-slate-50 px-3 py-2 font-mono text-[12px]">
              linear_regression(X, y) -&gt; w
            </div>
          </div>
          <div>
            <span className="text-slate-400">输入</span>
            <div className="mt-1">
              二维特征矩阵 <code className="rounded bg-slate-100 px-1">X</code> 与目标向量{" "}
              <code className="rounded bg-slate-100 px-1">y</code>
            </div>
          </div>
          <div>
            <span className="text-slate-400">输出</span>
            <div className="mt-1">
              包含截距项和系数的参数向量 <code className="rounded bg-slate-100 px-1">w</code>
            </div>
          </div>
          <div>
            <span className="text-slate-400">检查点</span>
            <div className="mt-1">是否补偏置列、矩阵乘法维度是否正确、结果是否能解释。</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DerivationStep({
  step,
  title,
  formula,
  active,
}: {
  step: string;
  title: string;
  formula: string;
  active?: boolean;
}) {
  return (
    <div className="py-3">
      <div className={cn("mb-1 text-[11px]", active ? "text-garden-700" : "text-slate-400")}>
        {step}
      </div>
      <div className="font-medium">{title}</div>
      <div className={cn("mt-1 text-right font-serif italic", active && "text-garden-800")}>
        {formula}
      </div>
    </div>
  );
}

function ConceptImplementation({
  showRunOutput,
  onRun,
}: {
  showRunOutput: boolean;
  onRun: () => void;
}) {
  return (
    <div className="min-w-0 lg:border-l lg:pl-8 hair">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">3. 开始实现</h3>
          <button
            className="focus-ring rounded-md bg-garden-600 px-3 py-1.5 text-[12px] text-white transition hover:bg-garden-700"
            onClick={onRun}
            type="button"
          >
            ▷ 运行参考结果
          </button>
        </div>
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <div className="text-[12px] text-slate-500">Starter code</div>
            <div className="hidden text-[11px] text-slate-400 sm:block">
              长代码保留缩进,在代码区内滚动查看
            </div>
          </div>
          <pre className="code-scroll w-full rounded-md bg-slate-900 p-4 font-mono text-[12px] leading-6 text-slate-100">
            {starterCode}
          </pre>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-3 border-t hair pt-4 text-[12px] md:grid-cols-3">
          <SmallNote label="实现目标" text="写出和参考模型一致的参数估计" />
          <SmallNote
            label="样例提示"
            text="如果结果没有截距项,你实现的是“过原点的直线”,不是完整线性回归。"
            bordered
          />
          <div className="md:border-l md:pl-5 hair">
            <div className="text-[11px] text-slate-400">提交前自检</div>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-[12px] text-slate-700">
              <li>
                是否先构造了 <code className="rounded bg-slate-100 px-1">X_b</code>
              </li>
              <li>是否理解为什么要拼接一列 1</li>
              <li>
                是否能解释 <code className="rounded bg-slate-100 px-1">XᵀXw = Xᵀy</code>
              </li>
            </ul>
          </div>
        </div>
        <RegressionChart />
        {showRunOutput ? (
          <div className="mt-3 border-y hair bg-slate-50 px-4 py-3 font-mono text-[12px]">
            w = 2.98　b = 4.07　R² = 0.95
          </div>
        ) : null}
      </div>
      <div className="mt-5 border-t hair pt-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-[15px] font-semibold">延伸资料</h3>
          <button className="text-[12px] text-garden-600 hover:underline" type="button">
            + 关联论文
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
          <ReferenceCard
            title="An Introduction to Statistical Learning"
            meta="G. James 等 · 2013 · 章节 3.1–3.3"
          />
          <ReferenceCard
            title="The Elements of Statistical Learning"
            meta="T. Hastie 等 · 2001 · 章节 3.2"
          />
        </div>
      </div>
    </div>
  );
}

function SmallNote({ label, text, bordered }: { label: string; text: string; bordered?: boolean }) {
  return (
    <div className={cn(bordered && "md:border-l md:pl-5 hair")}>
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className="mt-1 text-[12px] font-medium text-slate-600">{text}</div>
    </div>
  );
}

function RegressionChart() {
  const points = [
    [30, 82],
    [48, 76],
    [62, 74],
    [78, 65],
    [92, 63],
    [108, 56],
    [124, 52],
    [138, 44],
    [152, 43],
    [168, 34],
    [184, 31],
    [200, 26],
    [56, 69],
    [116, 59],
    [176, 39],
  ] as const;

  return (
    <svg
      className="mt-4 w-full rounded-md bg-slate-50"
      viewBox="0 0 240 104"
      aria-label="Linear regression scatter plot"
    >
      <line x1="20" y1="88" x2="226" y2="20" stroke="#1f8a47" strokeWidth="2" />
      <g fill="#3b82f6">
        {points.map(([cxValue, cyValue]) => (
          <circle cx={cxValue} cy={cyValue} key={`${cxValue}-${cyValue}`} r="2.4" />
        ))}
      </g>
    </svg>
  );
}

function ReferenceCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="lg:border-r lg:pr-8 hair last:border-r-0">
      <div className="font-medium">{title}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">{meta}</div>
      <p className="mt-1 text-[12px] text-slate-500">
        需要回到概念层面时再看,不要抢占训练主线。
      </p>
    </div>
  );
}
