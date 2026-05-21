import { createContentItem } from "@/lib/api/p2";

import type { StudioDraft } from "../model/studio-editor-model";
import { draftToCreateContentInput } from "./studio-live-data";

export function publishStudioDraft(draft: StudioDraft) {
  return createContentItem(draftToCreateContentInput(draft));
}
