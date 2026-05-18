import { FileText, FunctionSquare, Sigma } from "lucide-react";
import { StatusPill } from "@/components/status-pill";

const lanes = [
  {
    title: "数学推导",
    body: "Markdown + KaTeX",
    icon: Sigma,
  },
  {
    title: "可运行代码",
    body: "numpy first",
    icon: FunctionSquare,
  },
  {
    title: "论文原文",
    body: "notes + links",
    icon: FileText,
  },
];

export function ContentDraftPanel() {
  return (
    <section className="py-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--accent-strong)]">
            Studio
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">
            概念内容草稿
          </h2>
        </div>
        <StatusPill label="private by default" tone="amber" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {lanes.map((lane) => {
          const Icon = lane.icon;

          return (
            <div
              className="min-h-32 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm"
              key={lane.title}
            >
              <Icon
                aria-hidden="true"
                className="text-[var(--accent)]"
                size={20}
              />
              <p className="mt-4 text-sm font-semibold">{lane.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{lane.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
