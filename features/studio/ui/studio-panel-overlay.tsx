import { useState } from "react";

import type {
  StudioDraft,
  StudioHistoryEntry,
  StudioRelationType,
  StudioResourceKind,
} from "../model/studio-editor-model";
import type { StudioPanel } from "./studio-editor-types";

export function StudioPanelOverlay({
  activePanel,
  currentDraft,
  onAddRelationship,
  onAddResource,
  onClose,
  onRestoreHistory,
  selectedResourceId,
}: {
  activePanel: StudioPanel;
  currentDraft: StudioDraft;
  onAddRelationship: (rel: StudioRelationType, target: string) => void;
  onAddResource: (
    kind: StudioResourceKind,
    name: string,
    source: string,
  ) => void;
  onClose: () => void;
  onRestoreHistory: (entry: StudioHistoryEntry) => void;
  selectedResourceId: string | null;
}) {
  if (!activePanel) return null;

  const titleByPanel: Record<Exclude<StudioPanel, null>, string> = {
    history: "版本历史",
    link: "建立 Link",
    resource: "附加资源",
    "resource-detail": "资源详情",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/10" onMouseDown={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-[360px] border-l border-[var(--syn-hairline-dark)] bg-[var(--syn-working-surface)] p-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-[var(--syn-working-ink)]">
            {titleByPanel[activePanel]}
          </h2>
          <button
            className="rounded-[var(--syn-radius)] px-2 py-1 text-[13px] text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
            onClick={onClose}
            type="button"
          >
            关闭
          </button>
        </div>

        {activePanel === "history" ? (
          <HistoryPanel
            entries={currentDraft.history}
            onRestore={onRestoreHistory}
          />
        ) : null}
        {activePanel === "link" ? (
          <LinkPanel onSubmit={onAddRelationship} />
        ) : null}
        {activePanel === "resource" ? (
          <ResourcePanel onSubmit={onAddResource} />
        ) : null}
        {activePanel === "resource-detail" ? (
          <ResourceDetailPanel
            resource={currentDraft.resources.find(
              (resource) => resource.id === selectedResourceId,
            )}
          />
        ) : null}
      </aside>
    </div>
  );
}

function HistoryPanel({
  entries,
  onRestore,
}: {
  entries: StudioHistoryEntry[];
  onRestore: (entry: StudioHistoryEntry) => void;
}) {
  if (entries.length === 0) {
    return <p className="text-[12px] text-text-muted">还没有保存版本。</p>;
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          className="rounded-md border border-border-subtle bg-white/[0.02] p-3"
          key={entry.id}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[12px] font-medium text-[var(--syn-working-ink)]">
                {entry.label}
              </div>
              <div className="mt-0.5 text-[11px] text-text-muted">
                {entry.title}
              </div>
            </div>
            <button
              className="rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] px-2 py-1 text-[11px] text-text-secondary transition hover:text-[var(--syn-accent)]"
              onClick={() => onRestore(entry)}
              type="button"
            >
              恢复
            </button>
          </div>
          <pre className="mt-3 max-h-24 overflow-hidden whitespace-pre-wrap font-mono text-[10.5px] leading-5 text-text-muted">
            {entry.markdown}
          </pre>
        </div>
      ))}
    </div>
  );
}

function LinkPanel({
  onSubmit,
}: {
  onSubmit: (rel: StudioRelationType, target: string) => void;
}) {
  const [rel, setRel] = useState<StudioRelationType>("derives_from");
  const [target, setTarget] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (target.trim()) onSubmit(rel, target.trim());
      }}
    >
      <label className="block text-[12px] text-text-muted">
        关系类型
        <select
          className="mt-2 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) => setRel(event.target.value as StudioRelationType)}
          value={rel}
        >
          <option className="bg-white" value="derives_from">
            derives_from
          </option>
          <option className="bg-white" value="implements">
            implements
          </option>
          <option className="bg-white" value="cites">
            cites
          </option>
        </select>
      </label>
      <label className="block text-[12px] text-text-muted">
        目标
        <input
          autoFocus
          className="mt-2 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) => setTarget(event.target.value)}
          placeholder="Attention §3.2.1"
          value={target}
        />
      </label>
      <button
        className="h-9 rounded-[var(--syn-radius)] border border-[var(--syn-accent)] px-3 text-[12px] font-medium text-[var(--syn-accent)]"
        type="submit"
      >
        建立 Link
      </button>
    </form>
  );
}

function ResourcePanel({
  onSubmit,
}: {
  onSubmit: (kind: StudioResourceKind, name: string, source: string) => void;
}) {
  const [kind, setKind] = useState<StudioResourceKind>("code");
  const [name, setName] = useState("");
  const [source, setSource] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (name.trim()) onSubmit(kind, name.trim(), source.trim() || "local");
      }}
    >
      <label className="block text-[12px] text-text-muted">
        类型
        <select
          className="mt-2 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) =>
            setKind(event.target.value as StudioResourceKind)
          }
          value={kind}
        >
          <option className="bg-white" value="code">
            code
          </option>
          <option className="bg-white" value="pdf">
            pdf
          </option>
          <option className="bg-white" value="notebook">
            notebook
          </option>
        </select>
      </label>
      <label className="block text-[12px] text-text-muted">
        名称
        <input
          autoFocus
          className="mt-2 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) => setName(event.target.value)}
          placeholder="attention.py"
          value={name}
        />
      </label>
      <label className="block text-[12px] text-text-muted">
        来源
        <input
          className="mt-2 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) => setSource(event.target.value)}
          placeholder="github · zhe-li/transformer"
          value={source}
        />
      </label>
      <button
        className="h-9 rounded-[var(--syn-radius)] border border-[var(--syn-accent)] px-3 text-[12px] font-medium text-[var(--syn-accent)]"
        type="submit"
      >
        附加资源
      </button>
    </form>
  );
}

function ResourceDetailPanel({
  resource,
}: {
  resource?: StudioDraft["resources"][number];
}) {
  if (!resource) {
    return <p className="text-[12px] text-text-muted">资源不存在。</p>;
  }

  return (
    <div className="rounded-md border border-border-subtle bg-white/[0.02] p-4">
      <div className="font-mono text-[12px] text-text-muted">
        {resource.icon} · {resource.kind}
      </div>
      <h3 className="mt-2 text-[15px] font-medium text-[var(--syn-working-ink)]">
        {resource.name}
      </h3>
      <p className="mt-2 font-mono text-[11px] leading-5 text-text-muted">
        {resource.source}
      </p>
      <p className="mt-4 text-[12px] leading-6 text-text-secondary">
        本地原型已打开资源详情。接后端后这里可以加载 PDF、代码片段或 notebook
        预览。
      </p>
    </div>
  );
}
