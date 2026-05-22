import { describe, expect, it } from "vitest";

import {
  createPortfolioErrorState,
  createPortfolioLoadedState,
} from "./use-portfolio-view-data";

describe("portfolio view data state", () => {
  it("surfaces profile API failures without showing fixture content as live data", () => {
    const state = createPortfolioErrorState(
      "xiaobin-cao",
      new Error("profile unavailable"),
    );

    expect(state.status).toBe("error");
    expect(state.error).toBe("profile unavailable");
    expect(state.viewData.tracks).toEqual([]);
    expect(state.viewData.notes).toEqual([]);
    expect(state.viewData.profile.handle).toBe("@xiaobin-cao");
  });

  it("treats an empty live portfolio as an empty state", () => {
    const state = createPortfolioLoadedState("xiaobin-cao", {
      graph: { edges: [], nodes: [] },
      items: { experiment: [], note: [], paper: [], track: [] },
      profile: {
        createdAt: "2026-05-01T00:00:00Z",
        displayName: "Xiaobin Cao",
        handle: "xiaobin-cao",
        id: "user-1",
        role: "user",
        stats: { experiments: 0, notes: 0, papers: 0, tracks: 0 },
      },
      recent: [],
      stats: { experiments: 0, notes: 0, papers: 0, tracks: 0 },
      topics: {},
    });

    expect(state.status).toBe("empty");
    expect(state.viewData.tracks).toEqual([]);
    expect(state.viewData.profile.name).toBe("Xiaobin Cao");
  });
});
