"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SynapseLogo } from "@/components/ui/synapse-logo";
import { analyzePasswordStrength } from "@/lib/auth/password-strength";
import { login, register } from "@/lib/auth/session";
import { inputClass } from "./styles";

type AuthMode = "login" | "register";

const NOTE_EXCERPTS = [
  {
    body: "把 Q,K,V 各自线性投影 h 次,得到 h 组并行的 attention,再 concat 投影。本节给出从单头到多头的逐步推导,并对应到 attention.py L34-L58 的实现。",
    meta: "@zhe-li · §2 推导 · 4 min read",
    title: "Multi-Head Attention",
  },
  {
    body: "Bellman optimality 不是一个抽象定理,它是在提醒我们:每一次 policy update 都在重新定义未来奖励的坐标系。PPO 的 clip 项只是把这个重定义限制在可信邻域里。",
    meta: "@maxwell-tu · §1.3 objective · 7 min read",
    title: "PPO from Bellman to Implementation",
  },
  {
    body: "当 σ_t 取 0 时,reverse process 从随机采样退化成确定性轨迹。DDIM 的关键不是少采样几步,而是把马尔可夫链写成可跳步的同一个边缘分布族。",
    meta: "@aria-chen · §4.1 reverse process · 5 min read",
    title: "DDIM reverse process",
  },
] as const;

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: AuthMode =
    searchParams.get("mode") === "register" ? "register" : "login";
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
    <main className="sn-auth-page grid min-h-dvh overflow-x-hidden bg-auth-paper font-sans text-auth-ink lg:h-dvh lg:grid-cols-2 lg:overflow-hidden">
      <section
        aria-labelledby="auth-title"
        className="relative flex min-h-dvh flex-col border-auth-subtle px-6 py-8 lg:h-dvh lg:min-h-0 lg:border-r lg:px-16"
      >
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[420px]">
            <header className="mb-12">
              <Link
                className="flex items-center gap-2.5 text-[var(--syn-accent)]"
                href="/"
                aria-label="返回 Synapse 首页"
              >
                <SynapseLogo size={22} />
                <span className="text-[18px] font-semibold text-auth-ink">
                  Synapse
                </span>
              </Link>
              <p className="mt-3 text-[14px] leading-6 text-text-secondary">
                learning graph for ml practitioners
              </p>
              <p className="mt-1 max-w-[320px] text-[13px] italic leading-6 text-text-muted">
                a place where papers, derivations, and code link themselves.
              </p>
            </header>

            <div className="mb-8">
              <p className="mb-3 text-[13px] italic text-text-muted">
                {isRegister ? "private beta access" : "member sign-in"}
              </p>
              <h1
                id="auth-title"
                className="text-[34px] font-semibold leading-tight text-auth-ink"
              >
                {isRegister ? "Request an invite" : "Sign in to Synapse"}
              </h1>
            </div>

            <form
              className={isRegister ? "space-y-5" : "space-y-6"}
              onSubmit={onSubmit}
            >
              {isRegister && (
                <>
                  <label className="block">
                    <span className="mb-1 block text-[12px] italic text-text-muted">
                      invite code
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
                    <span className="mb-1 block text-[12px] italic text-text-muted">
                      handle
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
                <span className="mb-1 block text-[12px] italic text-text-muted">
                  email
                </span>
                <input
                  autoComplete="email"
                  className={inputClass()}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@university.edu"
                  required
                  type="email"
                  value={email}
                />
              </label>

              <label className="block">
                <span className="mb-1 flex items-baseline justify-between gap-6">
                  <span className="text-[12px] italic text-text-muted">
                    password
                  </span>
                  {!isRegister && (
                    <a
                      className="text-[12px] italic text-text-muted transition hover:text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
                      href="mailto:support@synapse.dev?subject=Reset%20password"
                    >
                      forgot password?
                    </a>
                  )}
                </span>
                <input
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  className={inputClass()}
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="········"
                  required
                  type="password"
                  value={password}
                />
              </label>

              {isRegister && (
                <div className="grid grid-cols-[92px_1fr] items-start gap-3">
                  <div
                    className="grid grid-cols-4 gap-1 pt-2"
                    aria-hidden="true"
                  >
                    {[0, 1, 2, 3].map((bar) => (
                      <span
                        key={bar}
                        className={`h-1 ${
                          bar < strength.score
                            ? "bg-[var(--syn-accent)]"
                            : "bg-auth-ink/12"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[12px] leading-5 text-text-secondary">
                    <strong className="mr-2 font-medium text-auth-ink">
                      {strength.label}
                    </strong>
                    {strength.hint}
                  </p>
                </div>
              )}

              {isRegister && (
                <label className="flex items-start gap-3 text-[12px] leading-5 text-text-secondary">
                  <input
                    checked={acceptedTerms}
                    className="mt-1 size-4 rounded-none border-auth-subtle accent-[var(--syn-accent)]"
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    required
                    type="checkbox"
                  />
                  <span>
                    我已阅读并同意{" "}
                    <Link
                      className="text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
                      href="/terms"
                    >
                      服务条款
                    </Link>{" "}
                    与{" "}
                    <Link
                      className="text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
                      href="/privacy"
                    >
                      隐私政策
                    </Link>
                    。同意公开 handle、头像与公开内容，可随时切回 private。
                  </span>
                </label>
              )}

              {error && (
                <div className="border border-auth-subtle px-3 py-2 text-[13px] leading-5 text-auth-ink">
                  {error}
                </div>
              )}

              <button
                className="h-11 w-full border border-[var(--syn-accent)] bg-transparent text-[15px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting
                  ? "Please wait..."
                  : isRegister
                    ? "Request invite →"
                    : "Sign in →"}
              </button>
            </form>

            <div className="mt-6">
              <div className="h-px w-3/5 bg-auth-subtle" aria-hidden="true" />
              <a
                className="mt-5 block text-[13px] italic text-text-secondary transition hover:text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
                href={githubURL}
              >
                or continue with GitHub →
              </a>
            </div>

            <div className="mt-8">
              <p className="text-[13px] italic text-text-muted">
                {isRegister ? "already have access?" : "new to synapse?"}
              </p>
              <Link
                className="mt-2 block text-[18px] leading-6 text-[var(--syn-accent)] transition hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
                href={isRegister ? "/auth?mode=login" : "/auth?mode=register"}
              >
                {isRegister ? "Sign in →" : "Create an account →"}
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-[12px] italic leading-none text-text-muted">
          <div className="flex flex-wrap gap-1.5">
            <Link
              className="hover:text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
              href="/terms"
            >
              服务条款
            </Link>
            <span>·</span>
            <Link
              className="hover:text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
              href="/privacy"
            >
              隐私政策
            </Link>
            <span>·</span>
            <Link
              className="hover:text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
              href="/#workflow"
            >
              文档
            </Link>
          </div>
          <div className="mt-3 text-[11px] text-text-soft">
            Vol. 0.7.2 · published from Hangzhou · 2026
          </div>
        </footer>
      </section>

      <aside
        className="border-auth-subtle px-6 py-12 lg:h-dvh lg:overflow-y-auto lg:px-16 lg:py-16"
        aria-label="Synapse 正在写作的笔记节选"
      >
        <div className="mx-auto flex min-h-full max-w-[560px] flex-col justify-center">
          <p className="mb-10 text-[13px] italic text-text-muted">
            currently being written on synapse
          </p>
          <div className="border-y border-auth-subtle">
            {NOTE_EXCERPTS.map((note, index) => (
              <article
                className="grid grid-cols-[46px_1fr] gap-6 border-b border-auth-subtle py-8 last:border-b-0"
                key={note.title}
              >
                <span className="font-display text-[26px] font-semibold leading-none text-text-soft tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-display text-[25px] font-semibold leading-tight text-auth-ink">
                    {note.title}
                  </h2>
                  <p className="mt-3 font-mono text-[12px] leading-5 text-text-muted">
                    {note.meta}
                  </p>
                  <p className="mt-5 text-[16px] leading-[1.75] text-text-secondary">
                    {note.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
