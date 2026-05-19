import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const openApi = readFileSync(join(process.cwd(), "docs/api/openapi.yaml"), "utf8");

describe("OpenAPI contract", () => {
  it("declares the M0/M1 API paths needed by the frontend", () => {
    for (const path of [
      "/auth/me:",
      "/auth/login:",
      "/auth/logout:",
      "/concepts:",
      "/concepts/{id}:",
      "/learning/roadmap:",
      "/learning/tasks/{id}:",
      "/learning/review-queue:",
      "/learning/review-cards/{id}/answer:",
      "/runtime/python-runs:",
      "/admin/overview:",
      "/admin/moderation-queue:",
    ]) {
      expect(openApi).toContain(path);
    }
  });

  it("declares shared DTO schemas used by TypeScript contracts", () => {
    for (const schema of [
      "User:",
      "Concept:",
      "RoadmapTask:",
      "ReviewCard:",
      "AdminOverview:",
      "ModerationQueueItem:",
      "ApiErrorPayload:",
    ]) {
      expect(openApi).toContain(schema);
    }
  });
});
