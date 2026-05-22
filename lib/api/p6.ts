import { getAccessToken } from "../auth/session";

type APIEnvelope<T> = {
  data: T | null;
  error: { code: string; message?: string } | null;
  meta?: Record<string, unknown>;
};

export type P6SearchKind = "block" | "note";

export type P6SearchHit = {
  blockId?: string;
  blockKind?: string;
  id: string;
  kind: P6SearchKind;
  noteId: string;
  preview: string;
  score: number;
  similarity: number;
  tags: string[];
  title: string;
  updatedAt: string;
};

export type P6SearchResult = {
  items: P6SearchHit[];
  total: number;
};

export async function fetchSearch(
  options: {
    kind?: P6SearchKind;
    limit?: number;
    query?: string;
    tag?: string;
  } = {},
) {
  const params = new URLSearchParams();
  if (options.query) params.set("q", options.query);
  if (options.tag) params.set("tag", options.tag);
  if (options.kind) params.set("kind", options.kind);
  if (options.limit) params.set("limit", String(options.limit));
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<P6SearchResult>(`/api/v1/search${suffix}`);
}

export async function fetchRelatedContent(
  contentId: string,
  options: { limit?: number } = {},
) {
  const params = new URLSearchParams();
  if (options.limit) params.set("limit", String(options.limit));
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<P6SearchResult>(
    `/api/v1/content/${encodeURIComponent(contentId)}/related${suffix}`,
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
      envelope.error?.message ?? `P6 request failed (${response.status})`,
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
