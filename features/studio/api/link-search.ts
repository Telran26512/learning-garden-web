import { fetchSearch, type P6SearchResult } from "../../../lib/api/p6";

import type { StudioLinkTarget } from "../model/studio-editor-model";

export async function searchStudioLinkTargets(query: string) {
  const result = await fetchSearch({
    limit: 12,
    query,
  });
  return studioLinkTargetsFromSearch(result);
}

export function studioLinkTargetsFromSearch(
  result: P6SearchResult,
): StudioLinkTarget[] {
  return result.items.map((hit) => ({
    id: `remote:${hit.id}`,
    kind: hit.kind === "block" ? "block" : "note",
    label: hit.title,
    preview: hit.preview,
    value: hit.kind === "block" ? (hit.blockId ?? hit.id) : hit.noteId,
  }));
}
