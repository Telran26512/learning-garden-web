"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { StateSurface } from "@/components/ui/state-surface";
import { adminApi, moderationApi, normalizeApiError } from "@/lib/api";
import type {
  AdminAction,
  AdminOverview,
  ModerationQueueItem,
  ModerationReport,
  ModerationReportStatus,
  RegistrationSettings,
} from "@/lib/api";

type ReadyAdminState = {
  actions: AdminAction[];
  overview: AdminOverview;
  queue: ModerationQueueItem[];
  registration: RegistrationSettings;
  reports: ModerationReport[];
  status: "ready";
};

type AdminState =
  | { status: "error"; message: string }
  | ReadyAdminState
  | { status: "loading" };

type ReportDecision = Exclude<ModerationReportStatus, "open">;

export function AdminScreen() {
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    loadAdminState()
      .then((nextState) => {
        if (isActive) {
          setState({ ...nextState, status: "ready" });
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

  async function reloadAdminState() {
    const nextState = await loadAdminState();
    setState({ ...nextState, status: "ready" });
  }

  async function resolveReport(id: string, status: ReportDecision) {
    setPendingAction(`${id}:${status}`);
    try {
      await moderationApi.resolveReport(id, {
        reason: status === "resolved" ? "Mock review completed." : "Mock moderation decision.",
        status,
      });
      await reloadAdminState();
    } catch (error: unknown) {
      setState({ message: normalizeApiError(error).message, status: "error" });
    } finally {
      setPendingAction(null);
    }
  }

  async function toggleRegistration() {
    if (state.status !== "ready") return;

    setPendingAction("registration");
    try {
      await moderationApi.updateRegistration({
        inviteOnly: state.registration.openRegistration,
        openRegistration: !state.registration.openRegistration,
      });
      await reloadAdminState();
    } catch (error: unknown) {
      setState({ message: normalizeApiError(error).message, status: "error" });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <AppShell active="workspace">
      <section className="py-6">
        <SectionHeader
          description="管理员端连接 M6 的举报处理、开放注册开关和审计日志。当前仍是 mock-first 前端, 后端接入后复用同一 API facade。"
          eyebrow="M6 Governance Console"
          title="管理员工作台"
        />

        {state.status === "loading" ? (
          <StateSurface
            className="my-6"
            description="正在从 mock API 读取治理数据。"
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
            <div className="grid grid-cols-1 gap-5 border-b hair py-5 md:grid-cols-4">
              <AdminMetric
                label="待审核内容"
                note="公开内容和举报的人工入口"
                value={String(state.overview.moderationPendingCount)}
              />
              <AdminMetric
                label="举报工单"
                note="open / resolved / dismissed / escalated"
                value={String(state.reports.length)}
              />
              <AdminMetric
                label="活跃学习者"
                note="小圈子阶段保留人工观察入口"
                value={String(state.overview.activeUserCount)}
              />
              <AdminMetric
                label="开放注册"
                note={state.registration.inviteOnly ? "当前仍需要邀请" : "已允许自助进入"}
                value={state.registration.openRegistration ? "ON" : "OFF"}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-9">
                <section>
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-serif text-[24px] font-semibold tracking-[-0.04em]">
                      举报处理
                    </h2>
                    <span className="sect-label">M6 moderation_reports</span>
                  </div>
                  <div className="border-y hair">
                    {state.reports.map((report) => (
                      <div
                        className="grid grid-cols-1 gap-3 border-b hair px-1 py-4 last:border-0 lg:grid-cols-[120px_minmax(0,1fr)_220px]"
                        key={report.id}
                      >
                        <div>
                          <div className="sect-label">{statusLabel(report.status)}</div>
                          <div className="mt-1 text-[12px] text-[color:var(--muted)]">
                            {targetTypeLabel(report.target.type)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{report.target.label}</div>
                          <p className="mt-1 text-[14px] leading-6 text-[color:var(--muted)]">
                            {report.reason}
                          </p>
                          <p className="mt-2 text-[12px] text-[color:var(--muted)]">
                            reporter: {report.reporter.displayName} · {report.createdAt}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                          <AdminTextButton
                            disabled={pendingAction === `${report.id}:resolved`}
                            label="通过处理"
                            onClick={() => void resolveReport(report.id, "resolved")}
                          />
                          <AdminTextButton
                            disabled={pendingAction === `${report.id}:dismissed`}
                            label="驳回"
                            onClick={() => void resolveReport(report.id, "dismissed")}
                          />
                          <AdminTextButton
                            disabled={pendingAction === `${report.id}:escalated`}
                            label="升级"
                            onClick={() => void resolveReport(report.id, "escalated")}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-serif text-[24px] font-semibold tracking-[-0.04em]">
                      内容治理队列
                    </h2>
                    <span className="sect-label">legacy moderation_queue</span>
                  </div>
                  <div className="border-y hair">
                    {state.queue.map((item) => (
                      <div
                        className="grid grid-cols-1 gap-2 border-b hair px-1 py-3 last:border-0 md:grid-cols-[120px_minmax(0,1fr)_90px_70px]"
                        key={item.id}
                      >
                        <span className="text-[12px] text-[color:var(--muted)]">{item.type}</span>
                        <span className="font-medium">{item.title}</span>
                        <span className="text-[12px] text-amber-700">{item.status}</span>
                        <span className="text-right text-[12px] text-[color:var(--muted)]">
                          {item.ageLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <section className="border-y hair py-5">
                  <div className="sect-label">Registration</div>
                  <h2 className="mt-2 font-serif text-[22px] font-semibold tracking-[-0.04em]">
                    开放注册控制
                  </h2>
                  <p className="mt-2 text-[14px] leading-6 text-[color:var(--muted)]">
                    当前状态: {state.registration.openRegistration ? "开放注册" : "邀请制"}。
                    更新于 {state.registration.updatedAt}
                  </p>
                  <button
                    className="focus-ring mt-4 border-b hair pb-1 text-[13px] font-semibold text-garden-800 transition hover:text-[color:var(--ink)] disabled:opacity-40"
                    disabled={pendingAction === "registration"}
                    onClick={() => void toggleRegistration()}
                    type="button"
                  >
                    {state.registration.openRegistration ? "切回邀请制" : "开放注册"}
                  </button>
                </section>

                <section>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h2 className="font-serif text-[22px] font-semibold tracking-[-0.04em]">
                      审计日志
                    </h2>
                    <span className="sect-label">admin_actions</span>
                  </div>
                  <div className="border-y hair">
                    {state.actions.map((action) => (
                      <div className="border-b hair py-3 last:border-0" key={action.id}>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-medium">{actionLabel(action.action)}</span>
                          <span className="text-[11px] text-[color:var(--muted)]">
                            {action.createdAt}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] leading-5 text-[color:var(--muted)]">
                          {action.target.label} · {action.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <StateSurface
                  description="实时通知、WebSocket、全文搜索和复杂图谱布局先不接入。M6 只验证前端 API 边界、治理状态和审计链路。"
                  label="范围控制"
                  title="mock-first, backend-ready"
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

async function loadAdminState() {
  const [overview, queue, reports, registration, actions] = await Promise.all([
    adminApi.getOverview(),
    adminApi.getModerationQueue(),
    moderationApi.getReports(),
    moderationApi.getRegistration(),
    moderationApi.getAdminActions(),
  ]);

  return {
    actions,
    overview,
    queue,
    registration,
    reports,
  };
}

function AdminMetric({ label, note, value }: { label: string; note: string; value: string }) {
  return (
    <div className="border-l-2 border-garden-700 pl-4">
      <div className="sect-label">{label}</div>
      <div className="num mt-1 font-serif text-[32px] font-semibold tracking-[-0.05em]">
        {value}
      </div>
      <p className="mt-1 text-[12px] leading-5 text-[color:var(--muted)]">{note}</p>
    </div>
  );
}

function AdminTextButton({
  disabled,
  label,
  onClick,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="focus-ring border-b hair pb-1 text-[12px] font-semibold text-garden-800 transition hover:text-[color:var(--ink)] disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function statusLabel(status: ModerationReportStatus) {
  const labels: Record<ModerationReportStatus, string> = {
    dismissed: "已驳回",
    escalated: "已升级",
    open: "待处理",
    resolved: "已处理",
  };

  return labels[status];
}

function targetTypeLabel(type: ModerationReport["target"]["type"]) {
  const labels: Record<ModerationReport["target"]["type"], string> = {
    comment: "评论",
    content: "内容",
    discussion: "讨论",
    user: "用户",
  };

  return labels[type];
}

function actionLabel(action: string) {
  const labels: Record<string, string> = {
    resolve_report: "处理举报",
    review_content: "复核内容",
  };

  return labels[action] ?? action.replaceAll("_", " ");
}
