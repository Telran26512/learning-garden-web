import { useMemo, useState } from "react";

import {
  parseStudioMarkdown,
  type StudioInlineSegment,
  type StudioMarkdownBlock,
} from "../model/studio-editor-model";
import { InlineConcept } from "./studio-fields";
import type { EditorMode } from "./studio-editor-types";

export function GithubMarkdownEditor({
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
