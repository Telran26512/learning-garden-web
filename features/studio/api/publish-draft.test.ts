import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearAccessToken, setAccessToken } from "../../../lib/auth/session";
import { createStudioDraft } from "../model/studio-editor-model";
import { publishStudioDraft } from "./publish-draft";

describe("studio publish", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    clearAccessToken();
  });

  it("saves the latest draft and publishes through the P3 draft endpoint", async () => {
    setAccessToken("owner-token");
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void init;
        const url = String(input);

        if (url.endsWith("/api/v1/studio/drafts/draft-1")) {
          return jsonResponse({ data: { id: "draft-1", snapshot: {} } });
        }

        if (url.endsWith("/api/v1/studio/drafts/draft-1/publish")) {
          return jsonResponse(
            {
              data: {
                blockLinks: [],
                blocks: [],
                item: { id: "note-1", status: "published" },
                papers: [],
              },
            },
            201,
          );
        }

        return jsonResponse(
          {
            data: null,
            error: { code: "UNEXPECTED", message: url },
          },
          500,
        );
      },
    );
    vi.stubGlobal("fetch", fetchMock);
    const draft = {
      ...createStudioDraft(0, "Publish Note"),
      status: "published" as const,
    };

    const result = await publishStudioDraft(draft);

    expect(result.item.id).toBe("note-1");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://api.test/api/v1/studio/drafts/draft-1",
    );
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        method: "PUT",
      }),
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "http://api.test/api/v1/studio/drafts/draft-1/publish",
    );
    expect(fetchMock.mock.calls[1][1]).toEqual(
      expect.objectContaining({
        method: "POST",
      }),
    );
    const publishHeaders = fetchMock.mock.calls[1]![1]?.headers as Headers;
    expect(publishHeaders.get("Authorization")).toBe("Bearer owner-token");
    expect(fetchMock.mock.calls.map(([url]) => String(url))).not.toContain(
      "http://api.test/api/v1/content",
    );
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
