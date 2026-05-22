import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearAccessToken, setAccessToken } from "../auth/session";
import {
  createDiscussion,
  decodeNotificationEvent,
  extractNotificationEventPayloads,
  fetchNotifications,
  markNotificationsRead,
} from "./p7";

describe("P7 API client", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    clearAccessToken();
  });

  it("loads notifications with auth and unread filters", async () => {
    setAccessToken("notify-token");
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: {
          items: [],
          total: 0,
          unread: 2,
        },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchNotifications({ limit: 5, unreadOnly: true });

    expect(result.unread).toBe(2);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/notifications?limit=5&unread=true",
      expect.objectContaining({
        credentials: "include",
        headers: expect.objectContaining({
          Authorization: "Bearer notify-token",
        }),
        method: "GET",
      }),
    );
  });

  it("marks notifications read through the P7 endpoint", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ data: { ok: true } }));
    vi.stubGlobal("fetch", fetchMock);

    await markNotificationsRead();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/notifications/read",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("surfaces backend rate limit messages for discussions", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(
        {
          data: null,
          error: { code: "RATE_LIMITED", message: "操作过于频繁，请稍后再试" },
        },
        429,
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      createDiscussion("note-1", { body: "body", title: "title" }),
    ).rejects.toThrow("操作过于频繁");
  });

  it("decodes notification SSE payloads", () => {
    const raw =
      'event: notifications\ndata: {"type":"notifications","unread":1,"items":[{"id":"n1","actorId":"u2","createdAt":"2026-05-21T00:00:00Z","kind":"comment","metadata":{},"userId":"u1"}]}\n\n';

    const { payloads, remainder } = extractNotificationEventPayloads(raw);
    const event = decodeNotificationEvent(payloads[0] ?? "");

    expect(remainder).toBe("");
    expect(event.unread).toBe(1);
    expect(event.items[0]?.kind).toBe("comment");
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
