import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearAccessToken, setAccessToken } from "../auth/session";
import { fetchRelatedContent, fetchSearch } from "./p6";

describe("P6 API client", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    clearAccessToken();
  });

  it("calls the hybrid search endpoint with keyword, tag and kind filters", async () => {
    setAccessToken("search-token");
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          items: [
            {
              blockId: "attention-forward",
              blockKind: "code",
              id: "note-1:block:attention-forward",
              kind: "block",
              noteId: "note-1",
              preview: "return softmax(scores) @ v",
              score: 0.91,
              similarity: 0.82,
              tags: ["Transformer"],
              title: "Code · attention.py",
              updatedAt: "2026-05-21T00:00:00Z",
            },
          ],
          total: 1,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchSearch({
      kind: "block",
      limit: 8,
      query: "attention forward",
      tag: "Transformer",
    });

    expect(result.items[0]?.blockId).toBe("attention-forward");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/search?q=attention+forward&tag=Transformer&kind=block&limit=8",
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({
          Authorization: "Bearer search-token",
        }),
        method: "GET",
      }),
    );
  });

  it("loads related note and block recommendations for a reading page", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          items: [],
          total: 0,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchRelatedContent("note-1", { limit: 6 });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/content/note-1/related?limit=6",
      expect.objectContaining({ credentials: "include", method: "GET" }),
    );
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
