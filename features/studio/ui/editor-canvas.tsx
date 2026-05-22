import {
  slugifyTitle,
  syncMarkdownTitle,
  type StudioDraft,
} from "../model/studio-editor-model";
import { EditableSlug } from "./studio-fields";
import type { EditorMode } from "./studio-editor-types";
import { TiptapStudioEditor } from "./tiptap-studio-editor";

export function EditorCanvas({
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

        <TiptapStudioEditor
          markdown={currentDraft.markdown}
          mode={editorMode}
          onMarkdownChange={(markdown) => onDraftChange({ markdown })}
          onModeChange={onModeChange}
        />
      </div>
    </main>
  );
}
