import { describe, expect, test } from "vitest";

import {
  buildContributionWeeks,
  filterContributionEntries,
  graphEdges,
  graphNodes,
  notes,
  paperColumns,
  portfolioExperiments,
  portfolioProfile,
  portfolioTabs,
  portfolioStats,
  portfolioTracks,
} from "./portfolio-model";

describe("portfolio model", () => {
  test("keeps portfolio navigation pointed at the profile view", () => {
    expect(portfolioTabs.map((tab) => [tab.label, tab.href])).toEqual([
      ["Overview", "/app?view=portfolio"],
      ["Tracks", "/app?view=portfolio&tab=tracks"],
      ["Notes", "/app?view=portfolio&tab=notes"],
      ["Papers", "/app?view=portfolio&tab=papers"],
      ["Experiments", "/app?view=portfolio&tab=experiments"],
      ["Graph", "/app?view=portfolio&tab=graph"],
    ]);
  });

  test("builds a year heatmap as 53 week columns", () => {
    const weeks = buildContributionWeeks("all");

    expect(weeks).toHaveLength(53);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks.flat().some((entry) => entry.level === 4)).toBe(true);
  });

  test("filters contribution entries by source type", () => {
    const noteEntries = filterContributionEntries("notes");

    expect(noteEntries).not.toHaveLength(0);
    expect(noteEntries.every((entry) => entry.kind === "notes")).toBe(true);
    expect(filterContributionEntries("all").length).toBeGreaterThan(
      noteEntries.length,
    );
  });

  test("exposes the stats shown in the profile sidebar", () => {
    expect(portfolioStats.map((item) => item.label)).toEqual([
      "Notes",
      "Tracks",
      "Block Links",
      "Followers",
      "Following",
      "Total ↑",
    ]);
  });

  test("uses uploaded profile media assets", () => {
    expect(portfolioProfile.coverImageSrc).toBe("/portfolio-cover.jpg");
    expect(portfolioProfile.avatarImageSrc).toBe("/portfolio-avatar.jpg");
  });

  test("uses the requested profile identity and GitHub mark", () => {
    expect(portfolioProfile.name).toBe("Xiaobin Cao");
    expect(portfolioProfile.githubIconSrc).toBe("/github-mark.svg");
  });

  test("provides full data sets for the remaining profile tabs", () => {
    expect(portfolioTracks).toHaveLength(8);
    expect(notes.length).toBeGreaterThanOrEqual(10);
    expect(paperColumns.map((column) => column.key)).toEqual([
      "queued",
      "reading",
      "done",
    ]);
    expect(portfolioExperiments).toHaveLength(12);
  });

  test("keeps experiment status counts aligned with filter chips", () => {
    const counts = portfolioExperiments.reduce<Record<string, number>>(
      (acc, experiment) => {
        acc[experiment.status] = (acc[experiment.status] ?? 0) + 1;
        return acc;
      },
      {},
    );

    expect(counts.running).toBe(3);
    expect(counts.done).toBe(7);
    expect(counts.failed).toBe(1);
    expect(counts.queued).toBe(1);
  });

  test("defines graph topology for the Graph tab", () => {
    expect(graphNodes.some((node) => node.focused)).toBe(true);
    expect(graphNodes.filter((node) => node.type === "hub")).toHaveLength(5);
    expect(graphEdges.length).toBeGreaterThan(graphNodes.length);
  });
});
