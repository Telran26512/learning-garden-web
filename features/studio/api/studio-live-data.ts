import type { P2CreateContentInput, P2ContentKind } from "@/lib/api/p2";
import type {
  StudioContentType,
  StudioDraft,
  StudioVisibility,
} from "@/features/studio/model/studio-editor-model";

export function draftToCreateContentInput(
  draft: StudioDraft,
): P2CreateContentInput {
  return {
    body: draft.markdown,
    kind: contentKind(draft.contentType),
    metadata: {
      allowComments: draft.allowComments,
      allowDerivatives: draft.allowDerivatives,
      contentType: draft.contentType,
      license: draft.license,
      roadmap: draft.roadmap,
      tags: draft.tags,
    },
    slug: draft.slug,
    status: draft.status,
    summary: draft.summary,
    title: draft.title,
    visibility: visibility(draft.visibility),
  };
}

function contentKind(contentType: StudioContentType): P2ContentKind {
  switch (contentType) {
    case "Paper Note":
      return "paper";
    case "Experiment":
      return "experiment";
    default:
      return "note";
  }
}

function visibility(value: StudioVisibility) {
  switch (value) {
    case "Public":
      return "public";
    case "Unlisted":
      return "unlisted";
    default:
      return "private";
  }
}
