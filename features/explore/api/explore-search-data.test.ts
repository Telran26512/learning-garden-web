import { describe, expect, it } from "vitest";

import { exploreViewDataFromP6Search } from "./explore-search-data";

describe("explore P6 search mapper", () => {
  it("maps note search hits into Explore feed cards", () => {
    const viewData = exploreViewDataFromP6Search({
      items: [
        {
          id: "note-1:note",
          kind: "note",
          noteId: "note-1",
          preview: "semantic search over attention blocks",
          score: 0.88,
          similarity: 0.7,
          tags: ["Transformer", "Search"],
          title: "Transformer Embedding Search",
          updatedAt: "2026-05-21T00:00:00Z",
        },
      ],
      total: 1,
    });

    expect(viewData.feedItems[0]).toMatchObject({
      body: "semantic search over attention blocks",
      id: "note-1",
      tags: ["Transformer", "Search"],
      title: "Transformer Embedding Search",
    });
    expect(viewData.tagStats).toEqual([
      ["Transformer", "1"],
      ["Search", "1"],
    ]);
  });
});
