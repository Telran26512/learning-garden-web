import type {
  AnswerReviewCardInput,
  AnswerReviewCardResponse,
  ReviewCard,
  RoadmapTask,
  UpdateRoadmapTaskInput,
} from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const learningApi = {
  answerReviewCard(id: string, input: AnswerReviewCardInput) {
    return getApiTransport().request<AnswerReviewCardResponse>(
      "POST",
      `/learning/review-cards/${encodeURIComponent(id)}/answer`,
      input,
    );
  },
  getReviewQueue() {
    return getApiTransport().request<ReviewCard[]>("GET", "/learning/review-queue");
  },
  getRoadmap() {
    return getApiTransport().request<RoadmapTask[]>("GET", "/learning/roadmap");
  },
  updateRoadmapTask(id: string, input: UpdateRoadmapTaskInput) {
    return getApiTransport().request<RoadmapTask>(
      "PATCH",
      `/learning/tasks/${encodeURIComponent(id)}`,
      input,
    );
  },
};
