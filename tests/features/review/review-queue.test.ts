import { describe, expect, it } from "vitest";
import { applyReviewAnswerToQueue, getCurrentReviewCard } from "@/features/review/review-queue";
import { mockReviewCards } from "@/lib/api/mock/fixtures";
import type { ReviewCard } from "@/lib/api";

describe("review queue state", () => {
  it("advances to the next due card after answering the current card", () => {
    const current = mockReviewCards[0]!;
    const answered: ReviewCard = {
      ...current,
      dueAt: "2026-05-26T00:00:00.000Z",
      intervalDays: 7,
      lastRating: "easy",
      lastReviewedAt: "2026-05-19T00:00:00.000Z",
      status: "answered",
    };

    const nextQueue = applyReviewAnswerToQueue(mockReviewCards, answered);

    expect(getCurrentReviewCard(nextQueue)?.id).toBe(mockReviewCards[1]?.id);
  });
});

