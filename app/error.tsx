"use client";

import { StateSurface } from "@/components/ui/state-surface";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-8">
      <div className="mx-auto max-w-[760px] pt-24">
        <StateSurface
          description="页面渲染失败。当前前端会把错误边界保留在路由层，后续接入监控后再记录 digest。"
          label="Error Boundary"
          title="这条学习链路暂时断开"
          tone="amber"
        >
          <button
            className="focus-ring rounded-md bg-garden-700 px-4 py-2 text-[13px] font-medium text-white"
            onClick={reset}
            type="button"
          >
            重试
          </button>
        </StateSurface>
      </div>
    </main>
  );
}
