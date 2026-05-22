"use client";

import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";
import { useMemo, useState } from "react";

import {
  createMathPreview,
  deriveMathStepAnchors,
  labelForCodeLanguage,
  supportedCodeLanguages,
} from "../model/block-editor-model";
import {
  paperBlockAttrsFromResolvedPaper,
  resolvePaperReference,
} from "../api/paper-resolver";
import type {
  MathBlockAttrs,
  PaperBlockAttrs,
  SynapseCodeBlockAttrs,
} from "../model/tiptap-block-schema";
import { CodeMirrorField } from "./codemirror-field";

export const studioMathBlockNodeView = ReactNodeViewRenderer(MathBlockNodeView);
export const studioCodeBlockNodeView = ReactNodeViewRenderer(CodeBlockNodeView);
export const studioPaperBlockNodeView =
  ReactNodeViewRenderer(PaperBlockNodeView);

function MathBlockNodeView({
  editor,
  node,
  updateAttributes,
}: ReactNodeViewProps) {
  const attrs = node.attrs as MathBlockAttrs;
  const preview = useMemo(() => createMathPreview(attrs.latex), [attrs.latex]);
  const steps = useMemo(() => deriveMathStepAnchors(attrs), [attrs]);
  const editable = editor.isEditable;

  return (
    <NodeViewWrapper
      as="section"
      className="syn-tiptap-block syn-tiptap-math-block syn-node-view-block"
      contentEditable={false}
      data-anchor={attrs.anchor}
      data-synapse-block="math"
      data-step={attrs.step}
    >
      <div className="syn-tiptap-node-toolbar">
        <span className="syn-tiptap-block-label">MathBlock</span>
        <label>
          anchor
          <input
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ anchor: event.target.value })
            }
            value={attrs.anchor}
          />
        </label>
        <label>
          step
          <input
            disabled={!editable}
            onChange={(event) => updateAttributes({ step: event.target.value })}
            value={attrs.step}
          />
        </label>
      </div>

      <div className="syn-block-editor-grid">
        <div className="syn-block-editor-pane">
          <CodeMirrorField
            editable={editable}
            language="latex"
            minHeight={190}
            onChange={(latex) => updateAttributes({ latex })}
            value={attrs.latex}
          />
        </div>
        <div className="syn-math-preview-pane">
          {preview.ok ? (
            preview.html ? (
              <div
                className="syn-katex-preview"
                dangerouslySetInnerHTML={{ __html: preview.html }}
              />
            ) : (
              <p className="syn-empty-preview">输入 LaTeX 后显示预览</p>
            )
          ) : (
            <p className="syn-preview-error">{preview.error}</p>
          )}

          {steps.length > 0 ? (
            <ol className="syn-step-anchor-list">
              {steps.map((step) => (
                <li key={step.anchor}>
                  <span>{step.label}</span>
                  <code>#{step.anchor}</code>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

function CodeBlockNodeView({
  editor,
  node,
  updateAttributes,
}: ReactNodeViewProps) {
  const attrs = node.attrs as SynapseCodeBlockAttrs;
  const editable = editor.isEditable;
  const [copyNotice, setCopyNotice] = useState("");

  return (
    <NodeViewWrapper
      as="section"
      className="syn-tiptap-block syn-tiptap-code-block syn-node-view-block"
      contentEditable={false}
      data-anchor={attrs.anchor}
      data-language={attrs.language}
      data-synapse-block="code"
    >
      <div className="syn-tiptap-node-toolbar">
        <span className="syn-tiptap-block-label">
          CodeBlock · {labelForCodeLanguage(attrs.language)}
        </span>
        <button
          className="syn-node-toolbar-action"
          onClick={() =>
            void copyToClipboard(attrs.code, "代码", setCopyNotice)
          }
          type="button"
        >
          复制代码
        </button>
        <button
          className="syn-node-toolbar-action"
          onClick={() =>
            void copyToClipboard(attrs.dependencies, "依赖", setCopyNotice)
          }
          type="button"
        >
          复制依赖
        </button>
        {copyNotice ? (
          <span className="syn-node-toolbar-notice">{copyNotice}</span>
        ) : null}
        <label>
          language
          <select
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ language: event.target.value })
            }
            value={attrs.language}
          >
            {supportedCodeLanguages.map((language) => (
              <option key={language} value={language}>
                {labelForCodeLanguage(language)}
              </option>
            ))}
          </select>
        </label>
        <label>
          ref
          <input
            disabled={!editable}
            onChange={(event) => updateAttributes({ ref: event.target.value })}
            value={attrs.ref ?? ""}
          />
        </label>
        <label>
          anchor
          <input
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ anchor: event.target.value })
            }
            value={attrs.anchor}
          />
        </label>
      </div>

      <div className="syn-code-dependency-row">
        <label>
          dependencies
          <input
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ dependencies: event.target.value })
            }
            placeholder="torch, triton, numpy"
            value={attrs.dependencies}
          />
        </label>
      </div>

      <CodeMirrorField
        editable={editable}
        language={attrs.language}
        minHeight={220}
        onChange={(code) => updateAttributes({ code })}
        value={attrs.code}
      />
    </NodeViewWrapper>
  );
}

