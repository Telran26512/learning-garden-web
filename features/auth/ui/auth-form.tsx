"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SynapseLogo } from "@/components/ui/synapse-logo";
import { analyzePasswordStrength } from "@/lib/auth/password-strength";
import { login, register } from "@/lib/auth/session";
import { GitHubIcon } from "./github-icon";
import { ProductMockup } from "./product-mockup";
import { inputClass, tabClass } from "./styles";

type AuthMode = "login" | "register";

export function AuthPageContent() {
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
    <main className="sn-auth-page min-h-dvh overflow-x-hidden bg-auth-paper font-sans text-auth-ink lg:grid lg:h-dvh lg:grid-cols-[39%_61%] lg:overflow-hidden">
      <section
        aria-labelledby="auth-title"
        className="relative min-h-dvh bg-[#0a0d12] px-6 py-8 pb-24 lg:h-dvh lg:min-h-0 lg:overflow-hidden lg:border-r lg:border-auth-subtle lg:px-12"
      >
        {/* Auth 表单保持 380px 宽；注册态上移，避免桌面视口出现整页滚动。 */}
        <div
          className={`w-full max-w-[380px] ${
            isRegister ? "pt-8 lg:pt-14" : "pt-[72px] lg:pt-[96px]"
          }`}
        >
          <header className={isRegister ? "mb-6" : "mb-9"}>
            <Link
              className="flex items-center gap-2.5 text-auth-ink"
              href="/"
              aria-label="返回 Synapse 首页"
            >
              <SynapseLogo size={22} />
              <span className="text-[16px] font-[650] tracking-normal">
                Synapse
              </span>
            </Link>
            <p className="mt-2 text-[10px] leading-none text-text-secondary">
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
            className="mb-5 flex gap-8 border-b border-auth-subtle"
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
          <a
            className="mb-5 flex h-10 w-full items-center justify-center gap-2.5 border border-auth-subtle bg-white/[0.03] px-3 text-center text-[14px] font-medium text-auth-ink transition hover:bg-auth-hover"
            href={githubURL}
          >
            <GitHubIcon />
            <span>GitHub {isRegister ? "注册" : "登录"}</span>
          </a>

          <form
            className={isRegister ? "space-y-2.5" : "space-y-3.5"}
            onSubmit={onSubmit}
          >
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
                    pattern={String.raw`[a-z0-9\-]+`}
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
            {!isRegister && (
              <div className="-mt-1 flex justify-end">
                <a
                  className="text-[12px] text-auth-ink/58 transition hover:text-auth-ink"
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
                        bar < strength.score ? "bg-auth-ink" : "bg-auth-ink/14"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[12px] leading-5 text-auth-ink/62">
                  <strong className="mr-2 font-medium text-auth-ink">
                    {strength.label}
                  </strong>
                  {strength.hint}
                </p>
              </div>
            )}

            {isRegister && (
              <label className="flex items-start gap-3 text-[12px] leading-5 text-auth-ink/68">
                <input
                  checked={acceptedTerms}
                  className="mt-1 size-4 border-auth-ink/18 accent-auth-ink"
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
              <div className="border border-auth-subtle bg-white/[0.03] px-3 py-2 text-[13px] text-auth-ink">
                {error}
              </div>
            )}

            <button
              className="h-10 w-full bg-[var(--syn-accent)] text-[14px] font-medium text-white transition hover:bg-[var(--syn-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "处理中..." : isRegister ? "创建账号" : "登录"}
            </button>
          </form>
          <p className="mt-6 flex justify-center gap-1 text-center text-[13px] text-auth-ink/58">
            <span>{isRegister ? "已有账号？" : "还没有账号？"}</span>
            <Link
              className="text-auth-ink underline underline-offset-3"
              href={isRegister ? "/auth?mode=login" : "/auth?mode=register"}
            >
              {isRegister ? "立即登录" : "立即注册"}
            </Link>
          </p>
        </div>
        <footer className="absolute bottom-8 left-6 text-[11px] leading-none text-text-secondary lg:left-12">
          <div className="flex gap-1.5">
            <Link className="hover:text-text-muted" href="/terms">
              服务条款
            </Link>
            <span>·</span>
            <Link className="hover:text-text-muted" href="/privacy">
              隐私政策
            </Link>
            <span>·</span>
            <Link className="hover:text-text-muted" href="/#workflow">
              文档
            </Link>
          </div>
          <div className="mt-2 text-[10px] text-text-soft">
            © 2026 Synapse · v0.7.2 · built in Hangzhou
          </div>
        </footer>
      </section>

      <aside
        className="relative hidden min-h-dvh items-center justify-center overflow-hidden bg-[#06080c] px-8 py-12 lg:flex lg:h-dvh lg:min-h-0 lg:px-16"
        aria-label="Synapse 产品界面预览"
      >
        <ProductMockup />
      </aside>
    </main>
  );
}
