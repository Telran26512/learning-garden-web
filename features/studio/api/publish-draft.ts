import type { StudioDraft } from "../model/studio-editor-model";
import { saveStudioDraftSnapshot } from "./studio-autosave";
import { studioRequest } from "./studio-request";

export type P3PublishDraftResult = {
  blockLinks: unknown[];
  blocks: unknown[];
  item: {
    id: string;
    status: string;
  };
  papers: unknown[];
};

export async function publishStudioDraft(draft: StudioDraft) {
  await saveStudioDraftSnapshot(draft);

  return studioRequest<P3PublishDraftResult>(
    `/api/v1/studio/drafts/${encodeURIComponent(draft.id)}/publish`,
    {
      method: "POST",
    },
  );
}
