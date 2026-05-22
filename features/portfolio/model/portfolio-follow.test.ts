import { describe, expect, it, vi } from "vitest";

import { updatePortfolioFollow } from "./portfolio-follow";

describe("portfolio follow model", () => {
  it("follows a public profile through the P4 API use case", async () => {
    const follow = vi.fn(async () => ({
      following: true,
      profile: {
        createdAt: "2026-05-01T00:00:00Z",
        displayName: "Author A",
        handle: "author-a",
        id: "user-1",
        role: "member",
        stats: { experiments: 0, notes: 1, papers: 0, tracks: 0 },
      },
    }));
    const unfollow = vi.fn();

    await expect(
      updatePortfolioFollow({
        follow,
        followed: false,
        handle: "@author-a",
        unfollow,
      }),
    ).resolves.toBe(true);
    expect(follow).toHaveBeenCalledWith("author-a");
    expect(unfollow).not.toHaveBeenCalled();
  });

  it("unfollows a public profile through the P4 API use case", async () => {
    const follow = vi.fn();
    const unfollow = vi.fn(async () => ({
      following: false,
      profile: {
        createdAt: "2026-05-01T00:00:00Z",
        displayName: "Author A",
        handle: "author-a",
        id: "user-1",
        role: "member",
        stats: { experiments: 0, notes: 1, papers: 0, tracks: 0 },
      },
    }));

    await expect(
      updatePortfolioFollow({
        follow,
        followed: true,
        handle: "author-a",
        unfollow,
      }),
    ).resolves.toBe(false);
    expect(unfollow).toHaveBeenCalledWith("author-a");
    expect(follow).not.toHaveBeenCalled();
  });
});
