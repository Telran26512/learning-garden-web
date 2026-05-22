import { getAccessToken } from "../auth/session";

type APIEnvelope<T> = {
  data: T | null;
  error: { code: string; message?: string } | null;
  meta?: Record<string, unknown>;
};

export type P7NotificationKind =
  | "comment"
  | "discussion"
  | "follow"
  | "mention"
  | "reaction";

export type P7Notification = {
  actorHandle?: string;
  actorId: string;
  actorName?: string;
  commentId?: string;
  contentId?: string;
  createdAt: string;
  discussionId?: string;
  id: string;
  kind: P7NotificationKind;
  metadata: Record<string, unknown>;
  readAt?: string;
  userId: string;
};

export type P7NotificationResult = {
  items: P7Notification[];
  total: number;
  unread: number;
};

export type P7NotificationEvent = {
  items: P7Notification[];
  type: "notifications";
  unread: number;
};

export type P7Discussion = {
  authorHandle: string;
  authorId: string;
  authorName: string;
  body: string;
  contentId: string;
  createdAt: string;
  id: string;
  title: string;
  updatedAt: string;
};

export async function fetchNotifications(
  options: { limit?: number; unreadOnly?: boolean } = {},
) {
  const params = new URLSearchParams();
  if (options.limit) params.set("limit", String(options.limit));
  if (options.unreadOnly) params.set("unread", "true");
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<P7NotificationResult>(`/api/v1/notifications${suffix}`);
}

export async function markNotificationsRead() {
  return apiRequest<{ ok: boolean }>("/api/v1/notifications/read", {
    method: "POST",
  });
}

export async function fetchDiscussions(contentId: string) {
  return apiRequest<{ items: P7Discussion[]; total: number }>(
    `/api/v1/content/${encodeURIComponent(contentId)}/discussions`,
  );
}

export async function createDiscussion(
  contentId: string,
  input: { body: string; title: string },
) {
  return apiRequest<P7Discussion>(
    `/api/v1/content/${encodeURIComponent(contentId)}/discussions`,
    {
      body: JSON.stringify(input),
      method: "POST",
    },
  );
}

export function connectNotificationEvents({
  onError,
  onEvent,
}: {
  onError?: (error: Error) => void;
  onEvent: (event: P7NotificationEvent) => void;
}) {
  const controller = new AbortController();
  void readNotificationEvents(controller.signal, onEvent, onError);
  return {
    close: () => controller.abort(),
  };
}

export function decodeNotificationEvent(payload: string): P7NotificationEvent {
  const parsed = JSON.parse(payload) as Partial<P7NotificationEvent>;
  if (parsed.type !== "notifications") {
    throw new Error("Unsupported notification event");
  }
  return {
    items: Array.isArray(parsed.items) ? parsed.items : [],
    type: "notifications",
    unread: typeof parsed.unread === "number" ? parsed.unread : 0,
  };
}

export function extractNotificationEventPayloads(input: string) {
  const chunks = input.split(/\r?\n\r?\n/u);
  const remainder = chunks.pop() ?? "";
  const payloads = chunks
    .map((chunk) =>
      chunk
        .split(/\r?\n/u)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.replace(/^data:\s?/u, ""))
        .join("\n"),
    )
    .filter(Boolean);
  return { payloads, remainder };
}

async function readNotificationEvents(
  signal: AbortSignal,
  onEvent: (event: P7NotificationEvent) => void,
  onError?: (error: Error) => void,
) {
  try {
    const response = await fetch(apiURL("/api/v1/events"), {
      credentials: "include",
      headers: apiHeaders({ Accept: "text/event-stream" }),
      method: "GET",
      signal,
    });
    if (!response.ok || !response.body) {
      throw new Error(`Notification stream failed (${response.status})`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const { payloads, remainder } = extractNotificationEventPayloads(buffer);
      buffer = remainder;
      for (const payload of payloads) {
        onEvent(decodeNotificationEvent(payload));
      }
    }
  } catch (error) {
    if (!signal.aborted) {
      onError?.(error instanceof Error ? error : new Error("SSE failed"));
    }
  }
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
      envelope.error?.message ?? `P7 request failed (${response.status})`,
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
