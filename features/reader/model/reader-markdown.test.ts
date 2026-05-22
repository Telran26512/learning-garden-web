import { describe, expect, it } from "vitest";

import { parseReaderMarkdown } from "./reader-markdown";

describe("reader markdown parser", () => {
  it("parses Synapse reading DSL into renderable blocks and strips the source H1", () => {
    const blocks = parseReaderMarkdown(
      `# Multi-Head Attention

> 把单头注意力拆成 h 个并行的子空间,再 concat。

## §1 直觉

单个 attention 头只能学到 ::concept[一种相似度结构]。

::math
\\\\text{head}_i = \\\\text{Attention}(QW_i^Q, KW_i^K, VW_i^V) \\\\\\\\
\\\\text{MultiHead}(Q,K,V) = \\\\text{Concat}(\\\\text{head}_1,\\\\dots,\\\\text{head}_h) W^O
::

::code{lang=python ref=attention.py#L34-L58}

::card{front="Multi-Head 拆分维度是?" back="d_model = h × d_k"}

::paper{ref=1706.03762 anchor=§3.2.2}`,
      { stripFirstH1: true },
    );

    expect(blocks.map((block) => block.type)).toEqual([
      "blockquote",
      "heading",
      "paragraph",
      "math",
      "code",
      "card",
      "paper",
    ]);

    expect(blocks).not.toContainEqual(
      expect.objectContaining({
        text: "Multi-Head Attention",
        type: "heading",
      }),
    );
    expect(blocks[2]).toMatchObject({
      segments: [
        { text: "单个 attention 头只能学到 ", type: "text" },
        { text: "一种相似度结构", type: "concept" },
        { text: "。", type: "text" },
      ],
      type: "paragraph",
    });
    expect(blocks[3]).toMatchObject({
      equationNumber: 1,
      type: "math",
    });
    expect(blocks[4]).toMatchObject({
      language: "python",
      ref: "attention.py#L34-L58",
      type: "code",
    });
    expect(blocks[5]).toMatchObject({
      back: "d_model = h × d_k",
      front: "Multi-Head 拆分维度是?",
      type: "card",
    });
    expect(blocks[6]).toMatchObject({
      anchor: "§3.2.2",
      citationLabel: "Vaswani 2017, §3.2.2",
      ref: "1706.03762",
      type: "paper",
    });
  });
});
