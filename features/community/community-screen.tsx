"use client";

import Link from "next/link";
import { Avatar } from "@/components/layout/top-nav";
import type { PublicContentItem } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

export function CommunityScreen({ content }: { content: PublicContentItem[] }) {
  const tagRank = getTagRank(content);

  return (
    <section className="py-6">
      <h1 className="mb-1 text-[18px] font-bold">训练成果社区</h1>
      <p className="mb-3 text-[12px] text-slate-500">
        这里展示能复用的题解、推导、错因复盘和可运行实现。
      </p>
      <div className="flex items-center gap-5 border-b hair text-[13px]">
        <span className="-mb-px border-b-2 border-garden-600 pb-2.5 font-semibold text-garden-700">
          公开内容
        </span>
        <span className="pb-2.5 text-slate-500">概念 / 论文 / 实验</span>
        <span className="pb-2.5 text-slate-500">后端搜索接入前为静态 mock feed</span>
      </div>
      <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <div className="flex items-center gap-3 py-4">
            <div className="inp flex flex-1 items-center gap-2 bg-slate-50 px-3 py-2 text-[13px] text-slate-400">
              <span>⌕</span>
              <span>搜索题解、实现、错因、公式…</span>
            </div>
            <span className="border-l hair pl-3.5 text-[13px] text-slate-500">
              ⚲ 筛选待后端接入
            </span>
          </div>
          {content.length === 0 ? (
            <div className="border-y hair py-6">
              <div className="sect-label">Empty Feed</div>
              <h2 className="mt-2 text-[18px] font-semibold">暂时没有公开内容</h2>
              <p className="mt-2 text-[13px] text-slate-500">
                等后端接入后，这里会展示所有 `visibility=public` 的概念、论文和实验。
              </p>
            </div>
          ) : (
            <div className="border-t hair">
              {content.map((item) => (
                <article className="border-b hair py-4" key={item.id}>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded border border-garden-100 bg-garden-50 px-1.5 py-0.5 text-[11px] text-garden-700">
                        {getContentTypeLabel(item.contentType)}
                      </span>
                      <Link
                        href={`/community/concepts/${item.slug}`}
                        className="text-left text-[14px] font-semibold transition hover:text-garden-700"
                      >
                        {item.title}
                      </Link>
                    </div>
                    <p className="mt-1 text-[12px] text-slate-500">{item.excerpt}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-500 md:grid-cols-4">
                      <span>
                        类型 <b className="text-slate-700">{getContentTypeLabel(item.contentType)}</b>
                      </span>
                      <span>
                        评论 <b className="num text-slate-700">{item.commentCount}</b>
                      </span>
                      <span>
                        可见性 <b className="text-slate-700">{item.visibility}</b>
                      </span>
                      <span>
                        作者{" "}
                        <Link
                          className="font-bold text-slate-700 hover:text-garden-700"
                          href={`/users/${item.author.id}`}
                        >
                          {item.author.displayName}
                        </Link>{" "}
                        · {formatShortDate(item.updatedAt)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-[12px] text-slate-400">
                      <span>作者等级 Lv.{item.author.level}</span>
                      <span>更新 {formatShortDate(item.updatedAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <CommunityProfile tagRank={tagRank} />
      </div>
    </section>
  );
}

function getContentTypeLabel(type: PublicContentItem["contentType"]) {
  const labels: Record<PublicContentItem["contentType"], string> = {
    concept: "题解",
    experiment: "实验",
    paper: "论文",
  };

  return labels[type];
}

function getTagRank(content: PublicContentItem[]) {
  const counts = new Map<string, number>();

  for (const item of content) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5) as Array<[string, number]>;
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(
    new Date(value),
  );
}

function CommunityProfile({ tagRank }: { tagRank: Array<[string, number]> }) {
  return (
    <aside className="mt-8 lg:border-l lg:pl-8 hair">
      <div className="pt-4 text-center">
        <Avatar size="lg" />
        <div className="mt-3 text-[16px] font-bold">Raymond</div>
        <div className="mt-1 text-[12px] text-slate-400">Level 6 · 学习者</div>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
          热爱机器学习与统计学,构建自己的知识体系。
        </p>
      </div>
      <div className="mt-4 grid grid-cols-4 border-y hair py-3 text-center">
        <ProfileStat value="28" label="概念" />
        <ProfileStat value="16" label="实验" />
        <ProfileStat value="8" label="公开内容" />
        <ProfileStat value="128" label="关注者" />
      </div>
      <div className="mt-4 border-b hair pb-4 text-center text-[12px] font-medium text-slate-500">
        个人资料编辑保留在 Workspace 设置中
      </div>
      <div className="border-b hair py-4">
        <h3 className="mb-2 text-[14px] font-semibold">本周挑战</h3>
        <div className="text-[13px] font-medium">用 NumPy 实现 5 个基础模型</div>
        <p className="mt-1 text-[12px] text-slate-500">
          线性回归、逻辑回归、PCA、KNN、Softmax 分类器。
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-garden-600" style={{ width: "60%" }} />
        </div>
        <div className="mt-1 text-[11px] text-slate-400">已完成 3 / 5</div>
      </div>
      <div className="border-b hair py-4">
        <h3 className="mb-2 text-[14px] font-semibold">热门错因</h3>
        <div className="divide-y divide-slate-100 text-[12px]">
          <HotError label="偏置项遗漏" value="47" />
          <HotError label="矩阵维度不匹配" value="39" />
          <HotError label="softmax 数值溢出" value="26" />
        </div>
      </div>
      <h3 className="mb-1 mt-4 text-[14px] font-semibold">训练标签热榜</h3>
      {tagRank.map(([tag, count], index) => (
        <div
          className="flex items-center gap-2 border-b hair py-[6px] text-[12px] last:border-0"
          key={tag}
        >
          <span className={cn("w-4", index < 3 ? "font-bold text-garden-600" : "text-slate-400")}>
            {index + 1}
          </span>
          <span className="flex-1">{tag}</span>
          <span className="text-slate-400">{count}</span>
        </div>
      ))}
    </aside>
  );
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="num text-[15px] font-bold">{value}</div>
      <div className="text-[11px] text-slate-400">{label}</div>
    </div>
  );
}

function HotError({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 py-2">
      <span>{label}</span>
      <span className="num text-slate-400">{value}</span>
    </div>
  );
}
