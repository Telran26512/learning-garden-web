"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SynapseLinkMark } from "@/components/synapse/synapse-logo";

import {
  addUniqueTag,
  createRelationship,
  createResource,
  createStudioDraft,
  createStudioHistoryEntry,
  parseStudioMarkdown,
  removeTag,
  slugifyTitle,
  syncMarkdownTitle,
  type StudioContentType,
  type StudioDraft,
  type StudioHistoryEntry,
  type StudioInlineSegment,
  type StudioMarkdownBlock,
  type StudioRelationType,
  type StudioResourceKind,
  type StudioVisibility,
} from "@/lib/studio/studio-editor-model";

const contentTypes = [
  ["Concept", "思想 / 推导 / 直觉", true],
  ["Paper Note", "论文阅读笔记", false],
  ["Experiment", "实验日志 / 复现", false],
  ["Journal", "日记 / 周记", false],
] as const;

const visibilityOptions = [
  ["Private", "·"],
  ["Unlisted", "↗"],
  ["Public", "○"],
] as const;

const roadmapOptions = {
  stage: [
    "Stage 1 · Foundations",
    "Stage 2 · Deep Learning",
    "Stage 3 · Systems",
  ],
  track: ["Transformer 精读", "NLP 工程", "Representation Learning"],
  week: ["W2 · Attention 基础", "W3 · Transformer 精读", "W4 · Encoder 实现"],
} as const;

const markdownSource = `# Multi-Head Attention

> 把单头注意力拆成 \`h\` 个并行的子空间,再 concat。

## §1 直觉

单个 attention 头只能学到 ::concept[一种相似度结构],
多头让模型同时学习 ::concept[位置 / 句法 / 语义] 等不同的对齐方式。

## §2 推导 (3 步)

::math
\\\\text{head}_i = \\\\text{Attention}(QW_i^Q, KW_i^K, VW_i^V) \\\\\\\\
\\\\text{MultiHead}(Q,K,V) = \\\\text{Concat}(\\\\text{head}_1,\\\\dots,\\\\text{head}_h) W^O
::

每步用 \\\\\\\\ 切分,会成为独立锚点,可被外部 Note Link 指向。

## §3 代码

::code{lang=python ref=attention.py#L34-L58}

::card{front="Multi-Head 拆分维度是?" back="d_model = h × d_k"}

::paper{ref=1706.03762 anchor=§3.2.2}`;

