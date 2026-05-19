"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useSynapseNavigation } from "@/components/layout/use-synapse-navigation";
import { StateSurface } from "@/components/ui/state-surface";
import { ReviewScreen } from "@/features/review/review-screen";
import { learningApi, normalizeApiError } from "@/lib/api";
import type { ReviewCard } from "@/lib/api";

export function ReviewRoute() {
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCode, setUserCode] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const goTo = useSynapseNavigation();

  useEffect(() => {
    let isActive = true;

    learningApi
      .getReviewQueue()
      .then((queue) => {
        if (isActive) {
          setCards(queue);
          setUserCode(queue[0]?.userCode ?? "");
          setIsLoading(false);
        }
      })
      .catch((unknownError: unknown) => {
        if (isActive) {
          setError(normalizeApiError(unknownError).message);
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const compare = async () => {
    const card = cards[0];
    if (!card) {
      return;
    }

    await learningApi.answerReviewCard(card.id, { rating: "hard", userCode });
    setShowCompare(true);
  };

  return (
    <AppShell active="review" goTo={goTo}>
      {isLoading ? (
        <StateSurface
          className="my-8"
          description="正在从 mock API 读取复习卡片。"
          label="Mock API"
          title="同步 Review 队列"
          tone="green"
        />
      ) : null}
      {error ? (
        <StateSurface
          className="my-8"
          description={error}
          label="API Error"
          title="Review 数据加载失败"
          tone="amber"
        />
      ) : null}
      {!isLoading && !error ? (
        <ReviewScreen
          cards={cards}
          onCompare={compare}
          setUserCode={setUserCode}
          showCompare={showCompare}
          userCode={userCode}
        />
      ) : null}
    </AppShell>
  );
}
