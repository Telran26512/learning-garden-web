import type {
  AnswerReviewCardInput,
  Comment,
  CommentTargetType,
  Concept,
  CreateCommentInput,
  CreateConceptInput,
  CreateDiscussionInput,
  Discussion,
  ListPublicContentQuery,
  NotificationItem,
  PublicContentDetail,
  PublicContentItem,
  PublicProfile,
  UpdateConceptInput,
  UpdateRoadmapTaskInput,
  User,
} from "@/lib/api/contracts";
import {
  mockActivityFeed,
  mockAdminOverview,
  mockComments,
  mockConcepts,
  mockCurrentUser,
  mockDiscussions,
  mockModerationQueue,
  mockNotifications,
  mockPublicContent,
  mockPublicProfiles,
  mockReviewCards,
  mockRoadmapTasks,
} from "@/lib/api/mock/fixtures";
import { createApiDomainError } from "@/lib/api/errors";

export type MockApiRepository = ReturnType<typeof createMockApiRepository>;

export function createMockApiRepository() {
  let currentUser: User | null = { ...mockCurrentUser };
  let activityFeed = clone(mockActivityFeed);
  let comments = clone(mockComments);
  let concepts = clone(mockConcepts);
  let discussions = clone(mockDiscussions);
  let notifications = clone(mockNotifications);
  const publicContent = clone(mockPublicContent);
  let publicProfiles = clone(mockPublicProfiles);
  const roadmapTasks = clone(mockRoadmapTasks);
  const reviewCards = clone(mockReviewCards);

  return {
    answerReviewCard(id: string, input: AnswerReviewCardInput) {
      requireUser(currentUser);
      const card = reviewCards.find((item) => item.id === id);

      if (!card) {
        throw createApiDomainError(404, "not_found", "Review card not found");
      }

      const now = new Date().toISOString();
      const nextInterval = getNextIntervalDays(card.intervalDays, input.rating);
      card.status = "answered";
      card.lastRating = input.rating;
      card.lastReviewedAt = now;
      card.intervalDays = nextInterval;
      card.ease = getNextEase(card.ease, input.rating);
      card.dueAt = addDaysIso(now, nextInterval);
      if (input.userCode !== undefined) {
        card.userCode = input.userCode;
      }

      return {
        card: { ...card },
        nextDueAt: card.dueAt,
      };
    },
    createComment(input: CreateCommentInput) {
      const user = requireUser(currentUser);
      if (input.body.trim().length === 0) {
        throw createApiDomainError(422, "validation_error", "Comment body is required");
      }

      const now = new Date().toISOString();
      const comment: Comment = {
        author: toPublicAuthor(user),
        body: input.body,
        createdAt: now,
        id: `comment_${comments.length + 1}`,
        parentId: input.parentId,
        targetId: input.targetId,
        targetType: input.targetType,
        updatedAt: now,
      };
      comments = [comment, ...comments];
      return cloneOne(comment);
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
    createDiscussion(input: CreateDiscussionInput) {
      const user = requireUser(currentUser);
      if (input.title.trim().length === 0 || input.body.trim().length === 0) {
        throw createApiDomainError(422, "validation_error", "Discussion title and body are required");
      }

      const now = new Date().toISOString();
      const discussion: Discussion = {
        author: toPublicAuthor(user),
        body: input.body,
        createdAt: now,
        id: `discussion_${discussions.length + 1}`,
        replies: [],
        replyCount: 0,
        status: "open",
        title: input.title,
        updatedAt: now,
      };
      discussions = [discussion, ...discussions];
      return cloneOne(discussion);
    },
    deleteComment(id: string) {
      requireUser(currentUser);
      comments = comments.filter((item) => item.id !== id);
    },
    followUser(userId: string) {
      requireUser(currentUser);
      publicProfiles = publicProfiles.map((profile) =>
        profile.id === userId
          ? {
              ...profile,
              followerCount: profile.followerCount + (profile.isFollowing ? 0 : 1),
              isFollowing: true,
            }
          : profile,
      );

      return cloneOne(requirePublicProfile(publicProfiles, userId));
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
      const publicItem = publicContent.find(
        (item) => item.slug === slug && isPublicContentVisible(item, concepts),
      );

      if (!publicItem) {
        throw createApiDomainError(404, "not_found", "Public content not found");
      }

      const concept = concepts.find(
        (item) =>
          item.id === publicItem.id && item.slug === publicItem.slug && item.visibility === "public",
      );

      if (concept) {
        return cloneOne(toPublicContentDetail(concept));
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
    getComments(targetId: string, targetType: CommentTargetType) {
      return clone(
        comments.filter((item) => item.targetId === targetId && item.targetType === targetType),
      );
    },
    getDiscussions() {
      return clone(discussions);
    },
    getFeed() {
      return clone(activityFeed);
    },
    getNotifications() {
      requireUser(currentUser);
      return clone(notifications);
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
          if (!isPublicContentVisible(item, concepts)) {
            return false;
          }

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
    markNotificationRead(id: string) {
      requireUser(currentUser);
      const notification = notifications.find((item) => item.id === id);

      if (!notification) {
        throw createApiDomainError(404, "not_found", "Notification not found");
      }

      notification.readAt = new Date().toISOString();
      return cloneOne(notification);
    },
    replyToDiscussion(id: string, input: CreateCommentInput) {
      const user = requireUser(currentUser);
      const discussion = discussions.find((item) => item.id === id);

      if (!discussion) {
        throw createApiDomainError(404, "not_found", "Discussion not found");
      }

      if (input.body.trim().length === 0) {
        throw createApiDomainError(422, "validation_error", "Reply body is required");
      }

      const now = new Date().toISOString();
      const reply: Comment = {
        author: toPublicAuthor(user),
        body: input.body,
        createdAt: now,
        id: `comment_${comments.length + 1}`,
        parentId: input.parentId,
        targetId: id,
        targetType: "discussion",
        updatedAt: now,
      };
      comments = [reply, ...comments];
      discussion.replies = [reply, ...discussion.replies];
      discussion.replyCount = discussion.replies.length;
      discussion.updatedAt = now;
      return cloneOne(reply);
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
    unfollowUser(userId: string) {
      requireUser(currentUser);
      publicProfiles = publicProfiles.map((profile) =>
        profile.id === userId
          ? {
              ...profile,
              followerCount: Math.max(0, profile.followerCount - (profile.isFollowing ? 1 : 0)),
              isFollowing: false,
            }
          : profile,
      );

      return cloneOne(requirePublicProfile(publicProfiles, userId));
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

function requirePublicProfile(profiles: PublicProfile[], id: string) {
  const profile = profiles.find((item) => item.id === id);

  if (!profile) {
    throw createApiDomainError(404, "not_found", "Public profile not found");
  }

  return profile;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isPublicContentVisible(item: PublicContentItem, concepts: Concept[]) {
  const mutableConcept = concepts.find((concept) => concept.id === item.id && concept.slug === item.slug);
  return !mutableConcept || mutableConcept.visibility === "public";
}

function toPublicContentDetail(concept: Concept): PublicContentDetail {
  return {
    createdAt: concept.createdAt,
    id: concept.id,
    ownerId: concept.ownerId,
    sections: clone(concept.sections),
    slug: concept.slug,
    status: concept.status,
    summary: concept.summary,
    tags: [...concept.tags],
    title: concept.title,
    updatedAt: concept.updatedAt,
    visibility: "public",
  };
}

function getNextIntervalDays(current: number, rating: string) {
  if (rating === "again" || rating === "hard") {
    return 1;
  }

  if (rating === "easy") {
    return Math.max(7, current * 2);
  }

  return Math.max(3, current + 2);
}

function getNextEase(current: number, rating: string) {
  if (rating === "again" || rating === "hard") {
    return Math.max(1.3, Number((current - 0.2).toFixed(2)));
  }

  if (rating === "easy") {
    return Number((current + 0.15).toFixed(2));
  }

  return current;
}

function addDaysIso(value: string, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function toPublicAuthor(user: User) {
  return {
    avatarUrl: user.avatarUrl,
    displayName: user.displayName,
    id: user.id,
    level: user.level,
  };
}

function clone<T>(value: T[]): T[] {
  return value.map((item) => cloneOne(item));
}

function cloneOne<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
