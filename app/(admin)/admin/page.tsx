import { ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";

export default function AdminPage() {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[var(--danger)]">
              <ShieldCheck aria-hidden="true" size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[var(--accent-strong)]">
                  Admin
                </p>
                <StatusPill label="M6 接入" tone="red" />
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal">
                管理与审核入口
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                管理路由先保留边界，真实举报、审核、防滥用能力等到开放注册阶段再实现。
              </p>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
