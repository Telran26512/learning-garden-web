import { describe, expect, it } from "vitest";

import {
  applyNotificationEvent,
  emptyNotificationState,
  markNotificationStateRead,
  notificationMenuItems,
} from "./notifications-model";

describe("P7 notification model", () => {
  it("merges SSE notifications newest-first and deduplicates by id", () => {
    const state = applyNotificationEvent(
      {
        error: null,
        items: [
          notification("older", "comment", "2026-05-20T00:00:00Z"),
          notification("same", "mention", "2026-05-20T01:00:00Z"),
        ],
        unread: 1,
      },
      {
        items: [
          notification("same", "comment", "2026-05-21T00:00:00Z"),
          notification("newer", "discussion", "2026-05-21T01:00:00Z"),
        ],
        type: "notifications",
        unread: 2,
      },
    );

    expect(state.unread).toBe(2);
    expect(state.items.map((item) => item.id)).toEqual([
      "newer",
      "same",
      "older",
    ]);
    expect(state.items[1]?.kind).toBe("comment");
  });

  it("maps notifications into header menu rows", () => {
    const items = notificationMenuItems([
      {
        ...notification("n1", "comment", "2026-05-21T00:00:00Z"),
        actorName: "Xiaobin Cao",
        metadata: { contentTitle: "Multi-Head Attention" },
      },
    ]);

    expect(items[0]).toMatchObject({
      body: "Multi-Head Attention",
      title: "Xiaobin Cao 评论了你的 Note",
      unread: true,
    });
  });

  it("marks local state read after the server accepts read receipt", () => {
    const state = markNotificationStateRead({
      ...emptyNotificationState,
      items: [notification("n1", "comment", "2026-05-21T00:00:00Z")],
      unread: 1,
    });

    expect(state.unread).toBe(0);
    expect(state.items[0]?.readAt).toBeTruthy();
  });
});

function notification(
  id: string,
  kind: "comment" | "discussion" | "mention",
  createdAt: string,
) {
  return {
    actorHandle: "reader",
    actorId: "reader-1",
    actorName: "Reader",
    contentId: "note-1",
    createdAt,
    id,
    kind,
    metadata: {},
    userId: "owner-1",
  };
}
