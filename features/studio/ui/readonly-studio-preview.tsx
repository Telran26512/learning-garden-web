import type { JSONContent } from "@tiptap/core";

import {
  createMathPreview,
  deriveMathStepAnchors,
  labelForCodeLanguage,
} from "../model/block-editor-model";
import {
  studioMarkdownToTiptapDoc,
  type MathBlockAttrs,
  type PaperBlockAttrs,
  type SynapseCodeBlockAttrs,
} from "../model/tiptap-block-schema";

export function ReadonlyStudioPreview({ markdown }: { markdown: string }) {
  const doc = studioMarkdownToTiptapDoc(markdown);
  const nodes = Array.isArray(doc.content) ? doc.content : [];

  return (
    <div className="syn-readonly-preview">
      {nodes.map((node, index) => (
        <ReadonlyNode key={`${node.type ?? "node"}-${index}`} node={node} />
      ))}
    </div>
  );
}

function ReadonlyNode({ node }: { node: JSONContent }) {
  switch (node.type) {
    case "heading": {
      const level = clampHeadingLevel(Number(node.attrs?.level ?? 1));
      const Heading = `h${level}` as "h1" | "h2" | "h3";

      return <Heading>{renderInlineContent(node)}</Heading>;
    }
    case "blockquote":
      return <blockquote>{renderInlineContent(node)}</blockquote>;
    case "paragraph":
      return <p>{renderInlineContent(node)}</p>;
    case "mathBlock":
      return <ReadonlyMathBlock attrs={toMathBlockAttrs(node.attrs ?? {})} />;
    case "codeBlock":
      return <ReadonlyCodeBlock attrs={toCodeBlockAttrs(node.attrs ?? {})} />;
    case "paperBlock":
      return <ReadonlyPaperBlock attrs={toPaperBlockAttrs(node.attrs ?? {})} />;
    default:
      return nodeText(node) ? <p>{nodeText(node)}</p> : null;
  }
}

function ReadonlyMathBlock({ attrs }: { attrs: MathBlockAttrs }) {
  const preview = createMathPreview(attrs.latex);
  const steps = deriveMathStepAnchors(attrs);

  return (
    <section className="syn-readonly-block syn-readonly-math">
      <div className="syn-readonly-block-meta">
        <span>math</span>
        {attrs.step ? <span>{attrs.step}</span> : null}
        {attrs.anchor ? <code>#{attrs.anchor}</code> : null}
      </div>

      {preview.ok && preview.html ? (
        <div
          className="syn-readonly-math-render"
          dangerouslySetInnerHTML={{ __html: preview.html }}
        />
      ) : (
        <pre className="syn-readonly-math-source">{attrs.latex}</pre>
      )}

      {preview.error ? (
        <p className="syn-readonly-block-error">{preview.error}</p>
      ) : null}

      {steps.length > 0 ? (
        <ol className="syn-readonly-step-list">
          {steps.map((step) => (
            <li key={step.anchor}>
              <span>{step.label}</span>
              <code>#{step.anchor}</code>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function ReadonlyCodeBlock({ attrs }: { attrs: SynapseCodeBlockAttrs }) {
  const languageLabel = labelForCodeLanguage(attrs.language);

  return (
    <section className="syn-readonly-block syn-readonly-code">
      <div className="syn-readonly-block-meta">
        <span>code</span>
        <span>{languageLabel}</span>
        {attrs.ref ? <code>{attrs.ref}</code> : null}
        {attrs.anchor ? <code>#{attrs.anchor}</code> : null}
      </div>

      <pre className="syn-readonly-code-body">
        <code>{attrs.code || "No code yet."}</code>
      </pre>

      {attrs.dependencies ? (
        <div className="syn-readonly-dependencies">
          deps <span>{attrs.dependencies}</span>
        </div>
      ) : null}
    </section>
  );
}

function ReadonlyPaperBlock({ attrs }: { attrs: PaperBlockAttrs }) {
  return (
    <article className="syn-readonly-block syn-readonly-paper">
      <div className="syn-readonly-block-meta">
        <span>paper</span>
        <span>{attrs.source}</span>
        {attrs.ref ? <code>{attrs.ref}</code> : null}
        {attrs.anchor ? <code>#{attrs.anchor}</code> : null}
      </div>

      <strong className="syn-readonly-paper-title">
        {attrs.title || attrs.ref || "Untitled paper"}
      </strong>

      {attrs.quote ? (
        <blockquote className="syn-readonly-paper-quote">
          {attrs.quote}
        </blockquote>
      ) : null}
    </article>
  );
}

function renderInlineContent(node: JSONContent) {
  const children = Array.isArray(node.content) ? node.content : [];

  if (children.length === 0) {
    return node.text ?? null;
  }

  return children.map((child, index) => (
    <span key={`${child.type ?? "text"}-${index}`}>{nodeText(child)}</span>
  ));
}

function nodeText(node: JSONContent): string {
  if (node.text) {
    return node.text;
  }

  return (node.content ?? []).map((child) => nodeText(child)).join("");
}

function toMathBlockAttrs(attrs: JSONContent["attrs"]): MathBlockAttrs {
  return {
    anchor: stringAttr(attrs?.anchor),
    latex: stringAttr(attrs?.latex),
    step: stringAttr(attrs?.step),
  };
}

function toCodeBlockAttrs(attrs: JSONContent["attrs"]): SynapseCodeBlockAttrs {
  return {
    anchor: stringAttr(attrs?.anchor),
    code: stringAttr(attrs?.code),
    dependencies: stringAttr(attrs?.dependencies),
    language: stringAttr(attrs?.language) || "text",
    ref: stringAttr(attrs?.ref),
  };
}

function toPaperBlockAttrs(attrs: JSONContent["attrs"]): PaperBlockAttrs {
  return {
    anchor: stringAttr(attrs?.anchor),
    quote: stringAttr(attrs?.quote),
    ref: stringAttr(attrs?.ref),
    source: paperSourceAttr(attrs?.source),
    title: stringAttr(attrs?.title),
  };
}

function stringAttr(value: unknown) {
  return typeof value === "string" ? value : "";
}

function paperSourceAttr(value: unknown): PaperBlockAttrs["source"] {
  return value === "arxiv" || value === "doi" ? value : "manual";
}

function clampHeadingLevel(level: number) {
  if (level <= 1) return 1;
  if (level >= 3) return 3;

  return 2;
}
