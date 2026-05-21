import { describe, expect, it } from "vitest";

import type { P2CommunityFeed } from "@/lib/api/p2";

import { communityFeedFromP2 } from "../api/community-live-data";

describe("community live data mapper", () => {
  it("maps backend community feed rows into prototype feed cards", () => {
    const feed = communityFeedFromP2({
      items: [
        {
          actor: "Xiaobin Cao",
          createdAt: "2026-05-20T00:00:00Z",
          id: "track-1",
          kind: "track",
          metadata: { notes: 8, papers: 5, tags: ["Transformer"] },
          summary: "从 Q/K/V 到 FlashAttention 的学习路线。",
          title: "Transformer 精读",
          type: "content_published",
          updatedAt: "2026-05-20T00:00:00Z",
        },
        {
          createdAt: "2026-05-20T00:00:00Z",
          id: "note-1",
          kind: "note",
          metadata: { blocks: 3, links: 7, tags: ["math"] },
          summary: "解释 QK^T / sqrt(d_k) 的方差与几何意义。",
          title: "Scaled Dot-Product 的几何直觉",
          type: "content_published",
          updatedAt: "2026-05-20T00:00:00Z",
        },
      ],
      total: 2,
    } satisfies P2CommunityFeed);

    expect(feed).toHaveLength(2);
    expect(feed[0]).toMatchObject({
      author: "Xiaobin Cao",
      kind: "track",
      meta: "8 notes · 5 papers",
      title: "Transformer 精读",
    });
    expect(feed[1]).toMatchObject({
      kind: "note",
      label: "math",
      metrics: ["▲ 7", "↪ 3 blocks", "↗ share"],
    });
  });
});
