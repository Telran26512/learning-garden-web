import { useState } from "react";

import type { StudioDraft } from "../model/studio-editor-model";
import type { EditorMode, SaveState } from "./studio-editor-types";

export function StudioToolbar({
  currentDraft,
  editorMode,
  onDeleteDraft,
  onHistoryOpen,
  onModeChange,
  onPublish,
  onSaveDraft,
  onStatusToggle,
  saveState,
}: {
  currentDraft: StudioDraft;
  editorMode: EditorMode;
  onDeleteDraft: () => void;
  onHistoryOpen: () => void;
  onModeChange: (mode: EditorMode) => void;
  onPublish: () => void | Promise<void>;
  onSaveDraft: () => void;
  onStatusToggle: () => void;
  saveState: SaveState;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const statusLabel =
    currentDraft.status === "published" ? "Published" : "Draft";
  const statusDot =
    currentDraft.status === "published" ? "bg-[#3DDC97]" : "bg-[#D97706]";
  const saveLabel =
    saveState === "saving"
      ? "正在保存"
      : saveState === "failed"
        ? "自动保存失败"
        : `已自动保存 ${currentDraft.updatedAtLabel}`;
  const saveLabelClass =
    saveState === "failed" ? "text-danger" : "text-[var(--syn-working-muted)]";

  return (
    <div className="flex h-[52px] shrink-0 items-center border-b border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] px-6">
      {/* §12 删除 breadcrumb 后补当前文档标识，填补左侧空白但不伪装成导航 */}
      <div className="flex min-w-0 flex-1 items-center gap-2 pr-6">
        <span className="truncate text-[13px] font-medium text-[var(--syn-working-ink)]">
          {currentDraft.title}
        </span>
        <span className="h-3 w-px shrink-0 bg-[var(--syn-hairline-dark)]" />
        <span className="shrink-0 font-mono text-[12px] text-[var(--syn-working-muted)]">
          {currentDraft.slug}.md
        </span>
      </div>
      <div className="mr-8 flex shrink-0 items-center whitespace-nowrap">
        {/* §8 Draft 状态点降到 7px，文字和时间戳分层 */}
        <button
          className="flex items-center gap-2 bg-transparent p-0 transition hover:text-[var(--syn-working-ink)]"
          onClick={onStatusToggle}
          type="button"
        >
          <span className={`size-[7px] rounded-full ${statusDot}`} />
          <span className="text-[12px] text-[var(--syn-working-secondary)]">
            {statusLabel}
          </span>
          <span className={`text-[10px] ${saveLabelClass}`}>· {saveLabel}</span>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <button
            className={[
              "h-8 border-b px-0 text-[12px] transition",
              editorMode === "preview"
                ? "border-[var(--syn-accent)] text-[var(--syn-working-ink)]"
                : "border-transparent text-[var(--syn-working-secondary)] hover:text-[var(--syn-working-ink)]",
            ].join(" ")}
            onClick={() => onModeChange("preview")}
            type="button"
          >
            预览
          </button>
          <button
            className="h-8 border-b border-transparent px-0 text-[12px] text-[var(--syn-working-secondary)] transition hover:text-[var(--syn-working-ink)]"
            onClick={onHistoryOpen}
            type="button"
          >
            历史
          </button>
          <div className="relative">
            <button
              aria-label="更多操作：删除、保存草稿"
              className="h-8 border-b border-transparent px-0 text-[18px] leading-none text-[var(--syn-working-secondary)] transition hover:text-[var(--syn-working-ink)]"
              onClick={() => setMoreOpen((open) => !open)}
              type="button"
            >
              ⋯
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-9 z-30 w-36 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-[var(--syn-working-surface)] p-1 text-[12px] text-[var(--syn-working-secondary)]">
                <button
                  className="block w-full rounded-[3px] px-2 py-1.5 text-left transition hover:text-[var(--syn-working-ink)]"
                  onClick={() => {
                    onSaveDraft();
                    setMoreOpen(false);
                  }}
                  type="button"
                >
                  保存草稿
                </button>
                <button
                  className="block w-full rounded-[3px] px-2 py-1.5 text-left transition hover:text-[var(--syn-working-ink)]"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `https://synapse.app/u/zhe-li/c/${currentDraft.slug}`,
                    );
                    setMoreOpen(false);
                  }}
                  type="button"
                >
                  复制链接
                </button>
                <button
                  className="block w-full rounded px-2 py-1.5 text-left text-danger transition hover:bg-danger/10"
                  onClick={() => {
                    onDeleteDraft();
                    setMoreOpen(false);
                  }}
                  type="button"
                >
                  删除草稿
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <span className="h-4 w-px bg-[var(--syn-hairline-dark)]" />

        <button
          className="h-9 rounded-[var(--syn-radius)] border border-[var(--syn-accent)] bg-transparent px-5 text-[13px] font-medium text-[var(--syn-accent)] transition hover:bg-[var(--syn-accent-soft)] active:translate-y-px"
          onClick={onPublish}
          type="button"
        >
          {currentDraft.status === "published"
            ? "已发布 · Public"
            : "发布 · Public"}
        </button>
      </div>
    </div>
  );
}
