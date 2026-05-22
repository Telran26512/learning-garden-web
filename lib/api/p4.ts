import { getAccessToken } from "../auth/session";
import type { P2ContentItem, P2Graph, P2PublicProfile } from "./p2";

type APIEnvelope<T> = {
  data: T | null;
  error: { code: string; message?: string } | null;
  meta?: Record<string, unknown>;
};

export type P4EngagementCounts = {
  bookmarks: number;
  comments: number;
  likes: number;
  shares: number;
  views: number;
};

export type P4ViewerState = {
  bookmarked: boolean;
  following: boolean;
  liked: boolean;
};

export type P4ExploreItem = {
  author?: P2PublicProfile;
  counts: P4EngagementCounts;
  item: P2ContentItem;
  score: number;
  tags: string[];
};

export type P4TagSummary = {
  count: number;
  tag: string;
};

export type P4ExploreResult = {
  items: P4ExploreItem[];
  tags: P4TagSummary[];
  total: number;
};

export type P4Comment = {
  authorHandle: string;
  authorId: string;
  authorName: string;
  body: string;
  contentId: string;
  createdAt: string;
  id: string;
  updatedAt: string;
};

export type P4ContentReference = {
  item: P2ContentItem;
  relation: {
    createdAt: string;
    sourceId: string;
    targetId: string;
    type: string;
  };
};

export type P4Backlink = {
  relation: P4ContentReference["relation"];
  source: P2ContentItem;
};

export type P4ReadingDocument = {
  author: P2PublicProfile;
  document: {
    blockLinks: unknown[];
    blocks: unknown[];
    citedBy: P4Backlink[];
    cites: P4ContentReference[];
    comments: P4Comment[];
    counts: P4EngagementCounts;
    item: P2ContentItem;
    papers: unknown[];
    toc: { id: string; level: number; title: string }[];
    viewer: P4ViewerState;
  };
};

export async function fetchExplore(
  options: {
    limit?: number;
    range?: string;
    tab?: string;
    tag?: string;
  } = {},
) {
  const params = new URLSearchParams();
  if (options.limit) params.set("limit", String(options.limit));
  if (options.range) params.set("range", options.range);
  if (options.tab) params.set("tab", options.tab.toLowerCase());
  if (options.tag) params.set("tag", options.tag);
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<P4ExploreResult>(`/api/v1/explore${suffix}`);
}

export async function fetchReadingDocument(id: string) {
  return apiRequest<P4ReadingDocument>(
    `/api/v1/content/${encodeURIComponent(id)}/reading`,
  );
}

export async function fetchNoteGraph(
  options: {
    handle?: string;
    limit?: number;
  } = {},
) {
  const params = new URLSearchParams();
  params.set("kind", "note");
  if (options.handle) params.set("handle", options.handle);
  if (options.limit) params.set("limit", String(options.limit));
  return apiRequest<P2Graph>(`/api/v1/graph?${params.toString()}`);
}

export async function followUser(handle: string) {
  return apiRequest<{ following: boolean; profile: P2PublicProfile }>(
    `/api/v1/users/${encodeURIComponent(handle)}/follow`,
    { method: "POST" },
  );
}

export async function unfollowUser(handle: string) {
  return apiRequest<{ following: boolean; profile: P2PublicProfile }>(
    `/api/v1/users/${encodeURIComponent(handle)}/follow`,
    { method: "DELETE" },
  );
}

export async function addComment(contentId: string, body: string) {
  return apiRequest<P4Comment>(
    `/api/v1/content/${encodeURIComponent(contentId)}/comments`,
    {
      body: JSON.stringify({ body }),
      method: "POST",
    },
  );
}

export async function likeContent(contentId: string, active: boolean) {
  return apiRequest<P4EngagementCounts>(
    `/api/v1/content/${encodeURIComponent(contentId)}/like`,
    { method: active ? "POST" : "DELETE" },
  );
}

export async function bookmarkContent(contentId: string, active: boolean) {
  return apiRequest<P4EngagementCounts>(
    `/api/v1/content/${encodeURIComponent(contentId)}/bookmark`,
    { method: active ? "POST" : "DELETE" },
  );
}

export async function shareContent(contentId: string) {
  return apiRequest<P4EngagementCounts>(
    `/api/v1/content/${encodeURIComponent(contentId)}/share`,
    { method: "POST" },
  );
}

export async function recordView(contentId: string) {
  return apiRequest<P4EngagementCounts>(
    `/api/v1/content/${encodeURIComponent(contentId)}/view`,
    { method: "POST" },
  );
}

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(apiURL(path), {
    ...init,
    credentials: "include",
    headers: apiHeaders(init.headers),
    method: init.method ?? "GET",
  });
  const envelope = (await response.json()) as APIEnvelope<T>;
  if (!response.ok || !envelope.data) {
    throw new Error(
      envelope.error?.message ?? `P4 request failed (${response.status})`,
    );
  }
  return envelope.data;
}

function apiHeaders(headers?: HeadersInit) {
  const out = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  } as Record<string, string>;
  const token = getAccessToken();
  if (token) {
    out.Authorization = `Bearer ${token}`;
  }
  return out;
}

function apiURL(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18080";
  return `${base}${path}`;
}
