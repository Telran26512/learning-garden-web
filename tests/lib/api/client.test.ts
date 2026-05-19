import { describe, expect, it, vi } from "vitest";
import { ApiError, createApiClient } from "@/lib/api/client";

describe("api client", () => {
  it("joins base URL and path with a single slash", async () => {
    const fetcher = vi.fn(async () => Response.json({ ok: true }));
    const client = createApiClient({
      baseUrl: "https://api.example.com/api/v1/",
      fetcher,
    });

    await expect(client.request<{ ok: boolean }>("/concepts")).resolves.toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.example.com/api/v1/concepts",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
  });

  it("serializes object bodies as JSON", async () => {
    const fetcher = vi.fn(async () => Response.json({ id: "concept_1" }));
    const client = createApiClient({ baseUrl: "/api/v1", fetcher });

    await client.request("/concepts", {
      method: "POST",
      body: { title: "Linear Regression" },
    });

    const calls = fetcher.mock.calls as unknown as Array<[string, RequestInit]>;
    const [, init] = calls[0]!;
    expect(init?.body).toBe(JSON.stringify({ title: "Linear Regression" }));
    expect((init?.headers as Headers).get("content-type")).toBe("application/json");
  });

  it("throws ApiError with server message on non-2xx responses", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ message: "Concept not found" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
    );
    const client = createApiClient({ baseUrl: "/api/v1", fetcher });

    await expect(client.request("/concepts/missing")).rejects.toMatchObject({
      name: "ApiError",
      message: "Concept not found",
      status: 404,
    } satisfies Partial<ApiError>);
  });
});
