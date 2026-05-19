import Link from "next/link";
import { StateSurface } from "@/components/ui/state-surface";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 py-8">
      <div className="mx-auto max-w-[760px] pt-24">
        <StateSurface
          description="这个概念、内容或训练入口还没有被创建。先回到 Workspace 继续当前训练闭环。"
          label="Empty Route"
          title="没有找到对应的学习节点"
        >
          <Link
            className="focus-ring inline-flex rounded-md bg-garden-700 px-4 py-2 text-[13px] font-medium text-white"
            href="/workspace"
          >
            返回 Workspace
          </Link>
        </StateSurface>
      </div>
    </main>
  );
}
