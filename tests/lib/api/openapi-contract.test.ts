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

  it("declares the M2-M6 API paths needed by the mock-first frontend", () => {
    for (const path of [
      "/content/public:",
      "/content/public/{slug}:",
      "/users/{id}/public-profile:",
      "/social/feed:",
      "/social/discussions:",
      "/social/discussions/{id}/replies:",
      "/social/notifications:",
      "/social/notifications/{id}:",
      "/social/follows:",
      "/social/follows/{userId}:",
      "/comments:",
      "/comments/{id}:",
      "/relations/graph:",
      "/relations/backlinks:",
      "/portfolio/{userId}:",
      "/admin/reports:",
      "/admin/reports/{id}/resolve:",
      "/admin/content/{id}/moderate:",
      "/admin/comments/{id}/moderate:",
      "/admin/users/{id}/restrict:",
      "/admin/registration:",
      "/admin/actions:",
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
