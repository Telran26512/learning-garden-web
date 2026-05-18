import { describe, expect, it, vi } from "vitest";
import { ApiError, createApiClient } from "@/lib/api/http";

describe("createApiClient", () => {
  it("sends JSON requests to the versioned REST API", async () => {
    const fetchImpl = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return new Response(JSON.stringify({ concepts: [] }), {
          headers: { "content-type": "application/json" },
          status: 200,
        });
      },
    );

    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl,
    });

    await expect(
      client.get<{ concepts: unknown[] }>("/concepts"),
    ).resolves.toEqual({
      concepts: [],
    });

    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(String(url)).toBe("http://api.test/api/v1/concepts");
    expect(init).toMatchObject({
      credentials: "include",
      method: "GET",
    });
  });

  it("throws an ApiError with status and backend message on non-2xx responses", async () => {
    const fetchImpl = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        void input;
        void init;

        return new Response(JSON.stringify({ message: "private content" }), {
          headers: { "content-type": "application/json" },
          status: 403,
        });
      },
    );

    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl,
    });

    await expect(client.get("/concepts")).rejects.toMatchObject({
      message: "private content",
      status: 403,
    });
    await expect(client.get("/concepts")).rejects.toBeInstanceOf(ApiError);
  });
});
