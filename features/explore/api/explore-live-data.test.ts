import { describe, expect, test } from "vitest";

import { exploreViewDataFromP4 } from "./explore-live-data";

describe("explore P4 live data mapper", () => {
  test("maps public note rows with counts and tag summaries", () => {
    const viewData = exploreViewDataFromP4({
      items: [
        {
          counts: {
            bookmarks: 1,
            comments: 2,
            likes: 3,
            shares: 4,
            views: 20,
          },
          item: {
            body: "body",
            createdAt: "2026-05-20T12:00:00Z",
            id: "note-1",
            kind: "note",
            metadata: {
              author: "Xiaobin Cao",
              handle: "xiaobin-cao",
              track: "Transformer 精读",
            },
            ownerId: "owner-1",
            slug: "note-1",
            status: "published",
            summary: "summary",
            title: "Public Note",
            updatedAt: "2026-05-21T12:00:00Z",
            visibility: "public",
          },
          author: {
            createdAt: "2026-05-01T00:00:00Z",
            displayName: "Backend Author",
            handle: "backend-author",
            id: "owner-1",
            role: "member",
            stats: { experiments: 0, notes: 1, papers: 0, tracks: 0 },
          },
          score: 29,
          tags: ["Transformer", "P4"],
        },
      ],
      tags: [{ count: 2, tag: "Transformer" }],
      total: 1,
    });

    expect(viewData.feedItems[0]).toMatchObject({
      author: "Backend Author",
      comments: 2,
      handle: "@backend-author",
      id: "note-1",
      tags: ["Transformer", "P4"],
      title: "Public Note",
      votes: 3,
      views: 20,
    });
    expect(viewData.tagStats).toEqual([["Transformer", "2"]]);
  });
});
