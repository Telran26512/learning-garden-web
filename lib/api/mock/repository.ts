import type {
  AnswerReviewCardInput,
  Concept,
  CreateConceptInput,
  ListPublicContentQuery,
  UpdateConceptInput,
  UpdateRoadmapTaskInput,
  User,
} from "@/lib/api/contracts";
import {
  mockAdminOverview,
  mockConcepts,
  mockCurrentUser,
  mockModerationQueue,
  mockPublicContent,
  mockPublicProfiles,
  mockReviewCards,
  mockRoadmapTasks,
} from "@/lib/api/mock/fixtures";
import { createApiDomainError } from "@/lib/api/errors";

export type MockApiRepository = ReturnType<typeof createMockApiRepository>;

export function createMockApiRepository() {
  let currentUser: User | null = { ...mockCurrentUser };
  let concepts = clone(mockConcepts);
  const publicContent = clone(mockPublicContent);
  const publicProfiles = clone(mockPublicProfiles);
  const roadmapTasks = clone(mockRoadmapTasks);
  const reviewCards = clone(mockReviewCards);

  return {
    answerReviewCard(id: string, input: AnswerReviewCardInput) {
      requireUser(currentUser);
      const card = reviewCards.find((item) => item.id === id);

      if (!card) {
        throw createApiDomainError(404, "not_found", "Review card not found");
      }

      card.status = "answered";
      card.lastRating = input.rating;
      if (input.userCode) {
        card.userCode = input.userCode;
      }

      return {
        card: { ...card },
        nextDueAt:
          input.rating === "again" ? "2026-05-20T00:00:00.000Z" : "2026-05-26T00:00:00.000Z",
      };
    },
    createConcept(input: CreateConceptInput) {
      const user = requireUser(currentUser);
      if (input.title.trim().length === 0) {
        throw createApiDomainError(422, "validation_error", "Concept title is required");
      }

      const now = new Date().toISOString();
      const concept: Concept = {
        createdAt: now,
        id: `concept_${slugify(input.title)}_${concepts.length + 1}`,
        ownerId: user.id,
        sections: input.sections ?? [],
        slug: slugify(input.title),
        status: "draft",
        summary: input.summary,
        tags: input.tags ?? [],
        title: input.title,
        updatedAt: now,
        visibility: input.visibility,
      };
      concepts = [concept, ...concepts];
      return { ...concept };
    },
    getAdminOverview() {
      requireAdmin(currentUser);
      return { ...mockAdminOverview };
    },
    getConcept(id: string) {
      requireUser(currentUser);
      const concept = concepts.find((item) => item.id === id);

      if (!concept) {
        throw createApiDomainError(404, "not_found", "Concept not found");
      }

      return cloneOne(concept);
    },
    getPublicContent(slug: string) {
      const content = concepts.find((item) => item.slug === slug && item.visibility === "public");

      if (content) {
        return cloneOne(content);
      }

      const publicItem = publicContent.find((item) => item.slug === slug);

      if (!publicItem) {
        throw createApiDomainError(404, "not_found", "Public content not found");
      }

      return cloneOne({
        createdAt: publicItem.createdAt,
        id: publicItem.id,
        ownerId: publicItem.ownerId,
        sections: [],
        slug: publicItem.slug,
        status: "published",
        summary: publicItem.excerpt,
        tags: publicItem.tags,
        title: publicItem.title,
        updatedAt: publicItem.updatedAt,
        visibility: "public",
      } satisfies Concept);
    },
    getPublicProfile(id: string) {
      const profile = publicProfiles.find((item) => item.id === id);

      if (!profile) {
        throw createApiDomainError(404, "not_found", "Public profile not found");
      }

      return cloneOne(profile);
    },
    getCurrentUser() {
      return requireUser(currentUser);
    },
    getModerationQueue() {
      requireAdmin(currentUser);
      return clone(mockModerationQueue);
    },
    getReviewQueue() {
      requireUser(currentUser);
      return clone(reviewCards);
    },
    getRoadmap() {
      requireUser(currentUser);
      return clone(roadmapTasks);
    },
    listConcepts() {
      requireUser(currentUser);
      return clone(concepts);
    },
    listPublicContent(query: ListPublicContentQuery = {}) {
      return clone(
        publicContent.filter((item) => {
          if (
            query.contentType &&
            query.contentType !== "all" &&
            item.contentType !== query.contentType
          ) {
            return false;
          }

          if (query.ownerId && item.ownerId !== query.ownerId) {
            return false;
          }

          if (query.tag && !item.tags.includes(query.tag)) {
            return false;
          }

          return true;
        }),
      );
    },
    login() {
      currentUser = { ...mockCurrentUser };
      return { user: { ...currentUser } };
    },
    logout() {
      requireUser(currentUser);
      currentUser = null;
    },
    runPython(code: string) {
      if (code.trim().length === 0) {
        throw createApiDomainError(422, "validation_error", "Python code cannot be empty");
      }

      return {
        durationMs: 38,
        stderr: "",
        stdout: code.includes("LinearRegression") ? "w = 2.98 b = 4.07\nR2 = 0.95" : "hello",
        status: "succeeded" as const,
      };
    },
    updateConcept(id: string, input: UpdateConceptInput) {
      requireUser(currentUser);
      const index = concepts.findIndex((item) => item.id === id);

      if (index === -1) {
        throw createApiDomainError(404, "not_found", "Concept not found");
      }

      const current = concepts[index]!;
      const next = {
        ...current,
        ...input,
        updatedAt: new Date().toISOString(),
      };
      concepts[index] = next;
      return cloneOne(next);
    },
    updateRoadmapTask(id: string, input: UpdateRoadmapTaskInput) {
      requireUser(currentUser);
      const task = roadmapTasks.find((item) => item.id === id);

      if (!task) {
        throw createApiDomainError(404, "not_found", "Roadmap task not found");
      }

      task.status = input.status;
      task.updatedAt = new Date().toISOString();
      return { ...task };
    },
  };
}

function requireUser(user: User | null) {
  if (!user) {
    throw createApiDomainError(401, "unauthenticated", "Authentication is required");
  }

  return { ...user };
}

function requireAdmin(user: User | null) {
  const currentUser = requireUser(user);

  if (currentUser.role !== "admin") {
    throw createApiDomainError(403, "forbidden", "Admin role is required");
  }

  return currentUser;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function clone<T>(value: T[]): T[] {
  return value.map((item) => cloneOne(item));
}

function cloneOne<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
