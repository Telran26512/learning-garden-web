import { UserRoundCheck } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import type { CurrentUser } from "@/lib/api";

export function SessionSummary({ user }: { user: CurrentUser | null }) {
  return (
    <aside className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-[var(--accent)]">
          <UserRoundCheck aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {user ? user.displayName : "未登录"}
          </p>
          <p className="truncate text-xs text-[var(--muted)]">
            {user ? `@${user.handle}` : "session pending"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-4">
        <div>
          <p className="text-xs text-[var(--muted)]">角色</p>
          <p className="mt-1 text-sm font-semibold">{user?.role ?? "guest"}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--muted)]">认证</p>
          <div className="mt-1">
            <StatusPill label={user ? "active" : "none"} tone="green" />
          </div>
        </div>
      </div>
    </aside>
  );
}
