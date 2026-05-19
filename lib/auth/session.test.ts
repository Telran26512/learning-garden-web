import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearAccessToken,
  getAccessToken,
  logout,
  requestCurrentUser,
  setAccessToken,
} from "./session";

describe("auth session client", () => {
  beforeEach(() => {
    clearAccessToken();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("refreshes the session when /auth/me rejects an expired access token", async () => {
    setAccessToken("expired-token");
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/auth/me") && fetchMock.mock.calls.length === 1) {
        return jsonResponse({ error: { code: "UNAUTHORIZED" } }, 401);
      }
      if (url.endsWith("/auth/refresh")) {
        return jsonResponse({
          data: {
            accessToken: "fresh-token",
            user: {
              id: "u_1",
              email: "zhe@example.dev",
              handle: "zhe-li",
              displayName: "李哲",
              role: "user",
              status: "active",
            },
          },
        });
      }
      if (url.endsWith("/auth/me")) {
        return jsonResponse({
          data: {
            id: "u_1",
            email: "zhe@example.dev",
            handle: "zhe-li",
            displayName: "李哲",
            role: "user",
            status: "active",
          },
        });
      }
      throw new Error(`unexpected URL ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = await requestCurrentUser();

    expect(user?.handle).toBe("zhe-li");
    expect(getAccessToken()).toBe("fresh-token");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("clears the in-memory access token after logout", async () => {
    setAccessToken("access-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 204 })),
    );

    await logout();

    expect(getAccessToken()).toBeNull();
  });

  it("uses the non-conflicting local API port when no public API URL is configured", async () => {
    vi.unstubAllEnvs();
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await logout();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:18080/auth/logout",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
