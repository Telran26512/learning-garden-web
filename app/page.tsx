import { AppShell } from "@/components/app-shell";
import { MetricStrip } from "@/components/metric-strip";
import { StatusPill } from "@/components/status-pill";
import { ConceptCard } from "@/features/concepts/concept-card";
import { SessionSummary } from "@/features/identity/session-summary";
import { ContentDraftPanel } from "@/features/studio/content-draft-panel";
import { RoadmapPreview } from "@/features/workspace/roadmap-preview";
import type { ConceptSummary } from "@/lib/api";

const highlightedConcept: ConceptSummary = {
  id: "concept-linear-regression",
  slug: "linear-regression",
  title: "线性回归",
  summary: "把数学推导、numpy 实现与论文阅读放在同一个概念视图里。",
  visibility: "private",
  stage: 1,
  week: 7,
  tags: ["math", "ml", "numpy"],
  updatedAt: "2026-05-18",
};

const metrics = [
  { label: "M0 地基", value: "4 路由组", tone: "green" as const },
  { label: "API 边界", value: "/api/v1", tone: "amber" as const },
  { label: "内容默认", value: "private", tone: "red" as const },
];

export default function HomePage() {
  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusPill label="Next.js 16" tone="green" />
              <StatusPill label="TypeScript strict" tone="amber" />
              <StatusPill label="REST only" tone="red" />
            </div>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-[var(--accent-strong)]">
                AI Learning Garden
              </p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-normal text-balance sm:text-4xl">
                今日工作台
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
                M0
                前端骨架已经按社区、学习空间、创作与管理四条路径分区，后续垂直切片可以直接接入身份与概念接口。
              </p>
            </div>
          </div>

          <SessionSummary
            user={{
              id: "local-user",
              email: "raymond@example.com",
              displayName: "Raymond",
              handle: "raymond",
              avatarUrl: null,
              role: "admin",
            }}
          />
        </section>

        <MetricStrip items={metrics} />

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <ConceptCard concept={highlightedConcept} />
          <RoadmapPreview />
        </section>

        <ContentDraftPanel />
      </main>
    </AppShell>
  );
}
