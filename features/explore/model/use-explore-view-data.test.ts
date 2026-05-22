import { describe, expect, it } from "vitest";

import {
  createExploreErrorState,
  createExploreLoadedState,
} from "./use-explore-view-data";

describe("explore view data state", () => {
  it("does not replace failed API responses with fixture feed data", () => {
    const state = createExploreErrorState(new Error("explore unavailable"));

    expect(state.status).toBe("error");
    expect(state.error).toBe("explore unavailable");
    expect(state.viewData.feedItems).toEqual([]);
    expect(state.viewData.tagStats).toEqual([]);
    expect(state.viewData.total).toBe(0);
  });

  it("treats empty live responses as an empty state instead of fixture fallback", () => {
    const state = createExploreLoadedState({
      items: [],
      tags: [],
      total: 0,
    });

    expect(state.status).toBe("empty");
    expect(state.viewData.feedItems).toEqual([]);
  });
});
