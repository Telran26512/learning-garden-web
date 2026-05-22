import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { parseReaderMarkdown } from "../model/reader-markdown";
import { ReaderMarkdownContent } from "./reader-markdown-content";

describe("ReaderMarkdownContent", () => {
  it("renders Synapse DSL without leaking source markers", () => {
    const blocks = parseReaderMarkdown(
      `# Multi-Head Attention

> 把单头注意力拆成 h 个并行的子空间,再 concat。

## §1 直觉

单个 attention 头只能学到 ::concept[一种相似度结构]。

::math
A = softmax(QK^T / \\\\sqrt{d_k})V
::

::code{lang=python ref=attention.py#L34-L58}

::card{front="Multi-Head 拆分维度是?" back="d_model = h × d_k"}

::paper{ref=1706.03762 anchor=§3.2.2}`,
      { stripFirstH1: true },
    );

    const html = renderToStaticMarkup(
      <ReaderMarkdownContent blocks={blocks} onPreviewChange={() => {}} />,
    );

    expect(html).toContain("katex");
    expect(html).toContain("attention.py L34-L58");
    expect(html).toContain("flashcard");
    expect(html).toContain("[Vaswani 2017, §3.2.2]");
    expect(html).toContain("一种相似度结构");
    expect(html).not.toMatch(/::(?:math|code|concept|paper|card)/u);
    expect(html).not.toContain("# Multi-Head Attention");
  });
});
