import { useState } from "react";

import { SynapseLinkMark } from "@/components/ui/synapse-logo";

import { roadmapOptions, visibilityOptions } from "../model/editor-fixtures";
import type {
  StudioDraft,
  StudioVisibility,
} from "../model/studio-editor-model";
import { MetaField, MetaSelect, MetaToggle, Section } from "./studio-fields";

export function StudioMeta({
  currentDraft,
  onAdvancedChange,
  onLinkPanelOpen,
  onRelationshipOpen,
  onRemoveTag,
  onResourceOpen,
  onResourcePanelOpen,
  onRoadmapChange,
  onTagAdd,
  onVisibilityChange,
}: {
  currentDraft: StudioDraft;
  onAdvancedChange: (update: Partial<StudioDraft>) => void;
  onLinkPanelOpen: () => void;
  onRelationshipOpen: (target: string) => void;
  onRemoveTag: (tag: string) => void;
  onResourceOpen: (id: string) => void;
  onResourcePanelOpen: () => void;
  onRoadmapChange: (roadmap: StudioDraft["roadmap"]) => void;
  onTagAdd: (tag: string) => void;
  onVisibilityChange: (visibility: StudioVisibility) => void;
}) {
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  function submitTag() {
    onTagAdd(tagInput);
    setTagInput("");
    setTagInputOpen(false);
  }

  return (
    <aside className="min-h-0 overflow-auto border-l border-[var(--syn-hairline-dark)] bg-[var(--syn-working-surface)] px-6 py-7">
      <div className="space-y-8">
        <Section label="可见性">
          <div className="grid grid-cols-3 gap-2">
            {visibilityOptions.map(([name, icon]) => {
              const active = currentDraft.visibility === name;

              return (
                <button
                  className={
                    active
                      ? "flex flex-col items-center gap-1 rounded-[var(--syn-radius)] bg-transparent px-2 py-2.5 text-[11.5px] text-[var(--syn-working-ink)] transition [border:1px_solid_var(--syn-accent)] hover:bg-white/[0.03]"
                      : "flex flex-col items-center gap-1 rounded-[var(--syn-radius)] border border-transparent bg-transparent px-2 py-2.5 text-[11.5px] text-[var(--syn-working-secondary)] transition hover:bg-white/[0.03] hover:text-[var(--syn-working-ink)]"
                  }
                  key={name}
                  onClick={() => onVisibilityChange(name)}
                  type="button"
                >
                  <span className="text-[14px]">{icon}</span>
                  <span className="whitespace-nowrap">{name}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-[1.6] text-[var(--syn-working-muted)]">
            公开后将出现在 Explore · Trending,并由 worker 计算 embedding
            触发语义推荐。
          </p>
        </Section>

        <Section label="归属">
          <MetaSelect
            label="Stage"
            onChange={(stage) =>
              onRoadmapChange({ ...currentDraft.roadmap, stage })
            }
            options={roadmapOptions.stage}
            value={currentDraft.roadmap.stage}
          />
          <MetaSelect
            label="Week"
            onChange={(week) =>
              onRoadmapChange({ ...currentDraft.roadmap, week })
            }
            options={roadmapOptions.week}
            value={currentDraft.roadmap.week}
          />
          <MetaSelect
            label="Track"
            onChange={(track) =>
              onRoadmapChange({ ...currentDraft.roadmap, track })
            }
            options={roadmapOptions.track}
            value={currentDraft.roadmap.track}
          />
        </Section>

        <Section label={`标签 · ${currentDraft.tags.length}`}>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-[var(--syn-working-secondary)]">
            {currentDraft.tags.map((tag, index) => (
              <span className="group inline-flex items-center gap-1" key={tag}>
                <span>#{tag}</span>
                <button
                  aria-label={`删除 ${tag} 标签`}
                  className="bg-transparent p-0 text-[var(--syn-working-muted)] opacity-0 transition group-hover:opacity-100 hover:text-danger"
                  onClick={() => onRemoveTag(tag)}
                  type="button"
                >
                  ×
                </button>
                {index < currentDraft.tags.length - 1 ? (
                  <span className="text-[var(--syn-working-muted)]">·</span>
                ) : null}
              </span>
            ))}
            {tagInputOpen ? (
              <input
                autoFocus
                className="h-6 w-24 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-2 text-[11px] text-[var(--syn-working-ink)] outline-none"
                onBlur={submitTag}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitTag();
                  if (event.key === "Escape") {
                    setTagInput("");
                    setTagInputOpen(false);
                  }
                }}
                placeholder="# tag"
                value={tagInput}
              />
            ) : (
              <button
                className="h-6 bg-transparent px-0 text-[12px] text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
                onClick={() => setTagInputOpen(true)}
                type="button"
              >
                + 添加
              </button>
            )}
          </div>
        </Section>

        <Section label="关联">
          <div className="space-y-3">
            {currentDraft.relationships.map((item) => (
              // §5 RELATED 类型图标改为单色 mono 字符
              <div className="min-w-0" key={item.rel}>
                <div className="min-w-0">
                  <code className="font-mono text-[10.5px] text-[var(--syn-working-muted)]">
                    {item.rel.replace("_", " ")}
                  </code>
                  <button
                    className="mt-0.5 block max-w-full truncate bg-transparent p-0 text-left text-[13px] text-[var(--syn-working-ink)] hover:underline"
                    onClick={() => onRelationshipOpen(item.target)}
                    type="button"
                  >
                    {item.target}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="syn-link-mark-trigger mt-3 inline-flex items-center gap-1.5 bg-transparent px-0 py-1.5 text-[14px] text-[var(--syn-working-muted)] transition hover:text-[var(--syn-accent)]"
            onClick={onLinkPanelOpen}
            type="button"
          >
            {/* §5 Add 按钮改为 inline 文字按钮 */}
            <SynapseLinkMark size={15} />
            <span>建立 Link</span>
          </button>
        </Section>

        <Section label="资源">
          <div className="space-y-3">
            {currentDraft.resources.map((item) => (
              // §5 RESOURCES 文件类型图标改为灰色 mono 字符
              <div
                className="grid grid-cols-[22px_minmax(0,1fr)_14px] items-start gap-2"
                key={item.name}
              >
                <span className="font-mono text-[11px] text-[var(--syn-working-muted)]">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[12px] text-[var(--syn-working-ink)]">
                    {item.name}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[10.5px] text-[var(--syn-working-muted)]">
                    {item.source}
                  </div>
                </div>
                <button
                  aria-label={`打开 ${item.name}`}
                  className="bg-transparent p-0 text-[11px] text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
                  onClick={() => onResourceOpen(item.id)}
                  type="button"
                >
                  ↗
                </button>
              </div>
            ))}
          </div>
          <button
            className="mt-3 inline-flex items-center gap-1.5 bg-transparent px-0 py-1.5 text-[14px] text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
            onClick={onResourcePanelOpen}
            type="button"
          >
            {/* §5 Add 按钮改为 inline 文字按钮 */}
            <span>+</span>
            <span>附加资源</span>
          </button>
        </Section>

        {/* §3 高级设置默认折叠，减少右侧 panel 常驻高度 */}
        <details className="group">
          <summary className="syn-kicker flex cursor-pointer list-none items-center gap-1 bg-transparent py-1 text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]">
            <span>高级</span>
            <span className="transition group-open:rotate-180">⌄</span>
          </summary>
          <div className="mt-3">
            <MetaField mono label="Slug" value={currentDraft.slug} />
            <MetaSelect
              label="License"
              onChange={(license) => onAdvancedChange({ license })}
              options={["CC BY-SA 4.0", "CC BY 4.0", "All rights reserved"]}
              value={currentDraft.license}
            />
            <MetaToggle
              checked={currentDraft.allowComments}
              label="允许评论"
              onChange={(allowComments) => onAdvancedChange({ allowComments })}
            />
            <MetaToggle
              checked={currentDraft.allowDerivatives}
              label="允许派生"
              onChange={(allowDerivatives) =>
                onAdvancedChange({ allowDerivatives })
              }
            />
          </div>
        </details>
      </div>
    </aside>
  );
}
