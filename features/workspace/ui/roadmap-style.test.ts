import { describe, expect, it } from "vitest";

import {
  activeLessonBadgeClass,
  doneCheckClass,
  doneTaskBoxClass,
  doneStageBadgeClass,
  taskLabelClass,
} from "./roadmap-style";

describe("workspace roadmap readable status styles", () => {
  it("keeps white glyphs readable on green status backgrounds", () => {
    expect(doneStageBadgeClass()).toContain("text-[#FFFFFF]");
    expect(activeLessonBadgeClass()).toContain("text-[#FFFFFF]");
    expect(doneTaskBoxClass()).toContain("text-[#FFFFFF]");

    expect(doneStageBadgeClass()).not.toContain("text-white");
    expect(activeLessonBadgeClass()).not.toContain("text-white");
    expect(doneTaskBoxClass()).not.toContain("text-white");
  });

  it("keeps standalone completed lesson checks bold enough to scan", () => {
    expect(doneCheckClass()).toContain("font-bold");
    expect(doneCheckClass()).toContain("text-[var(--syn-accent)]");
  });

  it("does not fade completed active-card task labels too far", () => {
    expect(taskLabelClass("done")).toContain("text-[var(--syn-working-ink)]");
    expect(taskLabelClass("done")).not.toContain("opacity-60");
  });
});
