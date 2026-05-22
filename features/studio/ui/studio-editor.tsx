"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { fetchStudioDraft } from "../api/studio-live-data";
import { publishStudioDraft } from "../api/publish-draft";
import {
  STUDIO_AUTOSAVE_DELAY_MS,
  saveStudioDraftSnapshot,
} from "../api/studio-autosave";
import { initialDrafts } from "../model/editor-fixtures";
import {
  addUniqueTag,
  createRelationship,
  createResource,
  createStudioDraft,
  createStudioHistoryEntry,
  removeTag,
  slugifyTitle,
  type StudioDraft,
  type StudioHistoryEntry,
} from "../model/studio-editor-model";
import { EditorCanvas } from "./editor-canvas";
import { StudioMeta } from "./studio-meta";
import { StudioPanelOverlay } from "./studio-panel-overlay";
import { StudioSidebar } from "./studio-sidebar";
import { StudioToolbar } from "./studio-toolbar";
import type { EditorMode, SaveState, StudioPanel } from "./studio-editor-types";

export function StudioEditor() {
  const searchParams = useSearchParams();
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
  const restoredDraftIdRef = useRef("");
  const explicitRestoreDraftId = searchParams.get("draft")?.trim() ?? "";
  const restoreDraftId = explicitRestoreDraftId || initialDrafts[0].id;
  const currentDraft =
    draftItems.find((draft) => draft.id === currentDraftId) ?? draftItems[0];
  const autoSaveKey = draftAutoSaveKey(currentDraft);

  useEffect(() => {
    if (restoredDraftIdRef.current === restoreDraftId) {
      return;
    }

    restoredDraftIdRef.current = restoreDraftId;
    let cancelled = false;

    void (async () => {
      try {
        const restoredDraft = await fetchStudioDraft(restoreDraftId);

        if (cancelled) {
          return;
        }

        autoSaveKeyRef.current = draftAutoSaveKey(restoredDraft);
        setDraftItems((items) => {
          const exists = items.some((draft) => draft.id === restoredDraft.id);

          if (!exists) {
            return [restoredDraft, ...items];
          }

          return items.map((draft) =>
            draft.id === restoredDraft.id ? restoredDraft : draft,
          );
        });
        setCurrentDraftId(restoredDraft.id);
        setSaveState("saved");
        if (explicitRestoreDraftId) {
          setNotice("已从后端恢复草稿");
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (explicitRestoreDraftId) {
          setNotice(
            error instanceof Error
              ? `草稿恢复失败：${error.message}`
              : "草稿恢复失败",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [explicitRestoreDraftId, restoreDraftId]);

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

    let cancelled = false;
    const timeout = window.setTimeout(() => {
      void (async () => {
        try {
          await saveStudioDraftSnapshot(currentDraft);

          if (cancelled) {
            return;
          }

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
        } catch (error) {
          if (cancelled) {
            return;
          }

          setSaveState("failed");
          setNotice(
            error instanceof Error
              ? `自动保存失败：${error.message}`
              : "自动保存失败",
          );
        }
      })();
    }, STUDIO_AUTOSAVE_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [autoSaveKey, currentDraft, currentDraftId]);

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

  async function handlePublish() {
    const nextDraft = {
      ...currentDraft,
      status: "published" as const,
      updatedAtLabel: "刚刚",
      visibility: "Public" as const,
    };
    updateCurrentDraft(nextDraft);
    setSaveState("saving");

    try {
      await publishStudioDraft(nextDraft);
      setSaveState("saved");
      setNotice("已发布到后端");
    } catch (error) {
      setSaveState("failed");
      setNotice(error instanceof Error ? error.message : "后端发布失败");
    }
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
    <section className="syn-working-mode flex h-[calc(100dvh-3.5rem)] min-w-[1200px] flex-col overflow-hidden text-text-primary [font-family:var(--font-sans)]">
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

      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)_320px] overflow-hidden">
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
        drafts={draftItems}
        onAddRelationship={(rel, target, options) => {
          updateCurrentDraft({
            relationships: [
              ...currentDraft.relationships,
              createRelationship(
                currentDraft.relationships.length,
                rel,
                target,
                options,
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

function draftAutoSaveKey(draft: StudioDraft) {
  return [
    draft.id,
    draft.contentType,
    draft.allowComments,
    draft.allowDerivatives,
    draft.license,
    draft.markdown,
    JSON.stringify(draft.relationships),
    JSON.stringify(draft.resources),
    JSON.stringify(draft.roadmap),
    draft.slug,
    draft.status,
    draft.summary,
    draft.tags.join(","),
    draft.title,
    draft.visibility,
  ].join("\u0000");
}
