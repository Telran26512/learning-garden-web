import { describe, expect, test } from "vitest";

import {
  communityFeed,
  communityHero,
  communityPeople,
  communityReadingSessions,
  communityStats,
  communityTabs,
  communityTopics,
} from "./community-model";

describe("community model", () => {
  test("matches the prototype hero and weekly stats", () => {
    expect(communityHero.title).toBe("这一周,大家在想些什么");
    expect(communityStats.map((item) => [item.label, item.value])).toEqual([
      ["Tracks shared", "312"],
      ["Notes published", "1,847"],
      ["Paper threads", "94"],
      ["Your followers", "+218"],
    ]);
  });

  test("defines the feed tabs and community right rail data", () => {
    expect(communityTabs.map((tab) => tab.label)).toEqual([
      "For you",
      "Following",
      "Trending",
      "Tracks",
      "Papers",
      "Discussions",
      "Reading Clubs",
    ]);
    expect(communityPeople).toHaveLength(5);
    expect(communityTopics[0]).toMatchObject({
      label: "GRPO",
      delta: "↑ 412%",
    });
    expect(communityReadingSessions).toHaveLength(3);
  });

  test("starts the feed with the trending track prototype card", () => {
    expect(communityFeed[0]).toMatchObject({
      kind: "track",
      title: "RLHF from Scratch · 一周一篇",
    });
    expect(communityFeed.some((item) => item.kind === "experiment")).toBe(true);
    expect(communityFeed.some((item) => item.kind === "reading-session")).toBe(
      true,
    );
  });
});
