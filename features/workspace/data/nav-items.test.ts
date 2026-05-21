import { describe, expect, test } from "vitest";

import { WORKSPACE_NAV_ITEMS } from "./nav-items";

describe("WORKSPACE_NAV_ITEMS", () => {
  test("places Explore before Community", () => {
    expect(WORKSPACE_NAV_ITEMS).toEqual([
      "Workspace",
      "Studio",
      "Explore",
      "Community",
      "Portfolio",
    ]);
  });
});
