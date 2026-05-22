"use client";

import { useMemo, useState } from "react";
import type {
  ReaderInlineSegment,
  ReaderMarkdownBlock,
} from "../model/reader-markdown";
import { createMathPreview } from "../../studio/model/block-editor-model";

export type ReaderMarginPreview = {
  body: string;
  kicker: string;
  title: string;
  type: "concept" | "paper" | "xref";
};

type ReaderMarkdownContentProps = {
  blocks: ReaderMarkdownBlock[];
  onPreviewChange: (preview: ReaderMarginPreview | null) => void;
};

const conceptPreviews: Record<string, ReaderMarginPreview> = {
  一种相似度结构: {
    body: "在 attention 中,一个 head 对 token 间关系形成一套可学习的相似度度量。多头机制的价值,来自同时维护多套相似度结构。",
    kicker: "concept preview",
    title: "一种相似度结构",
    type: "concept",
  },
  "位置 / 句法 / 语义": {
    body: "多头 attention 常把位置关系、局部句法和高层语义分摊到不同子空间中学习。这个划分不是硬规则,但能解释 heads 的互补性。",
    kicker: "concept preview",
    title: "位置 / 句法 / 语义",
    type: "concept",
  },
};

const fallbackCodeByRef: Record<string, string> = {
  "attention.py#L34-L58": `class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.h = n_heads
        self.dk = d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)
        self.out = nn.Linear(d_model, d_model)

    def forward(self, x):
        q, k, v = self.qkv(x).chunk(3, dim=-1)
        q = rearrange(q, "b t (h d) -> b h t d", h=self.h)
        k = rearrange(k, "b t (h d) -> b h t d", h=self.h)
        v = rearrange(v, "b t (h d) -> b h t d", h=self.h)
        attn = (q @ k.transpose(-2, -1)) / math.sqrt(self.dk)
        attn = attn.softmax(dim=-1)
        y = attn @ v
        return self.out(rearrange(y, "b h t d -> b t (h d)"))`,
};

export function ReaderMarkdownContent({
  blocks,
  onPreviewChange,
}: ReaderMarkdownContentProps) {
  return (
    <div className="mt-10 space-y-6">
      {blocks.map((block, index) => (
        <ReaderBlock
          block={block}
          key={`${block.type}-${index}`}
          onPreviewChange={onPreviewChange}
        />
      ))}
    </div>
  );
}

function ReaderBlock({
  block,
  onPreviewChange,
}: {
  block: ReaderMarkdownBlock;
  onPreviewChange: (preview: ReaderMarginPreview | null) => void;
}) {
  switch (block.type) {
    case "heading": {
      const Heading = block.level === 2 ? "h2" : "h3";

      return (
        <Heading
          className={
            block.level === 2
              ? "mt-12 scroll-mt-24 font-display text-[22px] font-semibold leading-tight text-[var(--syn-reading-ink)]"
              : "mt-9 scroll-mt-24 font-display text-[18px] font-semibold leading-tight text-[var(--syn-reading-ink)]"
          }
          id={block.id}
        >
          {block.text}
        </Heading>
      );
    }
    case "paragraph":
      return (
        <p className="max-w-[900px] text-[16px] leading-[1.82] text-[var(--syn-reading-secondary)]">
          <ReaderInline
            onPreviewChange={onPreviewChange}
            segments={block.segments}
          />
        </p>
      );
    case "blockquote":
      return (
        <blockquote className="my-8 max-w-[900px] border-l-2 border-[var(--syn-accent)] pl-5 text-[16px] italic leading-[1.8] text-[var(--syn-reading-secondary)]">
          <ReaderInline
            onPreviewChange={onPreviewChange}
            segments={block.segments}
          />
        </blockquote>
      );
    case "math":
      return (
        <ReaderMathBlock block={block} onPreviewChange={onPreviewChange} />
      );
    case "code":
      return (
        <ReaderCodeBlock block={block} onPreviewChange={onPreviewChange} />
      );
    case "card":
      return <ReaderFlashcard block={block} />;
    case "paper":
      return (
        <ReaderPaperBlock block={block} onPreviewChange={onPreviewChange} />
      );
  }
}

