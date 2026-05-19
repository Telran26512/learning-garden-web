import type { ReviewCard } from "@/lib/api";

export function applyReviewAnswerToQueue(cards: ReviewCard[], answeredCard: ReviewCard) {
  return cards.map((card) => (card.id === answeredCard.id ? answeredCard : card));
}

export function getCurrentReviewCard(cards: ReviewCard[]) {
  return cards.find((card) => card.status === "due") ?? null;
}

