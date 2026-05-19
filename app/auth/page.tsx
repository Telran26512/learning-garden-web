"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { analyzePasswordStrength } from "@/lib/auth/password-strength";
import { login, register } from "@/lib/auth/session";

type AuthMode = "login" | "register";

const graphNodes = [
  { label: "Paper", x: 46, y: 18, active: false },
  { label: "QK^T", x: 30, y: 42, active: false },
  { label: "Scale", x: 54, y: 45, active: true },
  { label: "Softmax", x: 76, y: 34, active: false },
  { label: "Code", x: 62, y: 70, active: false },
  { label: "Note", x: 24, y: 72, active: false },
];

const graphConnections = [
  "M46 18 C42 30 36 35 30 42",
  "M30 42 C38 47 45 48 54 45",
  "M54 45 C62 40 68 36 76 34",
  "M54 45 C58 56 60 62 62 70",
  "M30 42 C24 54 22 62 24 72",
];

function tabClass(isActive: boolean) {
  // §2.c 登录/注册 tab 改为下划线式处理。
  return [
    "flex h-9 items-center border-b-2 px-0 text-[13px] font-medium transition-colors",
    isActive
      ? "border-[#1F2A26] text-[#1F2A26]"
      : "border-transparent text-[#9CA3AF] hover:text-[#4B5563]",
  ].join(" ");
}

function inputClass() {
  return "h-10 w-full border border-[#1F2A26]/18 bg-white px-3 text-[14px] text-[#1F2A26] outline-none transition placeholder:text-[#1F2A26]/35 focus:border-[#1F2A26]";
}

function GitHubIcon() {
  // §2.d 使用真实 GitHub octocat SVG 图标替代 GH 方块。
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 text-[#0A0A0A]"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 0C3.58 0 0 3.67 0 8.2c0 3.62 2.29 6.69 5.47 7.77.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.38-2.53-.5-2.69-.97-.09-.24-.48-.97-.82-1.17-.28-.16-.68-.55-.01-.56.63-.01 1.08.59 1.23.84.72 1.24 1.87.89 2.33.68.07-.53.28-.89.51-1.1-1.78-.21-3.64-.91-3.64-4.04 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.44 7.44 0 0 1 8 3.91c.68 0 1.36.09 2 .27 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.14-1.87 3.83-3.65 4.04.29.26.54.76.54 1.53 0 1.1-.01 1.98-.01 2.25 0 .22.15.48.55.4A8.06 8.06 0 0 0 16 8.2C16 3.67 12.42 0 8 0Z" />
    </svg>
  );
}

