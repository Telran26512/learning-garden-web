"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SynapseLogo } from "@/components/synapse/synapse-logo";
import {
  logout,
  requestCurrentUser,
  type SynapseUser,
} from "@/lib/auth/session";

export default function AppHomePage() {
  const router = useRouter();
  const [user, setUser] = useState<SynapseUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let cancelled = false;
    requestCurrentUser()
      .then((currentUser) => {
        if (cancelled) return;
        if (!currentUser) {
          router.replace("/auth?mode=login");
          return;
        }
        setUser(currentUser);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) router.replace("/auth?mode=login");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    await logout();
    router.replace("/auth?mode=login");
  }

  if (status === "loading") {
    return (
      <main className="sn-app-loading">
        <SynapseLogo size={28} />
        <span>正在恢复会话...</span>
      </main>
    );
  }

  return (
    <main className="sn-app-shell">
      <header className="sn-app-topbar">
        <Link className="sn-auth-brand" href="/">
          <SynapseLogo size={22} />
          <span>Synapse</span>
        </Link>
        <button
          className="sn-btn sn-btn-ghost"
          onClick={handleLogout}
          type="button"
        >
          退出登录
        </button>
      </header>

      <section className="sn-app-welcome">
        <div>
          <p className="sn-auth-eyebrow">● Workspace</p>
          <h1>欢迎回来,{user?.displayName || user?.handle}。</h1>
          <p>
            当前已通过 <code>/auth/me</code> 访问个人身份。刷新页面时,前端会用
            refresh cookie 调用 <code>/auth/refresh</code> 重新获得 access
            token。
          </p>
        </div>
        <div className="sn-card sn-app-identity">
          <span>当前身份</span>
          <strong>@{user?.handle}</strong>
          <p>{user?.email}</p>
          <small>
            role: {user?.role} · status: {user?.status}
          </small>
        </div>
      </section>
    </main>
  );
}
