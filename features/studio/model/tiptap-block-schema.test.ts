import { getSchema } from "@tiptap/core";
import { describe, expect, test } from "vitest";

import {
  createStudioTiptapExtensions,
  studioMarkdownToTiptapDoc,
  tiptapDocToStudioMarkdown,
} from "./tiptap-block-schema";

describe("studio TipTap block schema", () => {
  test("registers MathBlock, CodeBlock, and PaperBlock as block nodes", () => {
    const schema = getSchema(createStudioTiptapExtensions());

    expect(schema.nodes.mathBlock.spec.group).toBe("block");
    expect(schema.nodes.mathBlock.spec.atom).toBe(true);
    expect(schema.nodes.codeBlock.spec.group).toBe("block");
    expect(schema.nodes.codeBlock.spec.atom).toBe(true);
    expect(schema.nodes.paperBlock.spec.group).toBe("block");
    expect(schema.nodes.paperBlock.spec.atom).toBe(true);
  });

  test("renders semantic data attributes for the three Synapse block types", () => {
    const schema = getSchema(createStudioTiptapExtensions());
    const domSpecs = [
      schema.nodes.mathBlock.spec.toDOM?.(
        schema.nodeFromJSON({
          type: "mathBlock",
          attrs: {
            anchor: "scale",
            latex: "A = softmax(QK^T / \\sqrt{d_k})V",
            step: "B-02",
          },
        }),
      ),
      schema.nodes.codeBlock.spec.toDOM?.(
        schema.nodeFromJSON({
          type: "codeBlock",
          attrs: {
            anchor: "attention-forward",
            code: "return attn @ v",
            dependencies: "torch",
            language: "python",
          },
        }),
      ),
      schema.nodes.paperBlock.spec.toDOM?.(
        schema.nodeFromJSON({
          type: "paperBlock",
          attrs: {
            anchor: "§3.2.2",
            quote: "Scaled Dot-Product Attention",
            ref: "1706.03762",
            source: "arxiv",
            title: "Attention Is All You Need",
          },
        }),
      ),
    ];
    const serializedSpecs = JSON.stringify(domSpecs);

    expect(serializedSpecs).toContain('"data-synapse-block":"math"');
    expect(serializedSpecs).toContain('"data-anchor":"scale"');
    expect(serializedSpecs).toContain('"data-synapse-block":"code"');
    expect(serializedSpecs).toContain('"data-language":"python"');
    expect(serializedSpecs).toContain('"data-synapse-block":"paper"');
    expect(serializedSpecs).toContain('"data-ref":"1706.03762"');
  });

  test("converts existing Synapse markdown directives into TipTap JSON blocks", () => {
    const doc = studioMarkdownToTiptapDoc(`# Multi-Head Attention

把 attention 拆成多个 block。

::math{anchor=scale step=B-02}
A = softmax(QK^T / \\sqrt{d_k})V
::

::code{lang=python ref=attention.py#L34-L58 deps=torch anchor=attention-forward}
return attn @ v
::

::paper{ref=1706.03762 source=arxiv title="Attention Is All You Need" quote="Scaled Dot-Product Attention" anchor=§3.2.2}`);

    expect(doc).toEqual({
      type: "doc",
      content: [
        {
          attrs: { level: 1 },
          content: [{ text: "Multi-Head Attention", type: "text" }],
          type: "heading",
        },
        {
          content: [{ text: "把 attention 拆成多个 block。", type: "text" }],
          type: "paragraph",
        },
        {
          attrs: {
            anchor: "scale",
            latex: "A = softmax(QK^T / \\sqrt{d_k})V",
            step: "B-02",
          },
          type: "mathBlock",
        },
        {
          attrs: {
            anchor: "attention-forward",
            code: "return attn @ v",
            dependencies: "torch",
            language: "python",
            ref: "attention.py#L34-L58",
          },
          type: "codeBlock",
        },
        {
          attrs: {
            anchor: "§3.2.2",
            quote: "Scaled Dot-Product Attention",
            ref: "1706.03762",
            source: "arxiv",
            title: "Attention Is All You Need",
          },
          type: "paperBlock",
        },
      ],
    });
  });

  test("serializes TipTap JSON blocks back to Synapse markdown directives", () => {
    const markdown = tiptapDocToStudioMarkdown({
      type: "doc",
      content: [
        {
          attrs: { level: 1 },
          content: [{ text: "Multi-Head Attention", type: "text" }],
          type: "heading",
        },
        {
          attrs: {
            anchor: "scale",
            latex: "A = softmax(QK^T / \\sqrt{d_k})V",
            step: "B-02",
          },
          type: "mathBlock",
        },
        {
          attrs: {
            anchor: "attention-forward",
            code: "return attn @ v",
            dependencies: "torch",
            language: "python",
          },
          type: "codeBlock",
        },
        {
          attrs: {
            anchor: "§3.2.2",
            quote: "Scaled Dot-Product Attention",
            ref: "1706.03762",
            source: "arxiv",
            title: "Attention Is All You Need",
          },
          type: "paperBlock",
        },
      ],
    });

    expect(markdown).toBe(`# Multi-Head Attention

::math{anchor=scale step=B-02}
A = softmax(QK^T / \\sqrt{d_k})V
::

::code{lang=python ref=attention-forward deps=torch anchor=attention-forward}
return attn @ v
::

::paper{ref=1706.03762 source=arxiv title="Attention Is All You Need" quote="Scaled Dot-Product Attention" anchor=§3.2.2}`);
  });

  test("round-trips empty CodeBlock delimiters without leaking terminator text", () => {
    const doc = studioMarkdownToTiptapDoc(`# Code note

::code{lang=python ref=attention.py#L34-L58}

::

after`);

    expect(doc.content?.map((node) => node.type)).toEqual([
      "heading",
      "codeBlock",
      "paragraph",
    ]);
    expect(doc.content?.[2]).toMatchObject({
      content: [{ text: "after", type: "text" }],
      type: "paragraph",
    });
  });
});
