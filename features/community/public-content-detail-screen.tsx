"use client";

import Link from "next/link";
import { useState } from "react";
import type { Backlink, Comment as ApiComment, PublicContentDetail } from "@/lib/api";

export function PublicContentDetailScreen({
  backlinks,
  comments,
  concept,
  onCreateComment,
  onDeleteComment,
  onReplyToComment,
}: {
  backlinks: Backlink[];
  comments: ApiComment[];
  concept: PublicContentDetail;
  onCreateComment: (body: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
  onReplyToComment: (parentId: string, body: string) => Promise<void>;
}) {
  const [commentBody, setCommentBody] = useState("偏置列这段解释有用。");
  const [replyBody, setReplyBody] = useState("这里可以补一个矩阵维度例子。");

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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
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
        </div>
        <aside className="py-8 lg:border-l lg:pl-7 hair">
          <div className="sect-label">Backlinks</div>
          <div className="mt-3 divide-y hair border-y hair">
            {backlinks.map((backlink) => (
              <div className="py-3" key={backlink.id}>
                <div className="text-[13px] font-medium">{backlink.sourceTitle}</div>
                <div className="mt-1 text-[11px] text-slate-400">{backlink.type}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <section className="border-t hair py-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[19px] font-semibold">评论与讨论</h2>
          <span className="sect-label">{comments.length} comments</span>
        </div>
        <div className="grid gap-3 border-y hair py-4">
          <textarea
            className="inp px-3 py-2 text-[13px] focus:border-garden-600 focus:outline-none"
            onChange={(event) => setCommentBody(event.target.value)}
            rows={3}
            value={commentBody}
          />
          <button
            className="focus-ring justify-self-start rounded-md bg-garden-600 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-garden-700"
            onClick={() => onCreateComment(commentBody)}
            type="button"
          >
            发表评论
          </button>
        </div>
        <div className="divide-y hair">
          {comments.map((comment) => (
            <article className="py-4" key={comment.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-[13px] font-semibold">{comment.author.displayName}</div>
                <button
                  className="text-[11px] text-slate-400 hover:text-red-600"
                  onClick={() => onDeleteComment(comment.id)}
                  type="button"
                >
                  删除
                </button>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{comment.body}</p>
              <div className="mt-3 flex gap-2">
                <input
                  className="inp flex-1 px-3 py-2 text-[12px] focus:border-garden-600 focus:outline-none"
                  onChange={(event) => setReplyBody(event.target.value)}
                  value={replyBody}
                />
                <button
                  className="focus-ring rounded-md border hair px-3 py-2 text-[12px] transition hover:bg-slate-50"
                  onClick={() => onReplyToComment(comment.id, replyBody)}
                  type="button"
                >
                  回复
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
