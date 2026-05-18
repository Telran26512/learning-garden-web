import { AppShell } from "@/components/app-shell";
import { ConceptCard } from "@/features/concepts/concept-card";
import type { ConceptSummary } from "@/lib/api";

const publicConcept: ConceptSummary = {
  id: "concept-policy-gradient",
  slug: "policy-gradient",
  title: "Policy Gradient",
  summary: "公开内容会从 content visibility=public 聚合到社区视图。",
  visibility: "public",
  stage: 3,
  week: 18,
  tags: ["rl", "paper"],
  updatedAt: "2026-05-18",
};

export default function CommunityPage() {
  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--accent-strong)]">
            Community
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            公开学习内容
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            M2 后接入真实公开内容列表；M0 只保留路由与展示边界。
          </p>
        </section>
        <ConceptCard concept={publicConcept} />
      </main>
    </AppShell>
  );
}
