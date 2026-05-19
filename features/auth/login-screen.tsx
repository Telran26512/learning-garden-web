import { StateSurface } from "@/components/ui/state-surface";

export function LoginScreen() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-8 text-[13px] text-[color:var(--ink)]">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-[1120px] grid-cols-1 overflow-hidden rounded-[28px] border hair bg-white/35 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative border-b hair p-7 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(31,138,71,0.16),transparent_44%),radial-gradient(circle_at_24%_18%,rgba(245,158,11,0.18),transparent_26%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="text-[12px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
                Synapse Access
              </div>
              <h1 className="mt-5 font-serif text-[44px] font-semibold leading-[0.96] tracking-[-0.06em]">
                把一次学习拆成可复用的证据链。
              </h1>
              <p className="mt-5 max-w-[46ch] text-[14px] leading-7 text-[color:var(--muted)]">
                登录入口先按 M0 占位处理，后续由后端 session/API 接入。当前页面用于验证信息架构、权限入口和品牌语气。
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 text-[12px]">
              <MiniStat value="03" label="推导步骤" />
              <MiniStat value="01" label="代码实验" />
              <MiniStat value="06" label="回放卡片" />
            </div>
          </div>
        </section>

        <section className="p-7 lg:p-10">
          <div className="mx-auto max-w-[440px]">
            <div className="mb-8">
              <div className="sect-label">M0 Auth Placeholder</div>
              <h2 className="mt-2 font-serif text-[30px] font-semibold tracking-[-0.04em]">
                学习者入口
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-[color:var(--muted)]">
                真实登录会在后端 session 完成后接入；这里先固定邮箱、角色和返回路径。
              </p>
            </div>

            <form className="space-y-4">
              <label className="block">
                <span className="sect-label mb-1.5 block">邮箱</span>
                <input
                  className="inp w-full bg-white/70 px-3 py-2.5 focus:border-garden-600 focus:outline-none"
                  defaultValue="raymond@synapse.local"
                  type="email"
                />
              </label>
              <label className="block">
                <span className="sect-label mb-1.5 block">密码</span>
                <input
                  className="inp w-full bg-white/70 px-3 py-2.5 focus:border-garden-600 focus:outline-none"
                  defaultValue="learning-garden"
                  type="password"
                />
              </label>
              <button
                className="focus-ring w-full rounded-md bg-garden-700 px-4 py-2.5 font-medium text-white transition hover:bg-garden-800"
                type="button"
              >
                进入 Workspace
              </button>
            </form>

            <StateSurface
              className="mt-7"
              description="当前没有调用后端认证接口，也不会写入 session。完成后端联调时只需要替换这里的提交动作。"
              label="接入状态"
              title="认证 UI 已预留，行为仍是静态占位"
              tone="amber"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border hair bg-[var(--paper)]/70 p-3">
      <div className="num font-serif text-[26px] font-semibold">{value}</div>
      <div className="text-[11px] text-[color:var(--muted)]">{label}</div>
    </div>
  );
}
