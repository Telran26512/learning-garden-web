import { AppShell } from "@/components/app-shell";
import { ContentDraftPanel } from "@/features/studio/content-draft-panel";

export default function StudioPage() {
  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <p className="text-sm font-medium text-[var(--accent-strong)]">
            Studio
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            内容创作
          </h1>
        </section>
        <ContentDraftPanel />
      </main>
    </AppShell>
  );
}