function ReaderInline({
  onPreviewChange,
  segments,
}: {
  onPreviewChange: (preview: ReaderMarginPreview | null) => void;
  segments: ReaderInlineSegment[];
}) {
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <span key={`${segment.type}-${index}`}>{segment.text}</span>;
        }

        if (segment.type === "code") {
          return (
            <code
              className="font-mono text-[0.92em] text-[var(--syn-reading-ink)]"
              key={`${segment.type}-${segment.text}-${index}`}
            >
              {segment.text}
            </code>
          );
        }

        const preview = conceptPreviews[segment.text] ?? {
          body: `${segment.text} 是本文中的概念锚点。打开后可跳转到对应 note,或在 margin 中预览定义的前三行。`,
          kicker: "concept preview",
          title: segment.text,
          type: "concept" as const,
        };

        return (
          <a
            className="cursor-pointer underline decoration-dotted decoration-1 underline-offset-4 transition hover:text-[var(--syn-accent)]"
            href={`/app?view=note&id=${encodeURIComponent(segment.text)}`}
            key={`${segment.type}-${segment.text}-${index}`}
            onBlur={() => onPreviewChange(null)}
            onFocus={() => onPreviewChange(preview)}
            onMouseEnter={() => onPreviewChange(preview)}
            onMouseLeave={() => onPreviewChange(null)}
          >
            {segment.text}
          </a>
        );
      })}
    </>
  );
}

