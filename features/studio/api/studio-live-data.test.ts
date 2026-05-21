import { describe, expect, it } from "vitest";

import type { StudioDraft } from "@/features/studio/model/studio-editor-model";

import { draftToCreateContentInput } from "./studio-live-data";

describe("studio live data mapper", () => {
  it("maps a Studio draft to the P2 content create payload", () => {
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

    expect(draftToCreateContentInput(draft)).toEqual({
      body: "# GRPO",
      kind: "paper",
      metadata: {
        allowComments: true,
        allowDerivatives: false,
        contentType: "Paper Note",
        license: "CC BY-SA 4.0",
        roadmap: draft.roadmap,
        tags: ["RLHF", "paper"],
      },
      slug: "grpo",
      status: "published",
      summary: "GRPO reading note",
      title: "GRPO",
      visibility: "unlisted",
    });
  });
});
