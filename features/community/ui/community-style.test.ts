import { describe, expect, it } from "vitest";

import { communityBadgeClass, communityTagChipClass } from "./community-style";

describe("community readable chip styles", () => {
  it("uses high-contrast light-mode tag chips", () => {
    const tagClass = communityTagChipClass();

    expect(tagClass).toContain("text-[11px]");
    expect(tagClass).toContain("font-medium");
    expect(tagClass).toContain("text-[var(--syn-reading-ink)]");
    expect(tagClass).not.toContain("bg-[#171C24]");
    expect(tagClass).not.toContain("text-text-secondary");
  });

  it("uses readable badge text for feed labels", () => {
    const badgeClass = communityBadgeClass();

    expect(badgeClass).toContain("text-[var(--syn-reading-ink)]");
    expect(badgeClass).toContain("font-medium");
  });
});
