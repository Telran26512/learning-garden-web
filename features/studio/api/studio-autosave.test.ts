import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createRelationship,
  createResource,
  createStudioDraft,
} from "../model/studio-editor-model";
import { clearAccessToken, setAccessToken } from "../../../lib/auth/session";
import {
  STUDIO_AUTOSAVE_DELAY_MS,
  saveStudioDraftSnapshot,
} from "./studio-autosave";

describe("studio autosave", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    clearAccessToken();
  });

  it("uses a 1.5 second debounce window", () => {
    expect(STUDIO_AUTOSAVE_DELAY_MS).toBe(1500);
  });

  it("surfaces backend autosave failures", async () => {
    await expect(
      saveStudioDraftSnapshot(createStudioDraft(0), {
        persist: async () => {
          throw new Error("backend unavailable");
        },
      }),
    ).rejects.toThrow("backend unavailable");
  });

  it("persists a snapshot through the configured adapter", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const draft = createStudioDraft(0, "Autosave Note");

    await saveStudioDraftSnapshot(draft, { persist });

    expect(persist).toHaveBeenCalledWith(
      "draft-1",
      expect.objectContaining({
        markdown: "# Autosave Note\n\n",
        title: "Autosave Note",
      }),
    );
  });

  it("defaults autosave to the P3 draft endpoint", async () => {
    setAccessToken("owner-token");
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return jsonResponse({
          data: {
            id: "draft-1",
            snapshot: {},
          },
        });
      },
    );
    vi.stubGlobal("fetch", fetchMock);
    const draft = {
      ...createStudioDraft(0, "Autosave Note"),
      relationships: [
        createRelationship(0, "implements", "attention-forward", {
          comment: "math step maps to code",
          source: "scale-1",
          targetKind: "block",
          targetPreview: "return attn @ v",
        }),
      ],
      resources: [
        createResource(
          0,
          "code",
          "attention.py",
          "github · zhe-li/transformer",
        ),
      ],
      visibility: "Unlisted" as const,
    };

    await saveStudioDraftSnapshot(draft);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/studio/drafts/draft-1",
      expect.objectContaining({
        credentials: "include",
        method: "PUT",
      }),
    );
    const [, init] = fetchMock.mock.calls[0]!;
    const headers = init?.headers as Headers;
    const payload = JSON.parse(String(init?.body));

    expect(headers.get("Authorization")).toBe("Bearer owner-token");
    expect(headers.get("Content-Type")).toBe("application/json");

    expect(payload).toMatchObject({
      markdown: "# Autosave Note\n\n",
      relationships: [
        {
          comment: "math step maps to code",
          rel: "implements",
          source: "scale-1",
          target: "attention-forward",
          targetKind: "block",
          targetPreview: "return attn @ v",
        },
      ],
      resources: [
        {
          kind: "code",
          name: "attention.py",
          source: "github · zhe-li/transformer",
        },
      ],
      title: "Autosave Note",
      visibility: "unlisted",
    });
    expect(payload).not.toHaveProperty("id");
    expect(payload.relationships[0]).not.toHaveProperty("icon");
    expect(payload.resources[0]).not.toHaveProperty("icon");
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
