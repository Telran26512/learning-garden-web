import { useEffect, useMemo, useState } from "react";

import { searchStudioLinkTargets } from "../api/link-search";
import type {
  StudioDraft,
  StudioHistoryEntry,
  StudioLinkTarget,
  StudioRelationType,
  StudioResourceKind,
} from "../model/studio-editor-model";
import { buildStudioLinkTargets } from "../model/studio-editor-model";
import type { StudioPanel } from "./studio-editor-types";

export function StudioPanelOverlay({
  activePanel,
  currentDraft,
  drafts,
  onAddRelationship,
  onAddResource,
  onClose,
  onRestoreHistory,
  selectedResourceId,
}: {
  activePanel: StudioPanel;
  currentDraft: StudioDraft;
  drafts: StudioDraft[];
  onAddRelationship: (
    rel: StudioRelationType,
    target: string,
    options: {
      comment?: string;
      source?: string;
      targetKind?: StudioLinkTarget["kind"];
      targetPreview?: string;
    },
  ) => void;
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
          <LinkPanel
            currentDraft={currentDraft}
            drafts={drafts}
            onSubmit={onAddRelationship}
          />
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
  currentDraft,
  drafts,
  onSubmit,
}: {
  currentDraft: StudioDraft;
  drafts: StudioDraft[];
  onSubmit: (
    rel: StudioRelationType,
    target: string,
    options: {
      comment?: string;
      source?: string;
      targetKind?: StudioLinkTarget["kind"];
      targetPreview?: string;
    },
  ) => void;
}) {
  const [rel, setRel] = useState<StudioRelationType>("derives_from");
  const [sourceQuery, setSourceQuery] = useState("");
  const [targetQuery, setTargetQuery] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [comment, setComment] = useState("");
  const [remoteTargets, setRemoteTargets] = useState<StudioLinkTarget[]>([]);
  const [targetSearchState, setTargetSearchState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const targets = useMemo(
    () => buildStudioLinkTargets(currentDraft, drafts),
    [currentDraft, drafts],
  );
  const allTargets = useMemo(
    () => mergeLinkTargets(targets, remoteTargets),
    [remoteTargets, targets],
  );
  const sourceTargets = useMemo(
    () =>
      filterLinkTargets(
        buildStudioLinkTargets(currentDraft, [currentDraft]).filter(
          (target) => target.kind === "block",
        ),
        sourceQuery,
      ),
    [currentDraft, sourceQuery],
  );
  const targetTargets = useMemo(
    () => filterLinkTargets(allTargets, targetQuery),
    [allTargets, targetQuery],
  );
  const selectedSource =
    targets.find((target) => target.id === selectedSourceId) ??
    sourceTargets[0];
  const selectedTarget =
    allTargets.find((target) => target.id === selectedTargetId) ??
    targetTargets[0];
  const rawTarget = targetQuery.trim();

  useEffect(() => {
    const query = targetQuery.trim();
    if (query.length < 2) {
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      searchStudioLinkTargets(query)
        .then((results) => {
          if (!cancelled) {
            setRemoteTargets(results);
            setTargetSearchState("idle");
          }
        })
        .catch(() => {
          if (!cancelled) {
            setRemoteTargets([]);
            setTargetSearchState("error");
          }
        });
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [targetQuery]);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const targetValue = selectedTarget?.value ?? rawTarget;

        if (!targetValue) return;

        onSubmit(rel, targetValue, {
          ...(comment.trim() ? { comment: comment.trim() } : {}),
          ...(selectedSource ? { source: selectedSource.value } : {}),
          ...(selectedTarget
            ? {
                targetKind: selectedTarget.kind,
                targetPreview: selectedTarget.preview,
              }
            : {}),
        });
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
        起点 Block / Step
        <input
          className="mt-2 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) => setSourceQuery(event.target.value)}
          placeholder="搜索当前 Note 的 Math step / Code / Paper"
          value={sourceQuery}
        />
      </label>
      <LinkTargetList
        emptyLabel="当前 Note 没有可选起点。"
        onSelect={setSelectedSourceId}
        selectedId={selectedSource?.id ?? ""}
        targets={sourceTargets}
      />
      <label className="block text-[12px] text-text-muted">
        目标 Block / Note
        <input
          autoFocus
          className="mt-2 h-9 w-full rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) => {
            const next = event.target.value;
            setTargetQuery(next);
            if (next.trim().length < 2) {
              setRemoteTargets([]);
              setTargetSearchState("idle");
            } else {
              setTargetSearchState("loading");
            }
          }}
          placeholder="搜索 Block / Note, 或直接输入目标"
          value={targetQuery}
        />
      </label>
      <LinkTargetList
        emptyLabel={rawTarget ? `使用手动目标：${rawTarget}` : "没有匹配目标。"}
        onSelect={setSelectedTargetId}
        selectedId={selectedTarget?.id ?? ""}
        targets={targetTargets}
      />
      {targetSearchState === "loading" ? (
        <p className="text-[11px] text-text-muted">正在搜索后端候选...</p>
      ) : null}
      {targetSearchState === "error" ? (
        <p className="text-[11px] text-red-400">
          搜索接口暂不可用，可继续手动输入目标。
        </p>
      ) : null}
      <label className="block text-[12px] text-text-muted">
        注释
        <textarea
          className="mt-2 min-h-20 w-full resize-y rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-transparent px-2 py-2 text-[12px] leading-5 text-[var(--syn-working-ink)] outline-none"
          onChange={(event) => setComment(event.target.value)}
          placeholder="例如：B-01 的 scale step 对应 forward pass"
          value={comment}
        />
      </label>
      {selectedTarget ? (
        <div className="rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-white/[0.03] p-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--syn-working-muted)]">
            hover preview
          </div>
          <div className="mt-2 text-[12px] font-medium text-[var(--syn-working-ink)]">
            {selectedTarget.label}
          </div>
          <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-[11.5px] leading-5 text-text-secondary">
            {selectedTarget.preview}
          </p>
        </div>
      ) : null}
      <button
        className="h-9 rounded-[var(--syn-radius)] border border-[var(--syn-accent)] px-3 text-[12px] font-medium text-[var(--syn-accent)]"
        type="submit"
      >
        建立 Link
      </button>
    </form>
  );
}