const initialDrafts: StudioDraft[] = [
  {
    allowComments: true,
    allowDerivatives: true,
    contentType: "Concept",
    history: [
      {
        id: "version-1",
        label: "12 分钟前",
        markdown: "# Multi-Head Attention\n\n## 初稿\n\n单头到多头的推导。",
        summary: "初版结构草稿。",
        title: "Multi-Head Attention",
      },
      {
        id: "version-2",
        label: "4 分钟前",
        markdown: markdownSource,
        summary:
          "把 Q,K,V 各自线性投影 h 次,得到 h 组并行的 attention,再 concat 投影。",
        title: "Multi-Head Attention",
      },
    ],
    id: "draft-1",
    license: "CC BY-SA 4.0",
    markdown: markdownSource,
    relationships: [
      {
        icon: "⟶",
        id: "rel-1",
        rel: "derives_from",
        target: "Attention §3.2.1",
      },
      {
        icon: "≡",
        id: "rel-2",
        rel: "implements",
        target: "attention.py L34-L58",
      },
      { icon: "※", id: "rel-3", rel: "cites", target: "Vaswani 2017" },
    ],
    resources: [
      {
        icon: ">_",
        id: "res-1",
        kind: "code",
        name: "attention.py",
        source: "github · zhe-li/transformer",
      },
      {
        icon: "§",
        id: "res-2",
        kind: "pdf",
        name: "Vaswani 2017 · PDF",
        source: "arxiv.org · 1706.03762",
      },
      {
        icon: "{}",
        id: "res-3",
        kind: "notebook",
        name: "multi-head.ipynb",
        source: "colab",
      },
    ],
    roadmap: {
      stage: "Stage 2 · Deep Learning",
      track: "Transformer 精读",
      week: "W3 · Transformer 精读",
    },
    slug: "multi-head-attention",
    status: "draft",
    summary:
      "把 Q,K,V 各自线性投影 h 次,得到 h 组并行的 attention,再 concat 投影。本节给出从单头到多头的逐步推导,并对应到 attention.py L34-L58 的实现。",
    tags: ["transformer", "attention", "multi-head", "nlp", "论文精读"],
    title: "Multi-Head Attention",
    updatedAtLabel: "4s ago",
    visibility: "Public",
  },
  {
    allowComments: false,
    allowDerivatives: true,
    contentType: "Concept",
    history: [],
    id: "draft-2",
    license: "CC BY-SA 4.0",
    markdown:
      "# Softmax 数值稳定性\n\n## 直觉\n\n先减去 max logit,再做 exp,避免溢出。",
    relationships: [],
    resources: [],
    roadmap: {
      stage: "Stage 2 · Deep Learning",
      track: "Transformer 精读",
      week: "W3 · Transformer 精读",
    },
    slug: "softmax",
    status: "draft",
    summary: "记录 softmax 的数值稳定写法和 log-sum-exp 关系。",
    tags: ["softmax", "numerics"],
    title: "Softmax 数值稳定性",
    updatedAtLabel: "昨天",
    visibility: "Private",
  },
  {
    allowComments: true,
    allowDerivatives: false,
    contentType: "Paper Note",
    history: [],
    id: "draft-3",
    license: "CC BY-SA 4.0",
    markdown: "# RoFormer 阅读\n\n::paper{ref=2104.09864 anchor=RoPE}",
    relationships: [],
    resources: [
      {
        icon: "§",
        id: "res-1",
        kind: "pdf",
        name: "RoFormer · PDF",
        source: "arxiv.org · 2104.09864",
      },
    ],
    roadmap: {
      stage: "Stage 2 · Deep Learning",
      track: "Transformer 精读",
      week: "W4 · Encoder 实现",
    },
    slug: "roformer",
    status: "draft",
    summary: "RoPE 位置编码阅读笔记。",
    tags: ["rope", "paper"],
    title: "RoFormer 阅读",
    updatedAtLabel: "3 天前",
    visibility: "Unlisted",
  },
  {
    allowComments: true,
    allowDerivatives: true,
    contentType: "Journal",
    history: [],
    id: "draft-4",
    license: "CC BY-SA 4.0",
    markdown: "# Adam 推导稿\n\n## 目标\n\n把一阶矩和二阶矩校正写清楚。",
    relationships: [],
    resources: [],
    roadmap: {
      stage: "Stage 1 · Foundations",
      track: "Representation Learning",
      week: "W2 · Attention 基础",
    },
    slug: "adam",
    status: "draft",
    summary: "Adam bias correction 推导草稿。",
    tags: ["optimizer"],
    title: "Adam 推导稿",
    updatedAtLabel: "上周",
    visibility: "Private",
  },
];

type EditorMode = "edit" | "preview";
type SaveState = "saved" | "saving";
type StudioPanel = "history" | "link" | "resource" | "resource-detail" | null;

