import { describe, expect, test } from "vitest";

import {
  addUniqueTag,
  createRelationship,
  createResource,
  createStudioDraft,
  createStudioHistoryEntry,
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
    expect(createRelationship(2, "implements", "attention.py L34-L58")).toEqual(
      {
        icon: "≡",
        id: "rel-3",
        rel: "implements",
        target: "attention.py L34-L58",
      },
    );
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
});