function LinkTargetList({
  emptyLabel,
  onSelect,
  selectedId,
  targets,
}: {
  emptyLabel: string;
  onSelect: (id: string) => void;
  selectedId: string;
  targets: StudioLinkTarget[];
}) {
  if (targets.length === 0) {
    return (
      <p className="text-[11px] leading-5 text-text-muted">{emptyLabel}</p>
    );
  }

  return (
    <div className="max-h-36 space-y-2 overflow-auto pr-1">
      {targets.slice(0, 8).map((target) => {
        const active = target.id === selectedId;

        return (
          <button
            className={[
              "block w-full rounded-[var(--syn-radius)] border p-2 text-left transition",
              active
                ? "border-[var(--syn-accent)] bg-[var(--syn-accent-soft)]"
                : "border-[var(--syn-hairline-dark)] bg-white/[0.02] hover:border-[var(--syn-hairline-light)]",
            ].join(" ")}
            key={target.id}
            onClick={() => onSelect(target.id)}
            type="button"
          >
            <span className="block truncate text-[12px] text-[var(--syn-working-ink)]">
              {target.label}
            </span>
            <span className="mt-1 block truncate font-mono text-[10.5px] text-[var(--syn-working-muted)]">
              {target.kind} · {target.value}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function filterLinkTargets(targets: StudioLinkTarget[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return targets;
  }

  return targets.filter((target) =>
    [target.label, target.value, target.preview]
      .join("\n")
      .toLowerCase()
      .includes(normalized),
  );
}

function mergeLinkTargets(
  localTargets: StudioLinkTarget[],
  remoteTargets: StudioLinkTarget[],
) {
  const seen = new Set<string>();
  const out: StudioLinkTarget[] = [];
  for (const target of [...localTargets, ...remoteTargets]) {
    const key = `${target.kind}:${target.value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(target);
  }
  return out;
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
