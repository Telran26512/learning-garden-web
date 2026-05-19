"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { StateSurface } from "@/components/ui/state-surface";
import { adminApi, normalizeApiError } from "@/lib/api";
import type { AdminOverview, ModerationQueueItem } from "@/lib/api";

export function AdminScreen() {
  const [state, setState] = useState<
    | { status: "error"; message: string }
    | { overview: AdminOverview; queue: ModerationQueueItem[]; status: "ready" }
    | { status: "loading" }
  >({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    Promise.all([adminApi.getOverview(), adminApi.getModerationQueue()])
      .then(([overview, queue]) => {
        if (isActive) {
          setState({ overview, queue, status: "ready" });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({ message: normalizeApiError(error).message, status: "error" });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <AppShell active="workspace">
      <section className="py-6">
        <SectionHeader
          description="管理端不是独立产品，按文档约束先放在同一个 Next.js 应用里。当前实现提供角色、内容治理和系统边界的 M0 占位。"
          eyebrow="M0 Governance Console"
          title="管理员工作台"
        />

        {state.status === "loading" ? (
          <StateSurface
            className="my-6"
            description="正在从 mock API 读取管理端概览。"
            label="Mock API"
            title="同步管理员数据"
            tone="green"
          />
        ) : null}
        {state.status === "error" ? (
          <StateSurface
            className="my-6"
            description={state.message}
            label="Admin API"
            title="没有权限或数据加载失败"
            tone="amber"
          />
        ) : null}
        {state.status === "ready" ? (
          <>
            <div className="grid grid-cols-1 gap-5 border-b hair py-5 md:grid-cols-3">
              <AdminMetric
                label="待审核内容"
                note="公开内容进入社区前的最小审核面"
                value={String(state.overview.moderationPendingCount)}
              />
              <AdminMetric
                label="活跃学习者"
                note="小圈子阶段保留人工观察入口"
                value={String(state.overview.activeUserCount)}
              />
              <AdminMetric label="API 边界" value={state.overview.apiBasePath} note="前端统一经过 lib/api" />
            </div>

            <div className="grid grid-cols-1 gap-7 pt-6 lg:grid-cols-[minmax(0,1fr)_330px]">
              <div>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="font-serif text-[22px] font-semibold tracking-[-0.03em]">内容治理队列</h2>
                  <span className="sect-label">M6 前保留人工可见性</span>
                </div>
                <div className="border-y hair">
                  {state.queue.map((item) => (
                    <div
                      className="grid grid-cols-1 gap-2 border-b hair px-4 py-3 last:border-0 md:grid-cols-[120px_minmax(0,1fr)_90px_70px]"
                      key={item.id}
                    >
                      <span className="text-[12px] text-[color:var(--muted)]">{item.type}</span>
                      <span className="font-medium">{item.title}</span>
                      <span className="text-[12px] text-amber-700">{item.status}</span>
                      <span className="text-right text-[12px] text-[color:var(--muted)]">{item.ageLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="space-y-4">
                <StateSurface
                  description="当前通过 mock admin API 返回管理员角色可见数据。切到后端后由 session role 控制。"
                  label="权限状态"
                  title="Admin role 已进入 API facade"
                  tone="green"
                />
                <StateSurface
                  description="社区举报、admin_actions、moderation_reports 对应的数据结构已经在文档中定义，前端先保留接口边界。"
                  label="数据模型"
                  title="治理事件会落在统一审计表"
                  tone="green"
                />
              </aside>
            </div>
          </>
        ) : null}
      </section>
    </AppShell>
  );
}

function AdminMetric({ label, note, value }: { label: string; note: string; value: string }) {
  return (
    <div className="border-l-2 border-garden-700 pl-4">
      <div className="sect-label">{label}</div>
      <div className="num mt-1 font-serif text-[32px] font-semibold tracking-[-0.05em]">{value}</div>
      <p className="mt-1 text-[12px] leading-5 text-[color:var(--muted)]">{note}</p>
    </div>
  );
}
