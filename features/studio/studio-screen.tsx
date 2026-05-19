"use client";

import { useState } from "react";
import type { Concept, UpdateConceptInput } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

type StudioScreenProps = {
  concept: Concept;
  onSave: (input: UpdateConceptInput) => void | Promise<void>;
  savedAt?: string;
};

export function StudioScreen({ concept, onSave, savedAt }: StudioScreenProps) {
  const [title, setTitle] = useState(concept.title);
  const [draft, setDraft] = useState(toEditableDraft(concept));

  const saveDraft = () => {
    void onSave({
      sections: [
        {
          body: draft,
          id: "section_editor_draft",
          kind: "note",
          title: "Studio draft",
        },
      ],
      title,
    });
  };

  return (
    <section className="py-6">
      <div className="flex items-start justify-between gap-5 border-b hair pb-4">
        <div>
          <div className="text-[13px]">
            <span className="text-slate-400">← 创作 / </span>
            <span className="text-[14px] font-semibold">新建训练内容</span>
          </div>
          <p className="mt-1 text-[12px] text-slate-500">
            把推导、代码和错因复盘组织成一条可训练内容。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="focus-ring rounded-md border hair px-3.5 py-1.5 text-[12px] transition hover:bg-slate-50"
            onClick={saveDraft}
            type="button"
          >
            保存草稿
          </button>
          <button
            className="focus-ring rounded-md bg-garden-600 px-4 py-1.5 text-[12px] font-medium text-white transition hover:bg-garden-700"
            type="button"
          >
            发布 ▾
          </button>
        </div>
      </div>

      <div className="border-b hair py-4">
        <div className="sect-label mb-2">内容模板</div>
        <div className="grid grid-cols-1 gap-x-7 gap-y-3 text-[12px] md:grid-cols-3">
          {[
            ["数学推导", "公式来源、关键变形、实现提醒。", true],
            ["可运行代码", "函数签名、测试样例、参考输出。", false],
            ["论文笔记", "论文片段、概念映射、引用来源。", false],
          ].map(([title, description, active]) => (
            <button
              className={cn(
                "focus-ring border-l-2 py-1 pl-3 text-left",
                active ? "border-garden-600" : "hair text-slate-500 hover:text-slate-700",
              )}
              key={String(title)}
              type="button"
            >
              <span className={cn("block font-semibold", active && "text-garden-700")}>
                {title}
              </span>
              <span className="text-slate-500">{description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-7 pt-5 lg:grid-cols-[250px_minmax(0,1fr)_230px]">
        <StudioMetaPanel concept={concept} onTitleChange={setTitle} title={title} />
        <StudioEditor draft={draft} onDraftChange={setDraft} savedAt={savedAt} />
        <StudioPublishPanel concept={concept} />
      </div>
    </section>
  );
}

function StudioMetaPanel({
  concept,
  onTitleChange,
  title,
}: {
  concept: Concept;
  onTitleChange: (value: string) => void;
  title: string;
}) {
  return (
    <aside className="space-y-4 lg:border-r lg:pr-8 hair">
      <div>
        <label className="sect-label mb-1.5 block">标题 *</label>
        <textarea
          className="inp w-full px-2.5 py-1.5 text-[13px] focus:border-garden-600 focus:outline-none"
          onChange={(event) => onTitleChange(event.target.value)}
          rows={2}
          value={title}
        />
      </div>
      <div>
        <label className="sect-label mb-1.5 block">标签</label>
        <div className="flex flex-wrap gap-1.5">
          {concept.tags.map((tag) => (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[12px]" key={tag}>
              {tag} ×
            </span>
          ))}
          <span className="rounded border border-dashed hair px-2 py-0.5 text-[12px] text-slate-400">
            + 添加
          </span>
        </div>
      </div>
      <div>
        <label className="sect-label mb-1.5 block">可见性</label>
        <div className="flex gap-1.5 text-[12px]">
          <button className="focus-ring inp flex-1 py-1.5 text-slate-600" type="button">
            🔒 私有
          </button>
          <button
            className="focus-ring flex-1 rounded-md border border-garden-600 bg-garden-50 py-1.5 font-medium text-garden-700"
            type="button"
          >
            {concept.visibility === "public" ? "🌐 公开" : "🔒 私有"}
          </button>
        </div>
      </div>
      <div>
        <label className="sect-label mb-1.5 block">关联</label>
        <div className="text-[12px] text-slate-600">
          <RelationRow label="前置概念" value="微积分基础 · 矩阵运算" />
          <RelationRow label="关联概念" value="多元线性回归" />
          <RelationRow label="关联论文" value="2 篇" />
          <div className="flex justify-between py-1.5">
            <span>关联实验</span>
            <span className="text-garden-600">+ 添加</span>
          </div>
        </div>
      </div>
      <details className="border-t hair pt-4 text-[12px]">
        <summary className="cursor-pointer text-slate-500 hover:text-slate-700">高级设置</summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="sect-label mb-1.5 block">Slug</label>
            <input
              className="inp w-full px-2.5 py-1.5 text-[13px] focus:border-garden-600 focus:outline-none"
              defaultValue={concept.slug}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              /raymond/concepts/linear-regression-ols
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectLike label="阶段" value="Stage 2 ▾" />
            <SelectLike label="周次" value="Week 3 ▾" />
          </div>
        </div>
      </details>
    </aside>
  );
}

function RelationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b hair py-1.5">
      <span>{label}</span>
      <span className="text-slate-400">{value}</span>
    </div>
  );
}

function SelectLike({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="sect-label mb-1.5 block">{label}</label>
      <div className="inp px-2.5 py-1.5 text-[12px] text-slate-600">{value}</div>
    </div>
  );
}

function StudioEditor({
  draft,
  onDraftChange,
  savedAt,
}: {
  draft: string;
  onDraftChange: (value: string) => void;
  savedAt?: string;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center gap-5 border-b hair text-[13px]">
        <button
          className="-mb-px border-b-2 border-garden-600 pb-2 font-medium text-garden-700"
          type="button"
        >
          编辑
        </button>
        <button className="pb-2 text-slate-500" type="button">
          预览
        </button>
        <div className="flex-1" />
        <span className="pb-2 text-[11px] text-slate-400">
          {savedAt ? `已保存 · ${savedAt}` : "来自 mock API · 尚未保存"}
        </span>
      </div>
      <div className="inp flex items-center gap-0 overflow-hidden rounded-b-none bg-slate-50 text-[12px] text-slate-500">
        <div className="flex items-center gap-2 border-r hair px-3 py-1.5">
          <span className="text-slate-400">文本</span>
          <b>H</b>
          <b>B</b>
          <i>I</i>
          <span>“”</span>
        </div>
        <div className="flex items-center gap-2 border-r hair px-3 py-1.5">
          <span className="text-slate-400">结构</span>
          <span>≡</span>
          <span>&lt;/&gt;</span>
          <span>{"{ }"}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="text-slate-400">插入</span>
          <span>∑ 公式</span>
          <span>🔗</span>
          <span>🖼</span>
        </div>
      </div>
      <textarea
        className="studio-editor inp w-full rounded-t-none px-3 py-2.5 font-mono text-[13px] leading-6 focus:border-garden-600 focus:outline-none"
        onChange={(event) => onDraftChange(event.target.value)}
        value={draft}
      />
      <p className="mt-1.5 text-[11px] text-slate-400">
        支持 Markdown 与 KaTeX · 长内容会在编辑区内滚动,不会挤乱页面
      </p>
    </div>
  );
}

function StudioPublishPanel({ concept }: { concept: Concept }) {
  const hasCode = concept.sections.some((section) => section.kind === "code");

  return (
    <aside className="text-[12px] lg:border-l lg:pl-8 hair">
      <div className="border-b hair pb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold">发布检查</h3>
          <span className="font-medium text-garden-700">{hasCode ? "6/6" : "5/6"}</span>
        </div>
        <div className="space-y-2.5">
          {["标题和标签已填写", "包含最小必要数学推导", "公式可用 KaTeX 渲染", "已关联前置概念", "可见性设置为公开"].map(
            (item) => (
              <div className="flex gap-2" key={item}>
                <span className="text-garden-600">✓</span>
                <span>{item}</span>
              </div>
            ),
          )}
          {!hasCode ? (
            <div className="flex gap-2 text-amber-700">
              <span>!</span>
              <span>还缺一个可运行代码块</span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-b hair py-4">
        <h3 className="mb-3 text-[14px] font-semibold">内容结构</h3>
        <div className="space-y-2 text-slate-600">
          {concept.sections.map((section) => (
            <StructureRow
              active={section.kind === "math"}
              key={section.id}
              label={section.title}
              value={section.kind}
              warning={section.kind === "note"}
            />
          ))}
        </div>
      </div>
      <div className="pt-4">
        <h3 className="mb-2 text-[14px] font-semibold">建议下一步</h3>
        <p className="leading-relaxed text-slate-500">
          在推导后补一个 <code className="rounded bg-slate-100 px-1">linear_regression(X, y)</code>{" "}
          代码块,并说明为什么要添加偏置列。
        </p>
        <button
          className="focus-ring mt-3 w-full rounded-md border hair py-1.5 font-medium text-garden-700 transition hover:bg-slate-50"
          type="button"
        >
          插入代码任务模板
        </button>
      </div>
    </aside>
  );
}

function toEditableDraft(concept: Concept) {
  return concept.sections
    .map((section) => `## ${section.title}\n\n${section.body}`)
    .join("\n\n---\n\n");
}

function StructureRow({
  label,
  value,
  active,
  warning,
}: {
  label: string;
  value: string;
  active?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span
        className={cn(
          active && "text-garden-600",
          warning && "text-amber-700",
          !active && !warning && "text-slate-400",
        )}
      >
        {value}
      </span>
    </div>
  );
}
