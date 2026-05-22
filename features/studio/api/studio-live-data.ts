import type {
  StudioContentType,
  StudioDraft,
  StudioDraftStatus,
  StudioRelationship,
  StudioResource,
  StudioResourceKind,
  StudioRoadmap,
  StudioRelationType,
  StudioVisibility,
} from "@/features/studio/model/studio-editor-model";
import {
  createRelationship,
  createResource,
  createStudioDraft,
} from "../model/studio-editor-model";

import { studioRequest } from "./studio-request";

export type P3Visibility = "private" | "public" | "unlisted";

export type P3StudioRelationship = Omit<StudioRelationship, "icon" | "id">;

export type P3StudioResource = Omit<StudioResource, "icon" | "id">;

export type P3StudioDraftSnapshot = {
  allowComments: boolean;
  allowDerivatives: boolean;
  contentType: StudioContentType;
  license: string;
  markdown: string;
  relationships: P3StudioRelationship[];
  resources: P3StudioResource[];
  roadmap: StudioDraft["roadmap"];
  slug: string;
  status: StudioDraft["status"];
  summary: string;
  tags: string[];
  title: string;
  visibility: P3Visibility;
};

export type P3StudioDraftRecord = {
  createdAt: string;
  id: string;
  ownerId: string;
  publishedItemId?: string;
  snapshot: P3StudioDraftSnapshot;
  updatedAt: string;
};

export async function fetchStudioDraft(draftId: string): Promise<StudioDraft> {
  const record = await studioRequest<P3StudioDraftRecord>(
    `/api/v1/studio/drafts/${encodeURIComponent(draftId)}`,
  );

  return studioDraftFromP3Record(record);
}

export function studioDraftFromP3Record(
  record: P3StudioDraftRecord,
  fallback: StudioDraft = createStudioDraft(0),
): StudioDraft {
  const snapshot = record.snapshot;

  return {
    allowComments: snapshot.allowComments ?? fallback.allowComments,
    allowDerivatives: snapshot.allowDerivatives ?? fallback.allowDerivatives,
    contentType: normalizeContentType(
      snapshot.contentType,
      fallback.contentType,
    ),
    history: fallback.history,
    id: record.id || fallback.id,
    license: snapshot.license || fallback.license,
    markdown: snapshot.markdown ?? fallback.markdown,
    relationships: (snapshot.relationships ?? []).map((relationship, index) =>
      createRelationship(
        index,
        normalizeRelation(relationship.rel),
        relationship.target,
        {
          ...(relationship.comment ? { comment: relationship.comment } : {}),
          ...(relationship.source ? { source: relationship.source } : {}),
          ...(relationship.targetKind
            ? { targetKind: relationship.targetKind }
            : {}),
          ...(relationship.targetPreview
            ? { targetPreview: relationship.targetPreview }
            : {}),
        },
      ),
    ),
    resources: (snapshot.resources ?? []).map((resource, index) =>
      createResource(
        index,
        normalizeResourceKind(resource.kind),
        resource.name,
        resource.source,
      ),
    ),
    roadmap: normalizeRoadmap(snapshot.roadmap, fallback.roadmap),
    slug: snapshot.slug || fallback.slug,
    status: normalizeStatus(snapshot.status, fallback.status),
    summary: snapshot.summary ?? fallback.summary,
    tags: snapshot.tags ?? fallback.tags,
    title: snapshot.title || fallback.title,
    updatedAtLabel: "已从后端恢复",
    visibility: visibilityFromP3(snapshot.visibility),
  };
}

export function draftToStudioDraftSnapshot(
  draft: StudioDraft,
): P3StudioDraftSnapshot {
  return {
    allowComments: draft.allowComments,
    allowDerivatives: draft.allowDerivatives,
    contentType: draft.contentType,
    license: draft.license,
    markdown: draft.markdown,
    relationships: draft.relationships.map(toP3Relationship),
    resources: draft.resources.map(toP3Resource),
    roadmap: draft.roadmap,
    slug: draft.slug,
    status: draft.status,
    summary: draft.summary,
    tags: draft.tags,
    title: draft.title,
    visibility: visibility(draft.visibility),
  };
}

function toP3Relationship({
  comment,
  rel,
  source,
  target,
  targetKind,
  targetPreview,
}: StudioRelationship): P3StudioRelationship {
  return {
    ...(comment ? { comment } : {}),
    rel,
    ...(source ? { source } : {}),
    target,
    ...(targetKind ? { targetKind } : {}),
    ...(targetPreview ? { targetPreview } : {}),
  };
}

function toP3Resource({
  kind,
  name,
  source,
}: StudioResource): P3StudioResource {
  return { kind, name, source };
}

function visibility(value: StudioVisibility): P3Visibility {
  switch (value) {
    case "Public":
      return "public";
    case "Unlisted":
      return "unlisted";
    default:
      return "private";
  }
}

function visibilityFromP3(value: P3Visibility): StudioVisibility {
  switch (value) {
    case "public":
      return "Public";
    case "unlisted":
      return "Unlisted";
    default:
      return "Private";
  }
}

function normalizeContentType(
  value: StudioContentType,
  fallback: StudioContentType,
): StudioContentType {
  return ["Concept", "Paper Note", "Experiment", "Journal"].includes(value)
    ? value
    : fallback;
}

function normalizeRelation(value: StudioRelationType): StudioRelationType {
  return ["derives_from", "implements", "cites"].includes(value)
    ? value
    : "derives_from";
}

function normalizeResourceKind(value: StudioResourceKind): StudioResourceKind {
  return ["code", "pdf", "notebook"].includes(value) ? value : "code";
}

function normalizeRoadmap(
  value: StudioDraft["roadmap"],
  fallback: StudioRoadmap,
): StudioRoadmap {
  return {
    stage: value?.stage || fallback.stage,
    track: value?.track || fallback.track,
    week: value?.week || fallback.week,
  };
}

function normalizeStatus(
  value: StudioDraftStatus,
  fallback: StudioDraftStatus,
): StudioDraftStatus {
  return value === "published" || value === "draft" ? value : fallback;
}