function PaperBlockNodeView({
  editor,
  node,
  updateAttributes,
}: ReactNodeViewProps) {
  const attrs = node.attrs as PaperBlockAttrs;
  const editable = editor.isEditable;
  const [importInput, setImportInput] = useState("");
  const [importState, setImportState] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [importError, setImportError] = useState("");

  async function handleImport() {
    const value = importInput || attrs.ref;
    setImportState("loading");
    setImportError("");

    try {
      const paper = await resolvePaperReference(value);
      updateAttributes(paperBlockAttrsFromResolvedPaper(paper, attrs.quote));
      setImportInput("");
      setImportState("idle");
    } catch (error) {
      setImportState("error");
      setImportError(error instanceof Error ? error.message : "论文解析失败");
    }
  }

  return (
    <NodeViewWrapper
      as="article"
      className="syn-tiptap-block syn-tiptap-paper-block syn-node-view-block"
      contentEditable={false}
      data-anchor={attrs.anchor}
      data-ref={attrs.ref}
      data-source={attrs.source}
      data-synapse-block="paper"
    >
      <div className="syn-tiptap-node-toolbar">
        <span className="syn-tiptap-block-label">PaperBlock</span>
        <label>
          source
          <select
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ source: event.target.value })
            }
            value={attrs.source}
          >
            <option value="arxiv">arXiv</option>
            <option value="doi">DOI</option>
            <option value="manual">manual</option>
          </select>
        </label>
        <label>
          ref
          <input
            disabled={!editable}
            onChange={(event) => updateAttributes({ ref: event.target.value })}
            value={attrs.ref}
          />
        </label>
        <label>
          anchor
          <input
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ anchor: event.target.value })
            }
            value={attrs.anchor}
          />
        </label>
      </div>

      <div className="syn-paper-import-row">
        <label>
          arXiv / DOI
          <input
            disabled={!editable}
            onChange={(event) => setImportInput(event.target.value)}
            placeholder="https://arxiv.org/abs/1706.03762 or 10.48550/arXiv..."
            value={importInput}
          />
        </label>
        <button
          className="syn-node-toolbar-action"
          disabled={
            !editable ||
            importState === "loading" ||
            !(importInput.trim() || attrs.ref.trim())
          }
          onClick={handleImport}
          type="button"
        >
          {importState === "loading" ? "解析中" : "导入"}
        </button>
      </div>
      {importState === "error" ? (
        <p className="syn-node-view-error">{importError}</p>
      ) : null}

      <div className="syn-paper-fields">
        <label>
          title
          <input
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ title: event.target.value })
            }
            value={attrs.title}
          />
        </label>
        <label>
          quote
          <textarea
            disabled={!editable}
            onChange={(event) =>
              updateAttributes({ quote: event.target.value })
            }
            value={attrs.quote}
          />
        </label>
      </div>
    </NodeViewWrapper>
  );
}

async function copyToClipboard(
  value: string,
  label: string,
  setCopyNotice: (value: string) => void,
) {
  if (!value.trim()) {
    setCopyNotice(`没有${label}`);
    window.setTimeout(() => setCopyNotice(""), 1400);
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setCopyNotice(`${label}已复制`);
  } catch {
    setCopyNotice("复制失败");
  }

  window.setTimeout(() => setCopyNotice(""), 1400);
}
