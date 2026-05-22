import type { StudioDraft } from "../model/studio-editor-model";
import {
  draftToStudioDraftSnapshot,
  type P3StudioDraftSnapshot,
} from "./studio-live-data";
import { studioRequest } from "./studio-request";

export const STUDIO_AUTOSAVE_DELAY_MS = 1500;

type SaveStudioDraftSnapshotOptions = {
  persist?: (draftId: string, snapshot: P3StudioDraftSnapshot) => Promise<void>;
};

export async function saveStudioDraftSnapshot(
  draft: StudioDraft,
  options: SaveStudioDraftSnapshotOptions = {},
) {
  const snapshot = draftToStudioDraftSnapshot(draft);
  const persist = options.persist ?? persistStudioDraftSnapshot;

  await persist(draft.id, snapshot);
}

export async function persistStudioDraftSnapshot(
  draftId: string,
  snapshot: P3StudioDraftSnapshot,
) {
  await studioRequest(`/api/v1/studio/drafts/${encodeURIComponent(draftId)}`, {
    body: JSON.stringify(snapshot),
    method: "PUT",
  });
}
