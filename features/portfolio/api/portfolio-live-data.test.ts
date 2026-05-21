import { describe, expect, it } from "vitest";

import type { P2Portfolio } from "@/lib/api/p2";

import { portfolioViewDataFromP2 } from "../api/portfolio-live-data";

describe("portfolio live data mapper", () => {
  it("maps P2 portfolio content into the existing portfolio view model", () => {
    const view = portfolioViewDataFromP2({
      graph: {
        edges: [
          { sourceId: "note-1", targetId: "track-1", type: "belongs_to" },
        ],
        nodes: [
          {
            id: "track-1",
            kind: "track",
            title: "Transformer 精读",
            visibility: "public",
          },
          {
            id: "note-1",
            kind: "note",
            title: "Scaled Dot-Product 的几何直觉",
            visibility: "public",
          },
        ],
      },
      items: {
        experiment: [],
        note: [
          {
            body: "把 Q 和 K 看作查询向量与键向量。",
            createdAt: "2026-05-19T00:00:00Z",
            id: "note-1",
            kind: "note",
            metadata: { blocks: 3, links: 7, tags: ["math", "Transformer"] },
            ownerId: "user-1",
            slug: "scaled-dot-product",
            status: "published",
            summary: "解释 QK^T / sqrt(d_k) 的方差与几何意义。",
            title: "Scaled Dot-Product 的几何直觉",
            updatedAt: "2026-05-20T00:00:00Z",
            visibility: "public",
          },
        ],
        paper: [],
        track: [
          {
            body: "track body",
            createdAt: "2026-05-18T00:00:00Z",
            id: "track-1",
            kind: "track",
            metadata: {
              blocks: 24,
              links: 31,
              notes: 8,
              papers: 5,
              progress: 100,
              reach: "412↑",
              tags: ["Transformer"],
            },
            ownerId: "user-1",
            slug: "transformer-reading",
            status: "shipped",
            summary: "从 Q/K/V 到 FlashAttention 的学习路线。",
            title: "Transformer 精读",
            updatedAt: "2026-05-20T00:00:00Z",
            visibility: "public",
          },
        ],
      },
      profile: {
        createdAt: "2026-05-01T00:00:00Z",
        displayName: "Xiaobin Cao",
        handle: "xiaobin-cao",
        id: "user-1",
        role: "user",
        stats: { experiments: 0, notes: 1, papers: 0, tracks: 1 },
      },
      recent: [],
      stats: { experiments: 0, notes: 1, papers: 0, tracks: 1 },
      topics: { Transformer: 2, math: 1 },
    } satisfies P2Portfolio);

    expect(view.profile.name).toBe("Xiaobin Cao");
    expect(view.profile.handle).toBe("@xiaobin-cao");
    expect(view.tracks[0]).toMatchObject({
      blocks: 24,
      notes: 8,
      progress: 100,
      title: "Transformer 精读",
    });
    expect(view.notes[0]).toMatchObject({
      blocks: "3 blocks",
      kind: "math",
      links: "7 links",
      title: "Scaled Dot-Product 的几何直觉",
    });
    expect(view.graphEdges).toEqual([["note-1", "track-1"]]);
    expect(view.topTopics[0]).toEqual(["Transformer", 2]);
  });
});
