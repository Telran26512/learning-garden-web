import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const openApi = readFileSync(join(process.cwd(), "docs/api/openapi.yaml"), "utf8");

function getPathKeys(document: string) {
  return new Set(
    document
      .split("\n")
      .map((line) => line.match(/^  (\/[^:]+):$/)?.[1])
      .filter((path): path is string => Boolean(path)),
  );
}

function getSchemaKeys(document: string) {
  const lines = document.split("\n");
  const schemasStart = lines.findIndex((line) => line === "  schemas:");

  if (schemasStart === -1) {
    return new Set<string>();
  }

  const keys = new Set<string>();

  for (const line of lines.slice(schemasStart + 1)) {
    if (/^  [A-Za-z]/.test(line)) {
      break;
    }

    const schema = line.match(/^    ([A-Za-z][A-Za-z0-9]*):$/)?.[1];

    if (schema) {
      keys.add(schema);
    }
  }

  return keys;
}

function getPathSection(document: string, path: string) {
  const lines = document.split("\n");
  const start = lines.findIndex((line) => line === `  ${path}:`);

  if (start === -1) {
    return "";
  }

  const end = lines.findIndex((line, index) => index > start && /^  \/[^:]+:$/.test(line));
  return lines.slice(start, end === -1 ? undefined : end).join("\n");
}

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
    const pathKeys = getPathKeys(openApi);

    for (const path of [
      "/content/public",
      "/content/public/{slug}",
      "/users/{id}/public-profile",
      "/social/feed",
      "/social/discussions",
      "/social/discussions/{id}/replies",
      "/social/notifications",
      "/social/notifications/{id}",
      "/social/follows",
      "/social/follows/{userId}",
      "/comments",
      "/comments/{id}",
      "/relations/graph",
      "/relations/backlinks",
      "/portfolio/{userId}",
      "/admin/reports",
      "/admin/reports/{id}/resolve",
      "/admin/content/{id}/moderate",
      "/admin/comments/{id}/moderate",
      "/admin/users/{id}/restrict",
      "/admin/registration",
      "/admin/actions",
    ]) {
      expect(pathKeys).toContain(path);
    }
  });

  it("declares request bodies for M2-M6 admin mutations", () => {
    for (const [path, schema] of [
      ["/admin/reports/{id}/resolve", "ResolveReportInput"],
      ["/admin/content/{id}/moderate", "ModerateContentInput"],
      ["/admin/comments/{id}/moderate", "ModerateContentInput"],
      ["/admin/users/{id}/restrict", "RestrictUserInput"],
    ] as const) {
      const pathSection = getPathSection(openApi, path);

      expect(pathSection).toContain("requestBody:");
      expect(pathSection).toContain(`$ref: "#/components/schemas/${schema}"`);
    }

    expect([...getSchemaKeys(openApi)]).toEqual(
      expect.arrayContaining(["ResolveReportInput", "ModerateContentInput", "RestrictUserInput"]),
    );
  });

  it("declares M2-M6 DTO schemas as component schemas", () => {
    const schemaKeys = getSchemaKeys(openApi);

    for (const schema of [
      "PublicAuthor",
      "PublicContentItem",
      "PublicProfile",
      "Comment",
      "Discussion",
      "ActivityFeedItem",
      "NotificationItem",
      "GraphNode",
      "GraphEdge",
      "KnowledgeGraph",
      "Backlink",
      "Portfolio",
      "ModerationReport",
      "RegistrationSettings",
      "AdminAction",
    ]) {
      expect(schemaKeys).toContain(schema);
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