export function StudioEditor() {
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
  const [draftItems, setDraftItems] = useState<StudioDraft[]>(initialDrafts);
  const [currentDraftId, setCurrentDraftId] = useState(initialDrafts[0].id);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [activePanel, setActivePanel] = useState<StudioPanel>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    null,
  );
  const [notice, setNotice] = useState("");
  const autoSaveKeyRef = useRef("");
  const currentDraft =
    draftItems.find((draft) => draft.id === currentDraftId) ?? draftItems[0];
  const autoSaveKey = [
    currentDraft.id,
    currentDraft.contentType,
    currentDraft.allowComments,
    currentDraft.allowDerivatives,
    currentDraft.license,
    currentDraft.markdown,
    JSON.stringify(currentDraft.relationships),
    JSON.stringify(currentDraft.resources),
    JSON.stringify(currentDraft.roadmap),
    currentDraft.slug,
    currentDraft.status,
    currentDraft.summary,
    currentDraft.tags.join(","),
    currentDraft.title,
    currentDraft.visibility,
  ].join("\u0000");

  useEffect(() => {
    if (!autoSaveKeyRef.current) {
      autoSaveKeyRef.current = autoSaveKey;
      return;
    }

    if (autoSaveKeyRef.current === autoSaveKey) {
      return;
    }

    autoSaveKeyRef.current = autoSaveKey;
    setSaveState("saving");

    const timeout = window.setTimeout(() => {
      setDraftItems((items) =>
        items.map((draft) =>
          draft.id === currentDraftId
            ? {
                ...draft,
                history: [
                  createStudioHistoryEntry(draft.history.length, draft),
                  ...draft.history,
                ].slice(0, 8),
                updatedAtLabel: "刚刚",
              }
            : draft,
        ),
      );
      setSaveState("saved");
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [autoSaveKey, currentDraftId]);

  function updateCurrentDraft(update: Partial<StudioDraft>) {
    setDraftItems((items) =>
      items.map((draft) =>
        draft.id === currentDraftId ? { ...draft, ...update } : draft,
      ),
    );
  }

  function handleCreateDraft() {
    const nextDraft = createStudioDraft(
      draftItems.length,
      `Untitled Note ${draftItems.length + 1}`,
    );

    setDraftItems((items) => [nextDraft, ...items]);
    setCurrentDraftId(nextDraft.id);
    setEditorMode("edit");
  }

  function handlePublish() {
    updateCurrentDraft({
      status: "published",
      updatedAtLabel: "刚刚",
      visibility: "Public",
    });
    setSaveState("saved");
    setNotice("已发布为 Public");
  }

  function handleManualSave() {
    setDraftItems((items) =>
      items.map((draft) =>
        draft.id === currentDraftId
          ? {
              ...draft,
              history: [
                createStudioHistoryEntry(draft.history.length, draft),
                ...draft.history,
              ].slice(0, 8),
              updatedAtLabel: "刚刚",
            }
          : draft,
      ),
    );
    setSaveState("saved");
    setNotice("草稿已保存");
  }

  function handleDeleteDraft() {
    if (draftItems.length <= 1) {
      setNotice("至少保留一个草稿");
      return;
    }

    const remainingDrafts = draftItems.filter(
      (draft) => draft.id !== currentDraftId,
    );

    setDraftItems(remainingDrafts);
    setCurrentDraftId(remainingDrafts[0].id);
    setActivePanel(null);
    setNotice("草稿已删除");
  }

  function handleRestoreHistory(entry: StudioHistoryEntry) {
    updateCurrentDraft({
      markdown: entry.markdown,
      slug: slugifyTitle(entry.title),
      status: "draft",
      summary: entry.summary,
      title: entry.title,
      updatedAtLabel: "刚刚",
    });
    setActivePanel(null);
    setEditorMode("edit");
    setNotice(`已恢复 ${entry.label} 的版本`);
  }

  function handleResourceOpen(resourceId: string) {
    setSelectedResourceId(resourceId);
    setActivePanel("resource-detail");
  }

  return (
    <section className="syn-working-mode flex min-h-[calc(100dvh-3.5rem)] min-w-[1200px] flex-col text-text-primary [font-family:var(--font-sans)]">
      <StudioToolbar
        currentDraft={currentDraft}
        editorMode={editorMode}
        onDeleteDraft={handleDeleteDraft}
        onHistoryOpen={() => setActivePanel("history")}
        onModeChange={setEditorMode}
        onPublish={handlePublish}
        onSaveDraft={handleManualSave}
        onStatusToggle={() =>
          updateCurrentDraft({
            status: currentDraft.status === "draft" ? "published" : "draft",
          })
        }
        saveState={saveState}
      />

      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)_320px]">
        <StudioSidebar
          currentDraft={currentDraft}
          drafts={draftItems}
          onCreateDraft={handleCreateDraft}
          onDraftSelect={setCurrentDraftId}
          onTypeSelect={(contentType) => updateCurrentDraft({ contentType })}
        />
        <EditorCanvas
          currentDraft={currentDraft}
          editorMode={editorMode}
          onDraftChange={updateCurrentDraft}
          onModeChange={setEditorMode}
        />
        <StudioMeta
          currentDraft={currentDraft}
          onAdvancedChange={updateCurrentDraft}
          onLinkPanelOpen={() => setActivePanel("link")}
          onRelationshipOpen={(target) => setNotice(`已定位到 ${target}`)}
          onRemoveTag={(tag) =>
            updateCurrentDraft({ tags: removeTag(currentDraft.tags, tag) })
          }
          onResourceOpen={handleResourceOpen}
          onResourcePanelOpen={() => setActivePanel("resource")}
          onRoadmapChange={(roadmap) => updateCurrentDraft({ roadmap })}
          onTagAdd={(tag) =>
            updateCurrentDraft({
              tags: addUniqueTag(currentDraft.tags, tag),
            })
          }
          onVisibilityChange={(visibility) =>
            updateCurrentDraft({ visibility })
          }
        />
      </div>

      {notice ? (
        <button
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-light)] bg-white px-4 py-2 text-[12px] text-[var(--syn-reading-ink)]"
          onClick={() => setNotice("")}
          type="button"
        >
          {notice}
        </button>
      ) : null}

      <StudioPanelOverlay
        activePanel={activePanel}
        currentDraft={currentDraft}
        onAddRelationship={(rel, target) => {
          updateCurrentDraft({
            relationships: [
              ...currentDraft.relationships,
              createRelationship(
                currentDraft.relationships.length,
                rel,
                target,
              ),
            ],
          });
          setActivePanel(null);
          setNotice("Link 已建立");
        }}
        onAddResource={(kind, name, source) => {
          updateCurrentDraft({
            resources: [
              ...currentDraft.resources,
              createResource(currentDraft.resources.length, kind, name, source),
            ],
          });
          setActivePanel(null);
          setNotice("资源已附加");
        }}
        onClose={() => setActivePanel(null)}
        onRestoreHistory={handleRestoreHistory}
        selectedResourceId={selectedResourceId}
      />
    </section>
  );
}

