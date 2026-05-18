import { CheckCircle2, CircleDashed } from "lucide-react";

const tasks = [
  { title: "注册登录地基", status: "ready" },
  { title: "private 概念 CRUD", status: "next" },
  { title: "线性回归三栏页", status: "next" },
  { title: "Pyodide 懒加载", status: "later" },
];

export function RoadmapPreview() {
  return (
    <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--accent-strong)]">
            Workspace
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">
            M0 → M1 学习闭环
          </h2>
        </div>
      </div>

      <ol className="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {tasks.map((task) => {
          const done = task.status === "ready";

          return (
            <li
              className="flex min-h-12 items-center gap-3 py-3"
              key={task.title}
            >
              {done ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="text-[var(--accent)]"
                  size={18}
                />
              ) : (
                <CircleDashed
                  aria-hidden="true"
                  className="text-[var(--warn)]"
                  size={18}
                />
              )}
              <span className="text-sm font-medium">{task.title}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
