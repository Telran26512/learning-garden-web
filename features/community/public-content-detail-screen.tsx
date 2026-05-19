"use client";

import Link from "next/link";
import type { Concept } from "@/lib/api";

export function PublicContentDetailScreen({ concept }: { concept: Concept }) {
  return (
    <article className="py-6">
      <Link
        className="text-[12px] font-medium text-garden-700 hover:text-garden-800"
        href="/community"
      >
        ← 返回社区
      </Link>
      <div className="mt-4 rounded-[22px] border hair bg-white/70 p-6">
        <div className="sect-label">Public Concept</div>
        <h1 className="mt-2 font-serif text-[32px] font-semibold tracking-[-0.04em]">
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
      </div>
      <div className="mt-5 grid gap-4">
        {concept.sections.map((section) => (
          <section className="rounded-[18px] border hair bg-white/60 p-5" key={section.id}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {section.kind}
            </div>
            <h2 className="mt-1 text-[17px] font-semibold">{section.title}</h2>
            {section.sourceTitle ? (
              <p className="mt-1 text-[12px] text-slate-400">
                {section.sourceTitle}
                {section.sourceMeta ? ` · ${section.sourceMeta}` : ""}
              </p>
            ) : null}
            {section.kind === "code" ? (
              <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-[12px] leading-relaxed text-slate-100">
                <code>{section.body}</code>
              </pre>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-600">
                {section.body}
              </p>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
