import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { StudioDraft } from "@/features/studio/model/studio-editor-model";
import { clearAccessToken, setAccessToken } from "../../../lib/auth/session";

import {
  draftToStudioDraftSnapshot,
  fetchStudioDraft,
  studioDraftFromP3Record,
} from "./studio-live-data";

describe("studio live data mapper", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    clearAccessToken();
  });

  it("maps a Studio draft to the P3 studio draft snapshot payload", () => {
    const draft = {
      allowComments: true,
      allowDerivatives: false,
      contentType: "Paper Note",
      history: [],
      id: "draft-1",
      license: "CC BY-SA 4.0",
      markdown: "# GRPO",
      relationships: [],
      resources: [],
      roadmap: {
        stage: "Stage 2 · Deep Learning",
        track: "RLHF",
        week: "W4",
      },
      slug: "grpo",
      status: "published",
      summary: "GRPO reading note",
      tags: ["RLHF", "paper"],
      title: "GRPO",
      updatedAtLabel: "刚刚",
      visibility: "Unlisted",
    } satisfies StudioDraft;

    const draftWithLinks = {
      ...draft,
      relationships: [
        {
          comment: "math step maps to code",
          icon: "≡",
          id: "rel-1",
          rel: "implements",
          source: "scale-1",
          target: "attention-forward",
          targetKind: "block",
          targetPreview: "return attn @ v",
        },
      ],
    } satisfies StudioDraft;

    expect(draftToStudioDraftSnapshot(draftWithLinks)).toEqual({
      allowComments: true,
      allowDerivatives: false,
      contentType: "Paper Note",
      license: "CC BY-SA 4.0",
      markdown: "# GRPO",
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
      resources: [],
      roadmap: draft.roadmap,
      slug: "grpo",
      status: "published",
      summary: "GRPO reading note",
      tags: ["RLHF", "paper"],
      title: "GRPO",
      visibility: "unlisted",
    });
  });

  it("restores a Studio draft from the P3 draft endpoint record", () => {
    const draft = studioDraftFromP3Record({
      createdAt: "2026-05-20T10:00:00Z",
      id: "draft-p3",
      ownerId: "owner-1",
      publishedItemId: "note-1",
      snapshot: {
        allowComments: true,
        allowDerivatives: false,
        contentType: "Concept",
        license: "CC BY-SA 4.0",
        markdown: "# Restored",
        relationships: [
          {
            comment: "math step maps to code",
            rel: "implements",
            source: "scale-1",
            target: "attention-forward",
            targetKind: "block",
            targetPreview: "return attn @ v",
          },
          {
            rel: "cites",
            target: "attention-321",
            targetKind: "note",
          },
        ],
        resources: [
          {
            kind: "code",
            name: "attention.py",
            source: "github · zhe-li/transformer",
          },
        ],
        roadmap: {
          stage: "Stage 2 · Deep Learning",
          track: "Transformer 精读",
          week: "W3 · Transformer 精读",
        },
        slug: "restored",
        status: "draft",
        summary: "restored summary",
        tags: ["attention"],
        title: "Restored",
        visibility: "public",
      },
      updatedAt: "2026-05-21T12:00:00Z",
    });

    expect(draft).toMatchObject({
      allowComments: true,
      allowDerivatives: false,
      contentType: "Concept",
      id: "draft-p3",
      license: "CC BY-SA 4.0",
      markdown: "# Restored",
      roadmap: {
        stage: "Stage 2 · Deep Learning",
        track: "Transformer 精读",
        week: "W3 · Transformer 精读",
      },
      slug: "restored",
      status: "draft",
      summary: "restored summary",
      tags: ["attention"],
      title: "Restored",
      updatedAtLabel: "已从后端恢复",
      visibility: "Public",
    });
    expect(draft.relationships).toEqual([
      {
        comment: "math step maps to code",
        icon: "≡",
        id: "rel-1",
        rel: "implements",
        source: "scale-1",
        target: "attention-forward",
        targetKind: "block",
        targetPreview: "return attn @ v",
      },
      {
        icon: "※",
        id: "rel-2",
        rel: "cites",
        target: "attention-321",
        targetKind: "note",
      },
    ]);
    expect(draft.resources).toEqual([
      {
        icon: ">_",
        id: "res-1",
        kind: "code",
        name: "attention.py",
        source: "github · zhe-li/transformer",
      },
    ]);
  });

  it("fetches a P3 studio draft with auth", async () => {
    setAccessToken("owner-token");
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return jsonResponse({
          data: {
            createdAt: "2026-05-20T10:00:00Z",
            id: "draft-p3",
            ownerId: "owner-1",
            snapshot: {
              allowComments: true,
              allowDerivatives: true,
              contentType: "Concept",
              license: "CC BY-SA 4.0",
              markdown: "# Restored",
              relationships: [],
              resources: [],
              roadmap: {
                stage: "Stage 2 · Deep Learning",
                track: "Transformer 精读",
                week: "W3 · Transformer 精读",
              },
              slug: "restored",
              status: "draft",
              summary: "restored summary",
              tags: [],
              title: "Restored",
              visibility: "public",
            },
            updatedAt: "2026-05-21T12:00:00Z",
          },
        });
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const draft = await fetchStudioDraft("draft-p3");

    expect(draft.title).toBe("Restored");
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/studio/drafts/draft-p3",
      expect.objectContaining({
        credentials: "include",
        method: "GET",
      }),
    );
    const headers = fetchMock.mock.calls[0]![1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer owner-token");
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
