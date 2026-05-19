import { StateSurface } from "@/components/ui/state-surface";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-8">
      <div className="mx-auto max-w-[760px] pt-24">
        <StateSurface
          description="正在准备学习路线、概念材料和运行环境边界。"
          label="Loading"
          title="同步学习工作台"
          tone="green"
        />
      </div>
    </main>
  );
}
