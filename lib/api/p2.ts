import { getAccessToken } from "../auth/session";

type APIEnvelope<T> = {
  data: T | null;
  error: { code: string; message?: string } | null;
  meta?: Record<string, unknown>;
};

export type P2ContentKind = "track" | "note" | "paper" | "experiment";
export type P2Visibility = "private" | "public" | "unlisted";

export type P2ContentItem = {
  body: string;
  createdAt: string;
  id: string;
  kind: P2ContentKind;
  metadata: Record<string, unknown>;
  ownerId: string;
  slug: string;
  status: string;
  summary: string;
  title: string;
  updatedAt: string;
  visibility: P2Visibility;
};

export type P2CreateContentInput = {
  body: string;
  kind: P2ContentKind;
  metadata?: Record<string, unknown>;
  slug: string;
  status: string;
  summary: string;
  title: string;
  visibility: P2Visibility;
};

export type P2Stats = {
  experiments: number;
  notes: number;
  papers: number;
  tracks: number;
};

export type P2PublicProfile = {
  createdAt: string;
  displayName: string;
  handle: string;
  id: string;
  role: string;
  stats: P2Stats;
};

export type P2GraphNode = {
  id: string;
  kind: P2ContentKind;
  title: string;
  visibility: P2Visibility;
};

export type P2GraphEdge = {
  sourceId: string;
  targetId: string;
  type: string;
};

export type P2Graph = {
  edges: P2GraphEdge[];
  nodes: P2GraphNode[];
};

export type P2PortfolioActivityDay = {
  cards: number;
  commits: number;
  count: number;
  date: string;
  notes: number;
};

export type P2BlockDistributionEntry = {
  color: string;
  count: number;
  label: string;
  percent: number;
};

export type P2Portfolio = {
  activity?: P2PortfolioActivityDay[];
  blockDistribution?: P2BlockDistributionEntry[];
  graph: P2Graph;
  items: Record<P2ContentKind, P2ContentItem[]>;
  profile: P2PublicProfile;
  recent: P2CommunityFeedItem[];
  stats: P2Stats;
  topics: Record<string, number>;
};

export type P2CommunityFeedItem = {
  actor?: string;
  createdAt: string;
  id: string;
  kind: P2ContentKind;
  metadata: Record<string, unknown>;
  summary: string;
  title: string;
  type: string;
  updatedAt: string;
};

export type P2CommunityFeed = {
  items: P2CommunityFeedItem[];
  total: number;
};

export async function fetchPortfolio(handle: string) {
  return apiRequest<P2Portfolio>(
    `/api/v1/portfolio/${encodeURIComponent(handle)}`,
  );
}

export async function fetchCommunityFeed(options: { limit?: number } = {}) {
  const params = new URLSearchParams();
  if (options.limit) {
    params.set("limit", String(options.limit));
  }
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<P2CommunityFeed>(`/api/v1/community/feed${suffix}`);
}

export async function createContentItem(input: P2CreateContentInput) {
  return apiRequest<P2ContentItem>("/api/v1/content", {
    body: JSON.stringify(input),
    method: "POST",
  });
}

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(apiURL(path), {
    ...init,
    credentials: "include",
    headers: apiHeaders(),
    method: init.method ?? "GET",
  });
  const envelope = (await response.json()) as APIEnvelope<T>;
  if (!response.ok || !envelope.data) {
    throw new Error(
      envelope.error?.message ?? `P2 request failed (${response.status})`,
    );
  }
  return envelope.data;
}

function apiHeaders() {
  const headers = {
    "Content-Type": "application/json",
  } as Record<string, string>;
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function apiURL(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18080";
  return `${base}${path}`;
}
