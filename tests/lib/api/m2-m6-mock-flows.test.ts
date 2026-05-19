import { describe, expect, it } from "vitest";
import { contentApi, setApiTransportForTests } from "@/lib/api";
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
    expect(profile).toMatchObject({ id: "user_raymond", displayName: "Raymond" });
  });

  it("loads detail for every public feed item", async () => {
    useFreshMockTransport();

    const feed = await contentApi.listPublicContent();
    const details = await Promise.all(feed.map((item) => contentApi.getPublicContent(item.slug)));

    expect(details.map((detail) => detail.slug).sort()).toEqual(feed.map((item) => item.slug).sort());
  });
});
