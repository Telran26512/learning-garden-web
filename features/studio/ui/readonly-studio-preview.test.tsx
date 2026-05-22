import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

import { ReadonlyStudioPreview } from "./readonly-studio-preview";

describe("ReadonlyStudioPreview", () => {
  test("renders P3 blocks without editor-only controls", () => {
    const html = renderToStaticMarkup(
      <ReadonlyStudioPreview
        markdown={`# Multi-Head Attention

把单头注意力拆成 h 个并行的子空间。

::math{anchor=scale step=S}
A = softmax(QK^T / \\\\sqrt{d_k})V
::

::code{lang=python ref=attention.py#L34-L58 deps=torch,triton anchor=attention-forward}
return attn @ v
::

::paper{ref=1706.03762 source=arxiv title="Attention Is All You Need" quote="Scaled Dot-Product Attention" anchor=§3.2.2}`}
      />,
    );

    expect(html).toContain("Multi-Head Attention");
    expect(html).toContain("把单头注意力拆成");
    expect(html).toContain("katex");
    expect(html).toContain("return attn @ v");
    expect(html).toContain("torch,triton");
    expect(html).toContain("Attention Is All You Need");
    expect(html).toContain("Scaled Dot-Product Attention");

    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
    expect(html).not.toContain("contenteditable");
    expect(html).not.toContain("复制代码");
    expect(html).not.toContain("复制依赖");
  });
});
