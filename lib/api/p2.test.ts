import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearAccessToken, setAccessToken } from "../auth/session";

import { createContentItem, fetchCommunityFeed, fetchPortfolio } from "./p2";

describe("P2 API client", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    clearAccessToken();
  });

  it("loads portfolio data from the P2 backend endpoint", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          graph: { edges: [], nodes: [] },
          items: { experiment: [], note: [], paper: [], track: [] },
          profile: {
            createdAt: "2026-05-20T00:00:00Z",
            displayName: "Xiaobin Cao",
            handle: "xiaobin-cao",
            id: "user-1",
            role: "user",
            stats: { experiments: 0, notes: 1, papers: 0, tracks: 1 },
          },
          recent: [],
          stats: { experiments: 0, notes: 1, papers: 0, tracks: 1 },
          topics: { Transformer: 2 },
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const portfolio = await fetchPortfolio("xiaobin-cao");

    expect(portfolio.profile.displayName).toBe("Xiaobin Cao");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/portfolio/xiaobin-cao",
      expect.objectContaining({ credentials: "include", method: "GET" }),
    );
  });

  it("includes the access token when loading community feed", async () => {
    setAccessToken("access-token");
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          items: [
            {
              createdAt: "2026-05-20T00:00:00Z",
              id: "note-1",
              kind: "note",
              metadata: { tags: ["math"] },
              summary: "Variance intuition",
              title: "Why sqrt(d_k)?",
              type: "content_published",
              updatedAt: "2026-05-20T00:00:00Z",
            },
          ],
          total: 1,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const feed = await fetchCommunityFeed({ limit: 12 });

    expect(feed.items).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/community/feed?limit=12",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      }),
    );
  });

  it("throws backend error messages for failed P2 responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          {
            data: null,
            error: { code: "NOT_FOUND", message: "user not found" },
          },
          404,
        ),
      ),
    );

    await expect(fetchPortfolio("missing")).rejects.toThrow("user not found");
  });

  it("creates owner content with authorization", async () => {
    setAccessToken("owner-token");
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          body: "# Multi-Head Attention",
          createdAt: "2026-05-20T00:00:00Z",
          id: "content-1",
          kind: "note",
          metadata: { tags: ["attention"] },
          ownerId: "user-1",
          slug: "multi-head-attention",
          status: "published",
          summary: "Attention note",
          title: "Multi-Head Attention",
          updatedAt: "2026-05-20T00:00:00Z",
          visibility: "public",
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const item = await createContentItem({
      body: "# Multi-Head Attention",
      kind: "note",
      metadata: { tags: ["attention"] },
      slug: "multi-head-attention",
      status: "published",
      summary: "Attention note",
      title: "Multi-Head Attention",
      visibility: "public",
    });

    expect(item.id).toBe("content-1");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/content",
      expect.objectContaining({
        body: JSON.stringify({
          body: "# Multi-Head Attention",
          kind: "note",
          metadata: { tags: ["attention"] },
          slug: "multi-head-attention",
          status: "published",
          summary: "Attention note",
          title: "Multi-Head Attention",
          visibility: "public",
        }),
        headers: expect.objectContaining({
          Authorization: "Bearer owner-token",
        }),
        method: "POST",
      }),
    );
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
