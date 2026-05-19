import { describe, expect, it } from "vitest";
import {
  mockAdminOverview,
  mockConcepts,
  mockCurrentUser,
  mockRoadmapTasks,
} from "@/lib/api/mock/fixtures";
import type { Concept, User } from "@/lib/api/contracts";

describe("API contracts and fixtures", () => {
  it("provides a current user shaped like the identity contract", () => {
    const user: User = mockCurrentUser;

    expect(user.id).toBe("user_raymond");
    expect(user.role).toBe("admin");
    expect(user.email).toContain("@");
  });

  it("provides concept fixtures shaped like the content contract", () => {
    const concept: Concept = mockConcepts[0]!;
    const draftConcept: Concept = mockConcepts[1]!;

    expect(concept.id).toBe("concept_linear_regression");
    expect(concept.visibility).toBe("public");
    expect(draftConcept.visibility).toBe("private");
    expect(concept.sections.some((section) => section.kind === "math")).toBe(true);
    expect(concept.sections.some((section) => section.kind === "code")).toBe(true);
    expect(concept.sections.some((section) => section.kind === "paper")).toBe(true);
  });

  it("provides learning and admin fixtures used by route UIs", () => {
    expect(mockRoadmapTasks.length).toBeGreaterThan(0);
    expect(mockAdminOverview.moderationPendingCount).toBeGreaterThanOrEqual(0);
  });
});