function StudioToolbar({
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
  onPublish: () => void;
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
      : `已自动保存 ${currentDraft.updatedAtLabel}`;

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
          <span className="text-[10px] text-[var(--syn-working-muted)]">
            · {saveLabel}
          </span>
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

function StudioSidebar({
  currentDraft,
  drafts,
  onCreateDraft,
  onDraftSelect,
  onTypeSelect,
}: {
  currentDraft: StudioDraft;
  drafts: StudioDraft[];
  onCreateDraft: () => void;
  onDraftSelect: (id: string) => void;
  onTypeSelect: (contentType: StudioContentType) => void;
}) {
  return (
    <aside className="min-h-0 overflow-auto border-r border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] px-3 py-5">
      {/* §4 label 只保留中文，无大写英文/letter-spacing */}
      <SidebarLabel>类型</SidebarLabel>
      <div className="space-y-1">
        {contentTypes.map(([name, description]) => {
          const active = currentDraft.contentType === name;

          return (
            <button
              className="relative block w-full rounded-[var(--syn-radius)] bg-transparent px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
              key={name}
              onClick={() => onTypeSelect(name)}
              title={description}
              type="button"
            >
              {active ? (
                <span className="absolute left-0 top-2.5 h-7 w-0.5 rounded-full bg-white" />
              ) : null}
              <span
                className={
                  active
                    ? "block text-[12.5px] font-medium text-[var(--syn-working-ink)]"
                    : "block text-[12.5px] font-medium text-[var(--syn-working-secondary)]"
                }
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <SidebarLabel>草稿 · {drafts.length}</SidebarLabel>
        <ul className="space-y-1">
          {drafts.map((draft) => {
            const active = currentDraft.id === draft.id;

            return (
              <li key={draft.id}>
                <button
                  className="relative block w-full rounded-[var(--syn-radius)] bg-transparent px-3 py-2 text-left transition hover:bg-white/[0.03]"
                  onClick={() => onDraftSelect(draft.id)}
                  type="button"
                >
                  {/* §1.j 当前草稿选中态改为竖线 + 白字，不再边框包围 */}
                  {active ? (
                    <span className="absolute left-0 top-2 h-7 w-0.5 rounded-full bg-white" />
                  ) : null}
                  <span
                    className={
                      active
                        ? "block text-[12px] font-medium text-[var(--syn-working-ink)]"
                        : "block text-[12px] text-[var(--syn-working-secondary)]"
                    }
                  >
                    {draft.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[var(--syn-working-muted)]">
                    {draft.updatedAtLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        className="mt-5 inline-flex items-center gap-1.5 bg-transparent px-0 py-1.5 text-[14px] text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
        onClick={onCreateDraft}
        type="button"
      >
        {/* §5 Add 按钮改为克制的 inline 文字按钮，无边框无背景 */}
        <span>+</span>
        新建草稿
      </button>
    </aside>
  );
}

function EditorCanvas({
  currentDraft,
  editorMode,
  onDraftChange,
  onModeChange,
}: {
  currentDraft: StudioDraft;
  editorMode: EditorMode;
  onDraftChange: (update: Partial<StudioDraft>) => void;
  onModeChange: (mode: EditorMode) => void;
}) {
  return (
    <main className="min-h-0 overflow-auto bg-[var(--syn-working-surface)] px-10 py-7">
      <div className="mx-auto max-w-[920px]">
        {/* §2 编辑器标题去衬线，使用无衬线中等字重 */}
        <input
          className="w-full bg-transparent p-0 text-[34px] font-medium leading-tight text-[var(--syn-working-ink)] outline-none [font-family:var(--syn-font-display)]"
          onChange={(event) =>
            onDraftChange({
              markdown: syncMarkdownTitle(
                currentDraft.markdown,
                event.target.value,
              ),
              slug: slugifyTitle(event.target.value),
              title: event.target.value,
            })
          }
          value={currentDraft.title}
        />

        <EditableSlug
          onSlugChange={(slug) => onDraftChange({ slug })}
          slug={currentDraft.slug}
        />

        <textarea
          className="mt-4 h-[50px] w-full resize-none bg-transparent p-0 text-[14.5px] leading-[1.75] text-[var(--syn-working-secondary)] outline-none"
          onChange={(event) => onDraftChange({ summary: event.target.value })}
          value={currentDraft.summary}
        />

        {/* §11 GitHub 风格文件编辑器：Edit / Preview tabs，点击 Preview 才预览 */}
        <GithubMarkdownEditor
          markdown={currentDraft.markdown}
          mode={editorMode}
          onMarkdownChange={(markdown) => onDraftChange({ markdown })}
          onModeChange={onModeChange}
        />
      </div>
    </main>
  );
}

function GithubMarkdownEditor({
  markdown,
  mode,
  onMarkdownChange,
  onModeChange,
}: {
  markdown: string;
  mode: EditorMode;
  onMarkdownChange: (value: string) => void;
  onModeChange: (mode: EditorMode) => void;
}) {
  const lines = markdown.split("\n");
  const [softWrap, setSoftWrap] = useState(true);
  const [tabSize, setTabSize] = useState<2 | 4>(2);

  return (
    <section className="mt-6 overflow-hidden rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)]">
      <div className="flex h-[54px] items-center justify-between border-b border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] px-5">
        <div className="inline-flex gap-5">
          <button
            className={[
              "h-8 border-b px-0 text-[13px] font-medium transition",
              mode === "edit"
                ? "border-[var(--syn-accent)] text-[var(--syn-working-ink)]"
                : "border-transparent text-[var(--syn-working-secondary)] hover:text-[var(--syn-working-ink)]",
            ].join(" ")}
            onClick={() => onModeChange("edit")}
            type="button"
          >
            Edit
          </button>
          <button
            className={[
              "h-8 border-b px-0 text-[13px] font-medium transition",
              mode === "preview"
                ? "border-[var(--syn-accent)] text-[var(--syn-working-ink)]"
                : "border-transparent text-[var(--syn-working-secondary)] hover:text-[var(--syn-working-ink)]",
            ].join(" ")}
            onClick={() => onModeChange("preview")}
            type="button"
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] text-[var(--syn-working-muted)]">
            multi-head.md
          </span>
          <button
            className="h-8 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-3 text-[12px] text-[var(--syn-working-secondary)] transition hover:text-[var(--syn-working-ink)]"
            onClick={() => setTabSize(2)}
            type="button"
          >
            Spaces
          </button>
          <button
            className="h-8 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-3 font-mono text-[12px] text-[var(--syn-working-secondary)] transition hover:text-[var(--syn-working-ink)]"
            onClick={() => setTabSize(tabSize === 2 ? 4 : 2)}
            type="button"
          >
            {tabSize}
          </button>
          <button
            className="h-8 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-3 text-[12px] text-[var(--syn-working-secondary)] transition hover:text-[var(--syn-working-ink)]"
            onClick={() => setSoftWrap((enabled) => !enabled)}
            type="button"
          >
            {softWrap ? "Soft wrap" : "No wrap"}
          </button>
        </div>
      </div>

      {mode === "edit" ? (
        <div className="grid min-h-[640px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden">
          <div
            aria-hidden="true"
            className="select-none border-r border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] py-4 pr-4 text-right font-mono text-[13px] leading-7 text-[#BBBBBB]"
          >
            {lines.map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
          <textarea
            aria-label="multi-head.md Markdown editor"
            className="min-h-[640px] resize-none bg-transparent px-5 py-4 font-mono text-[13px] leading-7 text-[var(--syn-working-ink)] outline-none"
            onChange={(event) => onMarkdownChange(event.target.value)}
            spellCheck={false}
            style={{ tabSize }}
            value={markdown}
            wrap={softWrap ? "soft" : "off"}
          />
        </div>
      ) : (
        <GithubPreview markdown={markdown} />
      )}
    </section>
  );
}

function GithubPreview({ markdown }: { markdown: string }) {
  const blocks = useMemo(() => parseStudioMarkdown(markdown), [markdown]);

  return (
    <div className="min-h-[640px] overflow-auto px-7 py-7 text-[14px] leading-[1.8] text-[var(--syn-working-ink)]">
      <div className="flex items-center justify-end font-mono text-[11px] text-[var(--syn-working-muted)]">
        {/* §1.d KaTeX rendered 徽章改为绿色成功态 */}
        <span className="flex items-center gap-1.5">
          <span className="text-[#3DDC97]">✓</span>
          KaTeX
        </span>
      </div>
      <article className="mt-3 max-w-none">
        {blocks.map((block, index) => (
          <PreviewBlock block={block} key={index} />
        ))}
      </article>
    </div>
  );
}

function PreviewBlock({ block }: { block: StudioMarkdownBlock }) {
  if (block.type === "heading") {
    if (block.level === 1) {
      return (
        <h1 className="m-0 border-b border-[var(--syn-hairline-dark)] pb-3 text-[30px] font-medium leading-[1.2] text-[var(--syn-working-ink)] [font-family:var(--syn-font-display)]">
          {block.text}
        </h1>
      );
    }

    return (
      <h2 className="mt-6 text-[16px] font-semibold text-[var(--syn-working-ink)]">
        {block.text}
      </h2>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote className="my-5 border-l border-[var(--syn-accent)] pl-4 text-[var(--syn-working-secondary)]">
        <InlineSegments segments={block.segments} />
      </blockquote>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="mt-2 text-[var(--syn-working-secondary)]">
        <InlineSegments segments={block.segments} />
      </p>
    );
  }

  if (block.type === "math") {
    return (
      // §1.l Math block 保留绿色语义左边框
      <div className="relative mt-3 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-5 py-4">
        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-[var(--syn-radius)] bg-[#3DDC97]" />
        <pre className="m-0 whitespace-pre-wrap text-center font-sans text-[15px] leading-[1.95] text-[var(--syn-working-ink)]">
          {block.body}
        </pre>
      </div>
    );
  }

  if (block.type === "code") {
    return (
      // §2 Code preview 补齐黄色语义左边框，与 Math/Paper 三色系统一致
      <div className="relative mt-3 overflow-hidden rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent">
        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-[var(--syn-radius)] bg-[var(--color-code)]" />
        <div className="border-b border-[var(--syn-hairline-dark)] px-3 py-1.5 font-mono text-[10.5px] text-[#D4A574]">
          {block.ref.replace("#", " · ")}
        </div>
        <pre className="m-0 overflow-auto p-3 font-mono text-[11.5px] leading-[1.65] text-[var(--syn-working-ink)]">
          {`class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.h, self.dk = n_heads, d_model // n_heads`}
        </pre>
      </div>
    );
  }

  if (block.type === "card") {
    return (
      <div className="mt-4 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-4 py-3">
        <div className="font-mono text-[10.5px] text-[var(--syn-working-muted)]">
          card
        </div>
        <p className="mt-1 text-[13px] text-[var(--syn-working-ink)]">
          {block.front}
        </p>
        <p className="mt-1 text-[12px] text-[var(--syn-working-secondary)]">
          {block.back}
        </p>
      </div>
    );
  }

  return (
    // §1.l Paper block 保留蓝色语义左边框
    <div className="relative mt-4 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-4 py-3">
      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-[var(--syn-radius)] bg-[#6FA8DC]" />
      <div className="font-mono text-[10.5px] text-[var(--syn-working-muted)]">
        paper · {block.ref}
      </div>
      <p className="mt-1 text-[12.5px] text-[var(--syn-working-secondary)]">
        {block.anchor || "未指定锚点"}
      </p>
    </div>
  );
}

function InlineSegments({ segments }: { segments: StudioInlineSegment[] }) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.type === "concept" ? (
          <InlineConcept key={index}>{segment.text}</InlineConcept>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}

function StudioPanelOverlay({
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

function StudioMeta({
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

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="syn-kicker mb-2 px-2 text-[var(--syn-working-muted)]">
      {children}
    </div>
  );
}

function Section({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <section>
      <h2 className="syn-kicker mb-3 text-[var(--syn-working-muted)]">
        {label}
      </h2>
      {children}
    </section>
  );
}

function MetaField({
  label,
  link,
  mono,
  value,
}: {
  label: string;
  link?: boolean;
  mono?: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-[12px]">
      <span className="text-[11.5px] text-[var(--syn-working-muted)]">
        {label}
      </span>
      {/* §1.g ROADMAP value 改纯白，可点击项 hover 下划线 */}
      <span
        className={[
          mono ? "font-mono" : "",
          link ? "cursor-pointer hover:underline" : "",
          "text-right text-[var(--syn-working-ink)]",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function MetaSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[] | string[];
  value: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-1.5 text-[12px]">
      <span className="text-[11.5px] text-[var(--syn-working-muted)]">
        {label}
      </span>
      <select
        className="max-w-[190px] bg-transparent text-right text-[12px] text-[var(--syn-working-ink)] outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option
            className="bg-[var(--syn-working-surface)] text-[var(--syn-working-ink)]"
            key={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetaToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-1.5 text-[12px]">
      <span className="text-[11.5px] text-[var(--syn-working-muted)]">
        {label}
      </span>
      <input
        checked={checked}
        className="size-4 accent-[var(--syn-accent)]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}

function EditableSlug({
  onSlugChange,
  slug,
}: {
  onSlugChange: (slug: string) => void;
  slug: string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="mt-2 inline-flex max-w-full items-center font-mono text-[12px]">
        {/* §4 URL slug 前缀不可编辑且更暗，后缀点击后进入 input */}
        <span className="text-[var(--syn-working-muted)]">
          synapse.app/u/zhe-li/c/
        </span>
        <input
          autoFocus
          className="min-w-[180px] bg-transparent p-0 text-[var(--syn-working-ink)] outline-none"
          onBlur={() => setIsEditing(false)}
          onChange={(event) => onSlugChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              event.currentTarget.blur();
            }
          }}
          value={slug}
        />
      </div>
    );
  }

  return (
    <button
      className="group mt-2 inline-flex max-w-full items-center gap-0 bg-transparent p-0 font-mono text-[12px]"
      onClick={() => setIsEditing(true)}
      type="button"
    >
      {/* §4 URL slug 去背景，前缀深灰、后缀更亮并 hover 下划线 */}
      <span className="text-[var(--syn-working-muted)]">
        synapse.app/u/zhe-li/c/
      </span>
      <span className="text-[var(--syn-working-ink)] underline-offset-3 group-hover:underline">
        {slug}
      </span>
    </button>
  );
}

function InlineConcept({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-[#B39DDB]/[0.08] px-1.5 py-0.5 text-[12.5px] text-[#B39DDB]">
      {children}
    </span>
  );
}
