"use client";

import Link from "next/link";
import type { PublicContentDetail } from "@/lib/api";

export function PublicContentDetailScreen({ concept }: { concept: PublicContentDetail }) {
  return (
    <article className="py-8">
      <Link
        className="text-[12px] font-medium text-garden-700 hover:text-garden-800"
        href="/community"
      >
        ← 返回社区
      </Link>
      <header className="mt-5 border-b hair pb-9">
        <div className="sect-label">Public Concept</div>
        <h1 className="mt-3 max-w-[880px] font-serif text-[38px] font-semibold leading-tight tracking-[-0.05em]">
          {concept.title}
        </h1>
        <p className="mt-3 max-w-[72ch] text-[14px] leading-relaxed text-slate-600">
          {concept.summary}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {concept.tags.map((tag) => (
            <span
              className="rounded-full bg-garden-50 px-3 py-1 text-[12px] text-garden-700"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </header>
      {concept.sections.length === 0 ? (
        <section className="border-b hair py-8">
          <div className="sect-label">Mock Detail</div>
          <h2 className="mt-2 text-[18px] font-semibold">这条公开内容还没有详细章节</h2>
          <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-slate-500">
            当前 mock API 已能解析公开列表里的所有 slug。后端内容详情接入后，这里会显示数学推导、代码和论文章节。
          </p>
        </section>
      ) : (
        <div className="divide-y hair">
          {concept.sections.map((section) => (
            <section className="grid gap-5 py-8 lg:grid-cols-[150px_minmax(0,1fr)]" key={section.id}>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {section.kind}
                </div>
                {section.sourceTitle ? (
                  <p className="mt-2 max-w-[16ch] text-[12px] leading-relaxed text-slate-400">
                    {section.sourceTitle}
                    {section.sourceMeta ? ` · ${section.sourceMeta}` : ""}
                  </p>
                ) : null}
              </div>
              <div>
                <h2 className="text-[19px] font-semibold">{section.title}</h2>
                {section.kind === "code" ? (
                  <pre className="code-scroll mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-[12px] leading-relaxed text-slate-100">
                    <code>{section.body}</code>
                  </pre>
                ) : (
                  <p className="mt-3 max-w-[78ch] whitespace-pre-wrap text-[14px] leading-relaxed text-slate-600">
                    {section.body}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