function ProductMockup() {
  return (
    <div className="relative w-full max-w-[860px]">
      {/* §6 删除“新功能”橙色标签，避免无信息量的贴片装饰。 */}
      {/* §4.a / §5 提高窗口底色对比度，并加入边框、阴影和轻微右上偏移。 */}
      <div className="translate-x-2 -translate-y-1 overflow-hidden border border-[#2F3F38] bg-[#0F1A16] shadow-[0_20px_40px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)]">
        <div className="flex h-9 items-center justify-between border-b border-white/10 bg-white/5 px-3 text-[11px] text-white/52">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-white/28" />
            <span className="size-2 rounded-full bg-white/18" />
            <span className="size-2 rounded-full bg-white/18" />
          </div>
          <span>synapse.local/graph/transformer</span>
        </div>

        <div className="grid min-h-[520px] grid-cols-[150px_1fr_230px] bg-[#0F1A16] text-[12px] text-white/68">
          <nav className="border-r border-white/10 bg-white/5 p-4">
            <div className="mb-6 text-[13px] font-semibold text-white">
              Synapse
            </div>
            <div className="space-y-2">
              {["Inbox", "Papers", "Derivations", "Code", "Review"].map(
                (item) => (
                  <div
                    className={`px-2 py-1.5 ${
                      item === "Derivations"
                        ? "bg-white/10 text-white"
                        : "text-white/50"
                    }`}
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </nav>

          <section className="relative overflow-hidden bg-[#0F1A16]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="text-[13px] font-semibold text-white">
                  Transformer attention
                </div>
                <div className="mt-1 text-[11px] text-white/42">
                  12 nodes · 5 code anchors · updated 09:42
                </div>
              </div>
              <div className="border border-white/12 px-2 py-1 text-[11px] text-white/55">
                Focus
              </div>
            </div>

            <div className="relative h-[445px]">
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* §4.c 节点连线改为更清晰的实色曲线。 */}
                {graphConnections.map((path) => (
                  <path
                    d={path}
                    fill="none"
                    key={path}
                    stroke="#4A5A50"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              {graphNodes.map((node) => (
                <div
                  // §4.b 普通节点改为实线边框、深填充和纯白文字。
                  className={`absolute flex h-12 min-w-20 items-center justify-center border px-3 text-[12px] font-medium ${
                    node.active
                      ? "border-white bg-white text-[#0A0A0A] shadow-[0_14px_36px_rgba(0,0,0,0.26)]"
                      : "border-[#2A3A33] bg-[#1A2620] text-white"
                  }`}
                  key={node.label}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {node.label}
                </div>
              ))}

              <div className="absolute bottom-5 left-5 right-5 border border-white/10 bg-white/5 p-4">
                <div className="mb-3 text-[11px] uppercase tracking-[0.08em] text-white/42">
                  Active path
                </div>
                <div className="grid grid-cols-4 gap-2 text-[11px] text-white/60">
                  <span>Paper</span>
                  <span>QK^T</span>
                  <span className="text-white">Scale</span>
                  <span>Code</span>
                </div>
              </div>
            </div>
          </section>

          {/* §4.d Selected node 面板保持浅色，并增加左侧投影。 */}
          <aside className="border-l border-white/10 bg-[#F4F2EE] p-4 text-[#1F2A26] shadow-[-4px_0_12px_rgba(0,0,0,0.15)]">
            <div className="mb-4 text-[11px] uppercase tracking-[0.08em] text-[#1F2A26]/48">
              Selected node
            </div>
            <h2 className="text-[18px] font-semibold leading-tight">
              Scale by sqrt(d_k)
            </h2>
            <p className="mt-3 text-[12px] leading-5 text-[#1F2A26]/68">
              防止点积随着维度增大而让 softmax 进入饱和区。这里关联了论文第 3.2
              节和 PyTorch 复现实验。
            </p>
            <div className="mt-5 space-y-2">
              <div className="border border-[#1F2A26]/18 bg-white p-3">
                <div className="text-[11px] text-[#1F2A26]/45">Source</div>
                <div className="mt-1 text-[12px]">paper.pdf · p.4</div>
              </div>
              <div className="border border-[#1F2A26]/18 bg-white p-3">
                <div className="text-[11px] text-[#1F2A26]/45">Code</div>
                <div className="mt-1 font-mono text-[12px]">
                  attention.py:21
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: AuthMode =
    searchParams.get("mode") === "login" ? "login" : "register";
  const [inviteCode, setInviteCode] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const strength = useMemo(() => analyzePasswordStrength(password), [password]);
  const githubURL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:18080"}/auth/github`;
  const isRegister = mode === "register";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isRegister && !acceptedTerms) {
      setError("请先同意服务条款与隐私政策。");
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register({
          inviteCode,
          email,
          handle,
          displayName: handle,
          password,
        });
      } else {
        await login({ email, password });
      }
      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "认证失败，请稍后再试。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[#F4F2EE] font-sans text-[#1F2A26] lg:grid lg:grid-cols-[39%_61%]">
      <section
        aria-labelledby="auth-title"
        className="relative min-h-dvh bg-white px-6 py-9 pb-28 lg:px-12"
      >
        {/* §2.a / §2.b 表单宽度收紧到 380px，并从顶部 120px 固定开始。 */}
        <div className="w-full max-w-[380px] pt-[88px] lg:pt-[120px]">
          <header className="mb-10">
            <Link
              className="flex items-center gap-2.5 text-[#1F2A26]"
              href="/"
              aria-label="返回 Synapse 首页"
            >
              <span className="grid size-7 place-items-center bg-[#1F2A26] text-[13px] font-medium text-white">
                S
              </span>
              <span className="text-[15px] font-medium">Synapse</span>
            </Link>
            {/* §1.d Logo 下方增加极小产品定位文字。 */}
            <p className="mt-2 text-[10px] leading-none text-[#9CA3AF]">
              learning graph for ml practitioners
            </p>
          </header>

          <div className="mb-6">
            <h1
              id="auth-title"
              className="text-[22px] font-medium leading-7 tracking-[-0.01em]"
            >
              {isRegister ? "创建账号" : "登录 Synapse"}
            </h1>
          </div>

          <div
            className="mb-5 flex gap-8 border-b border-[#E5E7EB]"
            role="tablist"
            aria-label="认证模式"
          >
            <Link
              aria-selected={mode === "login"}
              className={tabClass(mode === "login")}
              href="/auth?mode=login"
              role="tab"
            >
              <span>登录</span>
            </Link>
            <Link
              aria-selected={mode === "register"}
              className={tabClass(mode === "register")}
              href="/auth?mode=register"
              role="tab"
            >
              <span>注册</span>
            </Link>
          </div>

          {/* §2.d GitHub 按钮改为 outline、左对齐和真实 octocat 图标。 */}
          <a
            className="mb-5 flex h-10 w-full items-center justify-start gap-3 border border-[#E5E7EB] bg-white px-3 text-[14px] font-medium text-[#1F2A26] transition hover:bg-[#F9FAFB]"
            href={githubURL}
          >
            <GitHubIcon />
            <span>GitHub {isRegister ? "注册" : "登录"}</span>
          </a>

          <form className="space-y-3.5" onSubmit={onSubmit}>
            {isRegister && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium">
                    邀请码
                  </span>
                  <input
                    autoComplete="one-time-code"
                    className={inputClass()}
                    onChange={(event) => setInviteCode(event.target.value)}
                    placeholder="SYN-XXXX-XXXX"
                    required
                    value={inviteCode}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium">
                    Handle
                  </span>
                  <input
                    autoComplete="username"
                    className={inputClass()}
                    inputMode="text"
                    minLength={3}
                    onChange={(event) => setHandle(event.target.value)}
                    pattern="[a-z0-9-]+"
                    placeholder="zhe-li"
                    required
                    value={handle}
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">邮箱</span>
              <input
                autoComplete="email"
                className={inputClass()}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">密码</span>
              <input
                autoComplete={isRegister ? "new-password" : "current-password"}
                className={inputClass()}
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            {/* §1.a 密码输入框下方增加右对齐忘记密码链接。 */}
            {!isRegister && (
              <div className="-mt-1 flex justify-end">
                <a
                  className="text-[12px] text-[#6B7280] transition hover:text-[#374151]"
                  href="mailto:support@synapse.dev?subject=Reset%20password"
                >
                  忘记密码？
                </a>
              </div>
            )}

            {isRegister && (
              <div className="grid grid-cols-[92px_1fr] items-start gap-3">
                <div className="grid grid-cols-4 gap-1 pt-2" aria-hidden="true">
                  {[0, 1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className={`h-1 ${
                        bar < strength.score
                          ? "bg-[#1F2A26]"
                          : "bg-[#1F2A26]/14"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[12px] leading-5 text-[#1F2A26]/62">
                  <strong className="mr-2 font-medium text-[#1F2A26]">
                    {strength.label}
                  </strong>
                  {strength.hint}
                </p>
              </div>
            )}

            {isRegister && (
              <label className="flex items-start gap-3 text-[12px] leading-5 text-[#1F2A26]/68">
                <input
                  checked={acceptedTerms}
                  className="mt-1 size-4 border-[#1F2A26]/18 accent-[#1F2A26]"
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  required
                  type="checkbox"
                />
                <span>
                  我已阅读并同意 <Link href="/terms">服务条款</Link> 与{" "}
                  <Link href="/privacy">隐私政策</Link>。同意公开
                  handle、头像与公开内容，可随时切回 private。
                </span>
              </label>
            )}

            {error && (
              <div className="border border-[#1F2A26]/18 bg-[#F4F2EE] px-3 py-2 text-[13px] text-[#1F2A26]">
                {error}
              </div>
            )}

            <button
              // §3 主按钮改为纯黑实色，无阴影、无 glow。
              className="h-10 w-full bg-[#0A0A0A] text-[14px] font-medium text-white transition hover:bg-[#1F1F1F] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "处理中..." : isRegister ? "创建账号" : "登录"}
            </button>
          </form>

          {/* §1.b 主按钮下方增加账号切换提示。 */}
          <p className="mt-6 text-center text-[13px] text-[#6B7280]">
            {isRegister ? "已有账号？" : "还没有账号？"}
            <Link
              className="text-[#0A0A0A] underline underline-offset-3"
              href={isRegister ? "/auth?mode=login" : "/auth?mode=register"}
            >
              {isRegister ? "立即登录" : "立即注册"}
            </Link>
          </p>
        </div>

        {/* §1.c 左侧 column 底部补足真实产品常见 footer metadata。 */}
        <footer className="absolute bottom-8 left-6 text-[11px] leading-none text-[#9CA3AF] lg:left-12">
          <div className="flex gap-1.5">
            <Link className="hover:text-[#6B7280]" href="/terms">
              服务条款
            </Link>
            <span>·</span>
            <Link className="hover:text-[#6B7280]" href="/privacy">
              隐私政策
            </Link>
            <span>·</span>
            <Link className="hover:text-[#6B7280]" href="/#workflow">
              文档
            </Link>
          </div>
          <div className="mt-2 text-[10px] text-[#D1D5DB]">
            © 2026 Synapse · v0.7.2 · built in Hangzhou
          </div>
        </footer>
      </section>

      <aside
        className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#1F2A26] px-8 py-12 lg:px-16"
        aria-label="Synapse 产品界面预览"
      >
        <ProductMockup />
      </aside>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
