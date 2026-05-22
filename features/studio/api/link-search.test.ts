import { describe, expect, it } from "vitest";

import { studioLinkTargetsFromSearch } from "./link-search";

describe("studio link search", () => {
  it("maps P6 search hits into Link dialog targets", () => {
    const targets = studioLinkTargetsFromSearch({
      items: [
        {
          blockId: "attention-forward",
          blockKind: "code",
          id: "note-1:block:attention-forward",
          kind: "block",
          noteId: "note-1",
          preview: "return softmax(scores) @ v",
          score: 0.9,
          similarity: 0.8,
          tags: ["Transformer"],
          title: "Code · attention.py",
          updatedAt: "2026-05-21T00:00:00Z",
        },
      ],
      total: 1,
    });

    expect(targets).toEqual([
      {
        id: "remote:note-1:block:attention-forward",
        kind: "block",
        label: "Code · attention.py",
        preview: "return softmax(scores) @ v",
        value: "attention-forward",
      },
    ]);
  });
});
