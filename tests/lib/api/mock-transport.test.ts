import { describe, expect, it } from "vitest";
import { normalizeApiError } from "@/lib/api/errors";
import { createMockApiRepository } from "@/lib/api/mock/repository";
import { createMockTransport } from "@/lib/api/mock/transport";
import type { Concept } from "@/lib/api/contracts";

describe("mock API transport", () => {
  it("returns the current mock user", async () => {
    const transport = createMockTransport(createMockApiRepository());

    await expect(transport.request("GET", "/auth/me")).resolves.toMatchObject({
      id: "user_raymond",
      role: "admin",
    });
  });

  it("mutates concepts in the mock repository", async () => {
    const transport = createMockTransport(createMockApiRepository());
    const created = await transport.request<Concept>("POST", "/concepts", {
      summary: "Created from tests",
      title: "Mock Concept",
      visibility: "private",
    });

    expect(created).toMatchObject({ title: "Mock Concept", visibility: "private" });
    await expect(transport.request("GET", `/concepts/${created.id}`)).resolves.toMatchObject({
      title: "Mock Concept",
    });
  });

  it("normalizes missing resources as API errors", async () => {
    const transport = createMockTransport(createMockApiRepository());

    await expect(transport.request("GET", "/concepts/missing")).rejects.toMatchObject({
      code: "not_found",
      status: 404,
    });

    expect(normalizeApiError(new Error("x")).code).toBe("unknown_error");
  });
});
