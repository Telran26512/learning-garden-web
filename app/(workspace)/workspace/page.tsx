import { AppShell } from "@/components/app-shell";
import { MetricStrip } from "@/components/metric-strip";
import { RoadmapPreview } from "@/features/workspace/roadmap-preview";

const items = [
  { label: "本周", value: "线性回归", tone: "green" as const },
  { label: "勾选状态", value: "learning", tone: "amber" as const },
  { label: "可见性", value: "private", tone: "red" as const },
];

export default function WorkspacePage() {
  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--accent-strong)]">
            Workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            我的学习空间
          </h1>
        </section>
        <MetricStrip items={items} />
        <RoadmapPreview />
      </main>
    </AppShell>
  );
}
