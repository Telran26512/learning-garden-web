import { describe, expect, it, vi } from "vitest";

import { readerActionFailureMessage, runReaderAction } from "./reading-actions";

describe("reading page actions", () => {
  it("creates user-visible failure messages for failed interactions", () => {
    expect(readerActionFailureMessage("like", new Error("backend down"))).toBe(
      "Like 失败：backend down",
    );
    expect(readerActionFailureMessage("comment", "bad")).toBe(
      "评论失败：操作失败",
    );
  });

  it("clears pending state and avoids refresh when an interaction fails", async () => {
    const setPendingAction = vi.fn();
    const setNotice = vi.fn();
    const refresh = vi.fn();

    await runReaderAction({
      action: "bookmark",
      execute: async () => {
        throw new Error("unauthorized");
      },
      refresh,
      setNotice,
      setPendingAction,
    });

    expect(setPendingAction).toHaveBeenNthCalledWith(1, "bookmark");
    expect(setPendingAction).toHaveBeenLastCalledWith(null);
    expect(setNotice).toHaveBeenCalledWith("Bookmark 失败：unauthorized");
    expect(refresh).not.toHaveBeenCalled();
  });
});
