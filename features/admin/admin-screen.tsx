import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/ui/section-header";
import { StateSurface } from "@/components/ui/state-surface";

const reviewRows = [
  ["公开题解审核", "Softmax 梯度稳定实现", "待处理", "2 小时"],
  ["举报记录", "PPO Clip 目标解释争议", "需复核", "6 小时"],
  ["内容修订", "线性回归推导公式排版", "已通过", "昨天"],
] as const;

export function AdminScreen() {
  return (
    <AppShell active="workspace">
      <section className="py-6">
        <SectionHeader
          description="管理端不是独立产品，按文档约束先放在同一个 Next.js 应用里。当前实现提供角色、内容治理和系统边界的 M0 占位。"
          eyebrow="M0 Governance Console"
          title="管理员工作台"
        />

        <div className="grid grid-cols-1 gap-5 border-b hair py-5 md:grid-cols-3">
          <AdminMetric label="待审核内容" value="12" note="公开内容进入社区前的最小审核面" />
          <AdminMetric label="活跃学习者" value="128" note="小圈子阶段保留人工观察入口" />
          <AdminMetric label="API 边界" value="/api/v1" note="前端统一经过 lib/api/client" />
        </div>

        <div className="grid grid-cols-1 gap-7 pt-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-serif text-[22px] font-semibold tracking-[-0.03em]">内容治理队列</h2>
              <span className="sect-label">M6 前保留人工可见性</span>
            </div>
            <div className="overflow-hidden rounded-[18px] border hair bg-white/45">
              {reviewRows.map(([type, title, status, age]) => (
                <div
                  className="grid grid-cols-1 gap-2 border-b hair px-4 py-3 last:border-0 md:grid-cols-[120px_minmax(0,1fr)_90px_70px]"
                  key={title}
                >
                  <span className="text-[12px] text-[color:var(--muted)]">{type}</span>
                  <span className="font-medium">{title}</span>
                  <span className="text-[12px] text-amber-700">{status}</span>
                  <span className="text-right text-[12px] text-[color:var(--muted)]">{age}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <StateSurface
              description="后端权限未接入前，此页面只作为管理员信息架构和治理动作的静态前端入口。"
              label="权限状态"
              title="Admin role 等待 session API"
              tone="amber"
            />
            <StateSurface
              description="社区举报、admin_actions、moderation_reports 对应的数据结构已经在文档中定义，前端先保留接口边界。"
              label="数据模型"
              title="治理事件会落在统一审计表"
              tone="green"
            />
          </aside>
        </div>
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
