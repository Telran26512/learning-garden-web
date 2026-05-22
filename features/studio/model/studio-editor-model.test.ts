import { describe, expect, test } from "vitest";

import {
  addUniqueTag,
  buildStudioLinkTargets,
  createRelationship,
  createResource,
  createStudioDraft,
  createStudioHistoryEntry,
  parsePaperReference,
  parseStudioMarkdown,
  removeTag,
  slugifyTitle,
  syncMarkdownTitle,
} from "./studio-editor-model";

describe("parseStudioMarkdown", () => {
  test("parses Synapse markdown blocks and inline concepts", () => {
    const blocks = parseStudioMarkdown(`# Multi-Head Attention

> 把单头注意力拆成 \`h\` 个并行的子空间。

## §1 直觉

单个 attention 头只能学到 ::concept[一种相似度结构]。

::math
E = mc^2
::

::code{lang=python ref=attention.py#L34-L58}

::card{front="Multi-Head 拆分维度是?" back="d_model = h × d_k"}

::paper{ref=1706.03762 anchor=§3.2.2}`);

    expect(blocks).toEqual([
      { level: 1, text: "Multi-Head Attention", type: "heading" },
      {
        segments: [
          { text: "把单头注意力拆成 `h` 个并行的子空间。", type: "text" },
        ],
        type: "blockquote",
      },
      { level: 2, text: "§1 直觉", type: "heading" },
      {
        segments: [
          { text: "单个 attention 头只能学到 ", type: "text" },
          { text: "一种相似度结构", type: "concept" },
          { text: "。", type: "text" },
        ],
        type: "paragraph",
      },
      { body: "E = mc^2", type: "math" },
      {
        lang: "python",
        ref: "attention.py#L34-L58",
        type: "code",
      },
      {
        back: "d_model = h × d_k",
        front: "Multi-Head 拆分维度是?",
        type: "card",
      },
      {
        anchor: "§3.2.2",
        ref: "1706.03762",
        type: "paper",
      },
    ]);
  });
});

describe("studio draft helpers", () => {
  test("creates a selectable draft with a stable slug", () => {
    expect(createStudioDraft(3, "New Attention Note")).toMatchObject({
      contentType: "Concept",
      id: "draft-4",
      markdown: "# New Attention Note\n\n",
      slug: "new-attention-note",
      status: "draft",
      title: "New Attention Note",
      visibility: "Public",
    });
  });

  test("slugifies editor titles", () => {
    expect(slugifyTitle("Softmax 数值稳定性")).toBe("softmax");
    expect(slugifyTitle("  Multi---Head   Attention  ")).toBe(
      "multi-head-attention",
    );
  });

  test("syncs the top-level markdown title", () => {
    expect(syncMarkdownTitle("# Old Title\n\nbody", "New Title")).toBe(
      "# New Title\n\nbody",
    );
    expect(syncMarkdownTitle("body only", "New Title")).toBe(
      "# New Title\n\nbody only",
    );
  });

  test("adds and removes tags without duplicates", () => {
    expect(addUniqueTag(["attention"], " attention ")).toEqual(["attention"]);
    expect(addUniqueTag(["attention"], "#transformer")).toEqual([
      "attention",
      "transformer",
    ]);
    expect(removeTag(["attention", "transformer"], "attention")).toEqual([
      "transformer",
    ]);
  });

  test("creates relationship, resource, and history records", () => {
    expect(
      createRelationship(2, "implements", "attention.py L34-L58", {
        comment: "math step maps to forward pass",
        source: "scale-1",
        targetKind: "block",
        targetPreview: "return attn @ v",
      }),
    ).toEqual({
      comment: "math step maps to forward pass",
      icon: "≡",
      id: "rel-3",
      rel: "implements",
      source: "scale-1",
      target: "attention.py L34-L58",
      targetKind: "block",
      targetPreview: "return attn @ v",
    });
    expect(createResource(1, "pdf", "Vaswani 2017", "arxiv.org")).toEqual({
      icon: "§",
      id: "res-2",
      kind: "pdf",
      name: "Vaswani 2017",
      source: "arxiv.org",
    });
    expect(
      createStudioHistoryEntry(4, {
        markdown: "# Title",
        summary: "Summary",
        title: "Title",
      }),
    ).toMatchObject({
      id: "version-5",
      label: "刚刚保存",
      markdown: "# Title",
      summary: "Summary",
      title: "Title",
    });
  });

  test("parses arXiv and DOI paper import inputs", () => {
    expect(
      parsePaperReference("https://arxiv.org/abs/1706.03762"),
    ).toMatchObject({
      ref: "1706.03762",
      source: "arxiv",
      title: "arXiv:1706.03762",
    });
    expect(parsePaperReference("10.48550/arXiv.2402.03300")).toMatchObject({
      ref: "10.48550/arXiv.2402.03300",
      source: "doi",
      title: "DOI:10.48550/arXiv.2402.03300",
    });
  });

  test("builds searchable link targets for notes and blocks", () => {
    const currentDraft = {
      ...createStudioDraft(0, "Attention Note"),
      markdown: `# Attention Note

::math{anchor=scale step=B}
qk \\\\
softmax
::

::code{lang=python ref=attention.py#L34-L58 anchor=attention-forward}
return attn @ v
::

::paper{ref=1706.03762 source=arxiv title="Attention Is All You Need" quote="Attention quote" anchor=§3.2.2}`,
    };
    const otherDraft = createStudioDraft(1, "Softmax Note");

    expect(
      buildStudioLinkTargets(currentDraft, [currentDraft, otherDraft]),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "note:attention-note",
          kind: "note",
          label: "Attention Note",
        }),
        expect.objectContaining({
          id: "math:scale-1",
          kind: "block",
          label: "B-01 · scale-1",
        }),
        expect.objectContaining({
          id: "code:attention-forward",
          kind: "block",
          label: "Code · attention.py#L34-L58",
          value: "attention-forward",
        }),
        expect.objectContaining({
          id: "paper:§3.2.2",
          kind: "block",
          label: "Paper · Attention Is All You Need",
        }),
        expect.objectContaining({
          id: "note:softmax-note",
          kind: "note",
          label: "Softmax Note",
        }),
      ]),
    );
  });
});
