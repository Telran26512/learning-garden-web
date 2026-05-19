"use client";

import { useMemo } from "react";
import { ActionButton } from "@/components/ui/action-button";
import type { Concept, RoadmapTask } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

type WorkspaceScreenProps = {
  concepts: Concept[];
  goTo: GoToScreen;
  roadmapTasks: RoadmapTask[];
};

type GoToScreen = (screen: "community" | "concept" | "review" | "studio" | "workspace") => void;

export function WorkspaceScreen({ concepts, goTo, roadmapTasks }: WorkspaceScreenProps) {
  const primaryConcept = concepts[0];
  const doneTasks = roadmapTasks.filter((task) => task.status === "done").length;

  return (
    <section className="flex min-h-[calc(100vh-52px)] gap-7 py-6">
      <aside className="hidden w-[184px] shrink-0 border-r hair pr-5 md:block">
        <nav className="space-y-0.5 text-[13px]">
          {["今日训练", "训练路线", "实现题库", "错题回放", "训练档案"].map((item, index) => (
            <button
              className={cn(
                "block w-full rounded-md px-2.5 py-1.5 text-left transition",
                index === 0
                  ? "bg-garden-50 font-medium text-garden-700"
                  : "text-slate-600 hover:bg-slate-50",
              )}
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-4 border-t hair pt-4">
          <div className="sect-label mb-1">今日节奏</div>
          <div className="num text-[22px] font-bold">
            {doneTasks}
            <span className="text-[12px] font-medium">/{roadmapTasks.length}</span>
            <span className="ml-1.5 text-[11px] font-medium text-garden-600">
              已完成训练块
            </span>
          </div>
          <div className="mt-3 space-y-2 text-[12px]">
            <StatusLine label="推导预热" value="完成" tone="green" />
            <StatusLine label="代码实现题" value="进行中" tone="amber" />
            <StatusLine label="错因回放" value="待开始" tone="muted" />
          </div>
          <button
            className="focus-ring mt-4 w-full rounded-md bg-garden-600 py-2 text-[12px] text-white transition hover:bg-garden-700"
            onClick={() => goTo("concept")}
            type="button"
          >
            继续当前训练
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b hair pb-5">
          <div>
            <div className="sect-label">今天的目标不是看进度,而是完成一个完整训练闭环</div>
            <h1 className="mt-1 text-[24px] font-bold">先推导,再实现,最后拿反馈</h1>
          </div>
          <div className="flex items-center divide-x divide-slate-200 text-[12px]">
            <Metric label="主题" value={primaryConcept?.title ?? "待创建"} />
            <Metric label="实现题通过" value="7/10" padded />
            <Metric label="待纠错" value="3" padded side="right" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 border-b hair py-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-garden-600 px-2 py-1 text-[11px] font-medium text-white">
                今日主训练
              </span>
              <span className="text-[11px] text-slate-400">Stage 2 · 线性模型与回归</span>
            </div>
            <h2 className="text-[22px] font-bold leading-tight">{primaryConcept?.summary}</h2>
            <p className="mt-2 max-w-[68ch] text-[13px] text-slate-600">
              这一轮训练来自 mock API 的概念数据。先用 3 步推导确认公式来源,然后实现{" "}
              <code className="rounded bg-slate-100 px-1">linear_regression(X, y)</code>
              ,最后对照参考解看你是否遗漏偏置列、矩阵维度或数值稳定性。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton tone="primary" onClick={() => goTo("concept")}>
                开始实现题
              </ActionButton>
              <ActionButton onClick={() => goTo("concept")}>先看推导要点</ActionButton>
              <ActionButton onClick={() => goTo("review")}>回看上次错误</ActionButton>
            </div>
            <FormulaChecklist />
          </div>
          <div className="lg:col-span-5 lg:border-l lg:pl-8 hair">
            <div className="sect-label mb-2">本轮步骤</div>
            <StepList tasks={roadmapTasks.slice(0, 3)} />
            <div className="mt-4 border-t hair pt-4">
              <div className="text-[11px] text-slate-400">上次卡住的点</div>
              <div className="mt-1 text-[15px] font-semibold">漏掉偏置列,代码默认拟合过原点。</div>
              <p className="mt-2 text-[12px] text-slate-500">
                这次提交前先检查{" "}
                <code className="rounded bg-slate-100 px-1">X_b = np.c_[np.ones(...), X]</code>{" "}
                是否补上。
              </p>
            </div>
          </div>
        </div>

        <Heatmap />
        <WorkspaceLists concepts={concepts} goTo={goTo} roadmapTasks={roadmapTasks} />
      </div>
    </section>
  );
}

function StatusLine({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "amber" | "muted";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span
        className={cn(
          "font-medium",
          tone === "green" && "text-garden-700",
          tone === "amber" && "text-amber-700",
          tone === "muted" && "text-slate-400",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function Metric({
  label,
  value,
  padded,
  side = "both",
}: {
  label: string;
  value: string;
  padded?: boolean;
  side?: "both" | "right";
}) {
  return (
    <div className={cn(padded ? (side === "right" ? "pl-4" : "px-4") : "pr-4")}>
      <span className="text-slate-500">{label}</span>
      <span className="num ml-1.5 font-semibold">{value}</span>
    </div>
  );
}

function FormulaChecklist() {
  const items = [
    ["矩阵扩展", "X_b = [1, X]", "把截距项转成第一列常数。"],
    ["正规方程", "w = (X_b.T X_b)^-1 X_b.T y", "检查转置和乘法顺序。"],
    ["结果解释", "w[0] = b, w[1:] = coef", "输出要能对应截距和系数。"],
  ] as const;

  return (
    <div className="mt-5 border-t hair pt-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-[14px] font-semibold">公式到代码对照</h3>
        <span className="sect-label">提交前先核对这三处</span>
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-[12px] md:grid-cols-3">
        {items.map(([label, formula, description]) => (
          <div key={label}>
            <div className="sect-label mb-1">{label}</div>
            <div className="border-y hair bg-slate-50 px-2 py-1.5 font-mono">{formula}</div>
            <p className="mt-1 text-slate-500">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepList({ tasks }: { tasks: RoadmapTask[] }) {
  return (
    <div className="space-y-2.5 text-[13px]">
      {tasks.map((task, index) => (
        <div className="grid grid-cols-[22px_1fr] gap-2" key={task.id}>
          <span
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded text-[11px]",
              task.status === "done" && "bg-garden-600 text-white",
              task.status === "current" && "bg-amber-100 text-amber-800",
              task.status === "pending" && "bg-slate-100 text-slate-500",
            )}
          >
            {index + 1}
          </span>
          <span>
            <b>{task.title}</b>
            <br />
            <span className="text-[12px] text-slate-500">{task.description}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Heatmap() {
  const heatmap = useMemo(() => buildHeatmap(), []);

  return (
    <div className="border-b hair py-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[16px] font-semibold">训练日历</h2>
        <span className="sect-label">
          过去一年 <span className="font-medium text-slate-700">{heatmap.studyDays}</span>{" "}
          天有训练记录
        </span>
      </div>
      <div className="flex gap-2">
        <div className="flex shrink-0 flex-col justify-between pb-[2px] pt-[18px] text-[10px] text-slate-400">
          <span>一</span>
          <span>三</span>
          <span>五</span>
        </div>
        <div className="mx-auto overflow-x-auto">
          <div className="mb-1 flex h-[14px] text-[10px] text-slate-400">
            {heatmap.months.map((month, index) => (
              <div key={`${month.label}-${index}`} style={{ minWidth: month.width }}>
                {month.label}
              </div>
            ))}
          </div>
          <div className="flex gap-[3px]">
            {heatmap.weeks.map((week, weekIndex) => (
              <div className="flex flex-col gap-[3px]" key={weekIndex}>
                {week.map((cell) => (
                  <span
                    className="hm-cell"
                    key={cell.title}
                    style={{ background: cell.color }}
                    title={cell.title}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
        <span>少</span>
        {["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"].map((color) => (
          <span className="hm-cell" key={color} style={{ background: color }} />
        ))}
        <span>多</span>
      </div>
    </div>
  );
}

function buildHeatmap() {
  const weeks = 53;
  const total = weeks * 7;
  const today = new Date(2026, 4, 18);
  const start = new Date(today);
  start.setDate(start.getDate() - (total - 1));
  start.setDate(start.getDate() - start.getDay());

  const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];
  let studyDays = 0;
  let lastMonth = -1;

  const monthLabels: Array<{ label: string; width: number }> = [];
  const weekColumns: Array<Array<{ color: string; title: string }>> = [];

  for (let week = 0; week < weeks; week += 1) {
    const firstDate = new Date(start);
    firstDate.setDate(start.getDate() + week * 7);
    if (firstDate.getMonth() !== lastMonth && firstDate.getDate() <= 7) {
      monthLabels.push({ label: monthNames[firstDate.getMonth()], width: 30 });
      lastMonth = firstDate.getMonth();
    } else {
      monthLabels.push({ label: "", width: 14 });
    }

    const column = [];
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7 + day);
      const seed = (week * 17 + day * 29 + date.getDate() * 7) % 100;
      const level = seed < 18 ? 0 : seed < 40 ? 1 : seed < 68 ? 2 : seed < 88 ? 3 : 4;
      if (level > 0 && date <= today) studyDays += 1;
      column.push({
        color: date > today ? "transparent" : colors[level],
        title: `${date.getMonth() + 1}月${date.getDate()}日`,
      });
    }
    weekColumns.push(column);
  }

  return { months: monthLabels, weeks: weekColumns, studyDays };
}

function WorkspaceLists({
  concepts,
  goTo,
  roadmapTasks,
}: {
  concepts: Concept[];
  goTo: GoToScreen;
  roadmapTasks: RoadmapTask[];
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 pt-5 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold">本周训练路线</h2>
          <span className="sect-label">当前</span>
        </div>
        {roadmapTasks.map((task) => (
          <CheckRow
            current={task.status === "current"}
            done={task.status === "done"}
            key={task.id}
            label={task.title}
          />
        ))}
      </div>

      <div className="lg:col-span-4 lg:border-l lg:pl-8 hair">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-semibold">下一个训练块</div>
            <div className="mt-0.5 text-[12px] text-slate-500">先做一道实现题,再拿即时反馈</div>
          </div>
          <button
            className="focus-ring rounded-md bg-amber-100 px-3 py-1.5 text-[12px] font-medium text-amber-800 transition hover:bg-amber-200"
            onClick={() => goTo("review")}
            type="button"
          >
            开始纠错
          </button>
        </div>
        <h2 className="mb-2 text-[15px] font-semibold">今日计划</h2>
        <CheckRow done label="完成 3 步推导预热" />
        <CheckRow label="修正最小二乘实现中的偏置项" />
        <CheckRow label="完成一次错因回放" />
      </div>

      <div className="lg:col-span-4 lg:border-l lg:pl-8 hair">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold">最近训练主题</h2>
          <span className="sect-label">
            <button className="text-garden-600 hover:underline" type="button">
              全部
            </button>
          </span>
        </div>
        {concepts.map((concept) => (
          <button
            className="flex w-full items-center gap-2 border-b hair py-[6px] text-left transition last:border-0 hover:text-garden-700"
            key={concept.id}
            onClick={() => goTo("concept")}
            type="button"
          >
            <span className="flex-1 truncate font-medium">{concept.title}</span>
            <span
              className={cn(
                "text-[11px]",
                (concept.mastery ?? 0) >= 60 ? "text-garden-600" : "text-slate-400",
              )}
            >
              {(concept.mastery ?? 0) >= 60 ? "已过关" : "待回放"}
            </span>
            <span className="w-[52px] text-right text-[11px] text-slate-400">
              {formatShortDate(concept.updatedAt)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckRow({
  current = false,
  label,
  done = false,
}: {
  current?: boolean;
  label: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 py-[5px]">
      <span
        className={cn(
          "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded text-[10px]",
          done ? "bg-garden-600 text-white" : "border-2 border-slate-200",
          current && "border-garden-600",
        )}
      >
        {done ? "✓" : current ? "•" : ""}
      </span>
      <span
        className={cn(
          done && "text-slate-400 line-through",
          current && "font-medium text-garden-700",
          !done && !current && "text-slate-600",
        )}
      >
        {label}
      </span>
      {current ? (
        <span className="rounded border border-garden-600/30 px-1 text-[10px] text-garden-600">
          当前
        </span>
      ) : null}
    </div>
  );
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(
    new Date(value),
  );
}