function ReaderMathBlock({
  block,
  onPreviewChange,
}: {
  block: Extract<ReaderMarkdownBlock, { type: "math" }>;
  onPreviewChange: (preview: ReaderMarginPreview | null) => void;
}) {
  const preview = useMemo(() => createMathPreview(block.body), [block.body]);
  const marginPreview: ReaderMarginPreview = {
    body: block.steps
      .slice(0, 3)
      .map((step) => `${step.label}: ${step.latex}`)
      .join("\n"),
    kicker: "cross-reference",
    title: `Equation (${block.equationNumber})`,
    type: "xref",
  };

  return (
    <figure
      className="my-10 max-w-[960px]"
      id={block.id}
      onMouseEnter={() => onPreviewChange(marginPreview)}
      onMouseLeave={() => onPreviewChange(null)}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-6">
        {preview.ok ? (
          <div
            className="overflow-x-auto text-center text-[var(--syn-reading-ink)] [&_.katex-display]:m-0"
            dangerouslySetInnerHTML={{ __html: preview.html }}
          />
        ) : (
          <div className="overflow-x-auto text-center text-[var(--syn-reading-ink)]">
            <pre className="whitespace-pre-wrap font-mono text-[12px]">
              {block.body}
            </pre>
          </div>
        )}
        <figcaption className="font-mono text-[12px] text-text-muted">
          ({block.equationNumber})
        </figcaption>
      </div>
      {block.steps.length > 1 ? (
        <ol className="mt-4 grid gap-1 pl-0 font-mono text-[11px] text-text-muted">
          {block.steps.map((step) => (
            <li
              className="flex justify-between gap-4"
              id={step.anchor}
              key={step.anchor}
            >
              <span>{step.label}</span>
              <span>#{step.anchor}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </figure>
  );
}

function ReaderCodeBlock({
  block,
  onPreviewChange,
}: {
  block: Extract<ReaderMarkdownBlock, { type: "code" }>;
  onPreviewChange: (preview: ReaderMarginPreview | null) => void;
}) {
  const code =
    block.body || fallbackCodeByRef[block.ref] || "# code not attached";
  const startLine = parseCodeStartLine(block.ref);
  const refLabel = formatCodeRef(block.ref);
  const marginPreview: ReaderMarginPreview = {
    body: code.split("\n").slice(0, 3).join("\n"),
    kicker: "cross-reference",
    title: refLabel,
    type: "xref",
  };

  return (
    <figure
      className="my-10 max-w-[840px] border-l border-[var(--syn-accent)] pl-5"
      onMouseEnter={() => onPreviewChange(marginPreview)}
      onMouseLeave={() => onPreviewChange(null)}
    >
      <figcaption className="mb-3 text-right text-[12px] italic text-text-muted">
        <a
          className="hover:text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
          href={githubHref(block.ref)}
        >
          Figure 1: {refLabel} ↗
        </a>
      </figcaption>
      <pre className="m-0 overflow-x-auto bg-transparent font-mono text-[12px] leading-6 text-[var(--syn-reading-ink)]">
        <code>
          {code.split("\n").map((line, index) => (
            <span className="grid grid-cols-[3.5rem_1fr] gap-4" key={index}>
              <span className="select-none text-right text-[#BBBBBB]">
                {startLine + index}
              </span>
              <span>{highlightCodeLine(line, block.language)}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

function ReaderFlashcard({
  block,
}: {
  block: Extract<ReaderMarkdownBlock, { type: "card" }>;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      className="my-8 block w-full max-w-[560px] border border-auth-subtle bg-transparent p-5 text-left transition hover:border-[var(--syn-accent)]"
      onClick={() => setFlipped((value) => !value)}
      type="button"
    >
      <span className="block text-[12px] italic text-text-muted">
        flashcard · click to flip
      </span>
      <span className="mt-4 block text-[18px] leading-7 text-[var(--syn-reading-ink)]">
        {flipped ? block.back : block.front}
      </span>
    </button>
  );
}

function ReaderPaperBlock({
  block,
  onPreviewChange,
}: {
  block: Extract<ReaderMarkdownBlock, { type: "paper" }>;
  onPreviewChange: (preview: ReaderMarginPreview | null) => void;
}) {
  const preview: ReaderMarginPreview = {
    body: "Scaled Dot-Product Attention 将 query 与 key 的点积按 sqrt(d_k) 缩放后做 softmax,再对 value 加权求和。这一节是 multi-head 推导的直接来源。",
    kicker: `arXiv:${block.ref}`,
    title: block.citationLabel,
    type: "paper",
  };

  return (
    <aside
      className="my-8 max-w-[760px] border-l-2 border-[var(--syn-accent)] pl-5 text-[15px] leading-7 text-[var(--syn-reading-secondary)]"
      onMouseEnter={() => onPreviewChange(preview)}
      onMouseLeave={() => onPreviewChange(null)}
    >
      <a
        className="text-[var(--syn-accent)] hover:underline hover:decoration-[0.5px] hover:underline-offset-4"
        href={`https://arxiv.org/abs/${block.ref}`}
      >
        [{block.citationLabel}]
      </a>
      <span className="ml-2 text-text-muted">
        Attention Is All You Need · arXiv:{block.ref}
      </span>
    </aside>
  );
}

function highlightCodeLine(line: string, language: string) {
  if (language !== "python") return line;

  const keywordMatch =
    /^(\s*)(class|def|return|self|super|import|from)\b(.*)$/u.exec(line);
  if (!keywordMatch) {
    return <span>{line}</span>;
  }

  return (
    <>
      {keywordMatch[1]}
      <span className="text-[var(--syn-accent)]">{keywordMatch[2]}</span>
      {keywordMatch[3]}
    </>
  );
}

function parseCodeStartLine(ref: string) {
  const match = /#L(\d+)/u.exec(ref);
  return match ? Number(match[1]) : 1;
}

function formatCodeRef(ref: string) {
  return ref.replace("#", " ").replace(/L(\d+)-L(\d+)/u, "L$1-L$2");
}

function githubHref(ref: string) {
  return `https://github.com/search?q=${encodeURIComponent(ref)}`;
}
