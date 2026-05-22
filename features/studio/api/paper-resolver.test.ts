import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearAccessToken, setAccessToken } from "../../../lib/auth/session";

import {
  paperBlockAttrsFromResolvedPaper,
  resolvePaperReference,
} from "./paper-resolver";

describe("paper resolver API", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    clearAccessToken();
  });

  it("resolves arXiv or DOI input through the P3 backend endpoint", async () => {
    setAccessToken("owner-token");
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return jsonResponse({
          data: {
            abstract: "Transformer abstract",
            authors: ["Ashish Vaswani"],
            canonicalKey: "arxiv:1706.03762",
            doiUrl: "",
            id: "arxiv:1706.03762",
            pdfUrl: "https://arxiv.org/pdf/1706.03762.pdf",
            ref: "1706.03762",
            source: "arxiv",
            title: "Attention Is All You Need",
          },
        });
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const paper = await resolvePaperReference(
      "https://arxiv.org/abs/1706.03762",
    );

    expect(paper).toMatchObject({
      abstract: "Transformer abstract",
      canonicalKey: "arxiv:1706.03762",
      ref: "1706.03762",
      source: "arxiv",
      title: "Attention Is All You Need",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/papers/resolve?ref=https%3A%2F%2Farxiv.org%2Fabs%2F1706.03762",
      expect.objectContaining({
        credentials: "include",
        method: "GET",
      }),
    );
    const headers = fetchMock.mock.calls[0]![1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer owner-token");
  });

  it("maps resolved paper metadata into PaperBlock attrs without overwriting an existing quote", () => {
    expect(
      paperBlockAttrsFromResolvedPaper(
        {
          abstract: "Resolved abstract",
          authors: ["Author"],
          canonicalKey: "doi:10.1000/test",
          doiUrl: "https://doi.org/10.1000/test",
          id: "doi:10.1000/test",
          pdfUrl: "",
          ref: "10.1000/test",
          source: "doi",
          title: "Resolved Paper",
        },
        "Existing quote",
      ),
    ).toEqual({
      quote: "Existing quote",
      ref: "10.1000/test",
      source: "doi",
      title: "Resolved Paper",
    });
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
