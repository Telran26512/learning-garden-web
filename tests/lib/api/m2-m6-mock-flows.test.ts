import { describe, expect, it } from "vitest";
import { contentApi, learningApi, setApiTransportForTests } from "@/lib/api";
import { createMockApiRepository } from "@/lib/api/mock/repository";
import { createMockTransport } from "@/lib/api/mock/transport";

function useFreshMockTransport() {
  setApiTransportForTests(createMockTransport(createMockApiRepository()));
}

describe("M2 public content mock flows", () => {
  it("lists public content and filters by tag", async () => {
    useFreshMockTransport();

    const all = await contentApi.listPublicContent();
    const filtered = await contentApi.listPublicContent({ tag: "线性回归" });

    expect(all).toEqual(
      expect.arrayContaining([expect.objectContaining({ visibility: "public" })]),
    );
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.tags.includes("线性回归"))).toBe(true);
  });

  it("loads public content detail and public profile", async () => {
    useFreshMockTransport();

    const detail = await contentApi.getPublicContent("linear-regression-ols");
    const profile = await contentApi.getPublicProfile("user_raymond");

    expect(detail.slug).toBe("linear-regression-ols");
    expect(Object.hasOwn(detail, "mastery")).toBe(false);
    expect(profile).toMatchObject({ id: "user_raymond", displayName: "Raymond" });
  });

  it("loads detail for every public feed item", async () => {
    useFreshMockTransport();

    const feed = await contentApi.listPublicContent();
    const details = await Promise.all(feed.map((item) => contentApi.getPublicContent(item.slug)));
    const fallbackDetail = await contentApi.getPublicContent("cross-entropy-gradient");

    expect(details.map((detail) => detail.slug).sort()).toEqual(feed.map((item) => item.slug).sort());
    expect(details.map((detail) => detail.id).sort()).toEqual(feed.map((item) => item.id).sort());
    expect(fallbackDetail.sections).toEqual([]);
    expect(fallbackDetail.summary).toContain("softmax");
  });

  it("does not expose stale public fixtures after a concept becomes private", async () => {
    useFreshMockTransport();

    await contentApi.updateConcept("concept_linear_regression", { visibility: "private" });

    const feed = await contentApi.listPublicContent();

    expect(feed.some((item) => item.id === "concept_linear_regression")).toBe(false);
    await expect(contentApi.getPublicContent("linear-regression-ols")).rejects.toMatchObject({
      code: "not_found",
      status: 404,
    });
  });
});

describe("M3 review scheduling mock flows", () => {
  it("answers a review card and updates scheduling fields", async () => {
    useFreshMockTransport();

    const [before] = await learningApi.getReviewQueue();
    const result = await learningApi.answerReviewCard(before!.id, {
      rating: "easy",
      userCode: "def linear_regression(X, y): return X",
    });
    const afterQueue = await learningApi.getReviewQueue();
    const after = afterQueue.find((card) => card.id === before!.id);

    expect(result.card.status).toBe("answered");
    expect(result.card.lastRating).toBe("easy");
    expect(result.card.intervalDays).toBeGreaterThan(before!.intervalDays);
    expect(result.nextDueAt).toBe(result.card.dueAt);
    expect(after?.lastReviewedAt).not.toBeNull();
  });
});
