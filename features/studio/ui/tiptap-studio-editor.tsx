"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useMemo, useRef } from "react";

import {
  createStudioTiptapExtensions,
  studioMarkdownToTiptapDoc,
  tiptapDocToStudioMarkdown,
} from "../model/tiptap-block-schema";
import {
  studioCodeBlockNodeView,
  studioMathBlockNodeView,
  studioPaperBlockNodeView,
} from "./studio-block-node-views";
import type { EditorMode } from "./studio-editor-types";
import { ReadonlyStudioPreview } from "./readonly-studio-preview";

export function TiptapStudioEditor({
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
  const extensions = useMemo(
    () =>
      createStudioTiptapExtensions({
        codeBlock: studioCodeBlockNodeView,
        mathBlock: studioMathBlockNodeView,
        paperBlock: studioPaperBlockNodeView,
      }),
    [],
  );
  const lastSyncedMarkdownRef = useRef(markdown);
  const editor = useEditor({
    content: studioMarkdownToTiptapDoc(markdown),
    editable: mode === "edit",
    editorProps: {
      attributes: {
        class: "syn-tiptap-prosemirror",
      },
    },
    extensions,
    immediatelyRender: false,
    onUpdate: ({ editor: activeEditor }) => {
      const nextMarkdown = tiptapDocToStudioMarkdown(activeEditor.getJSON());

      lastSyncedMarkdownRef.current = nextMarkdown;
      onMarkdownChange(nextMarkdown);
    },
  });

  useEffect(() => {
    editor?.setEditable(mode === "edit");
  }, [editor, mode]);

  useEffect(() => {
    if (!editor || markdown === lastSyncedMarkdownRef.current) {
      return;
    }

    lastSyncedMarkdownRef.current = markdown;
    editor.commands.setContent(studioMarkdownToTiptapDoc(markdown), {
      emitUpdate: false,
    });
  }, [editor, markdown]);

  const canEdit = Boolean(editor) && mode === "edit";

  return (
    <section className="syn-tiptap-shell mt-6 overflow-hidden rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)]">
      <div className="flex h-[54px] items-center justify-between border-b border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] px-5">
        <div className="inline-flex gap-5">
          <button
            className={modeTabClass(mode === "edit")}
            onClick={() => onModeChange("edit")}
            type="button"
          >
            Edit
          </button>
          <button
            className={modeTabClass(mode === "preview")}
            onClick={() => onModeChange("preview")}
            type="button"
          >
            Preview
          </button>
        </div>

        {mode === "edit" ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-[var(--syn-working-muted)]">
              TipTap schema
            </span>
            <button
              className="h-8 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-3 text-[12px] text-[var(--syn-working-secondary)] transition enabled:hover:text-[var(--syn-working-ink)] disabled:opacity-45"
              disabled={!canEdit}
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .insertMathBlock({
                    anchor: "scale",
                    latex: "A = softmax(QK^T / \\sqrt{d_k})V",
                    step: "B-01",
                  })
                  .run()
              }
              type="button"
            >
              + MathBlock
            </button>
            <button
              className="h-8 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-3 text-[12px] text-[var(--syn-working-secondary)] transition enabled:hover:text-[var(--syn-working-ink)] disabled:opacity-45"
              disabled={!canEdit}
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .insertSynapseCodeBlock({
                    anchor: "attention-forward",
                    code: "return attn @ v",
                    dependencies: "torch",
                    language: "python",
                    ref: "attention.py#L34-L58",
                  })
                  .run()
              }
              type="button"
            >
              + CodeBlock
            </button>
            <button
              className="h-8 rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-transparent px-3 text-[12px] text-[var(--syn-working-secondary)] transition enabled:hover:text-[var(--syn-working-ink)] disabled:opacity-45"
              disabled={!canEdit}
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .insertPaperBlock({
                    anchor: "§3.2.2",
                    quote: "Scaled Dot-Product Attention",
                    ref: "1706.03762",
                    source: "arxiv",
                    title: "Attention Is All You Need",
                  })
                  .run()
              }
              type="button"
            >
              + PaperBlock
            </button>
          </div>
        ) : (
          <span className="font-mono text-[12px] text-[var(--syn-working-muted)]">
            Readonly preview
          </span>
        )}
      </div>

      {mode === "preview" ? (
        <ReadonlyStudioPreview markdown={markdown} />
      ) : (
        <EditorContent className="syn-tiptap-content" editor={editor} />
      )}
    </section>
  );
}

function modeTabClass(active: boolean) {
  return [
    "h-8",
    "border-b",
    "px-0",
    "text-[13px]",
    "font-medium",
    "transition",
    active
      ? "border-[var(--syn-accent)] text-[var(--syn-working-ink)]"
      : "border-transparent text-[var(--syn-working-secondary)] hover:text-[var(--syn-working-ink)]",
  ].join(" ");
}
