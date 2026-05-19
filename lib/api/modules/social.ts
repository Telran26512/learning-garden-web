import type {
  ActivityFeedItem,
  Comment,
  CommentTargetType,
  CreateCommentInput,
  CreateDiscussionInput,
  Discussion,
  NotificationItem,
  PublicProfile,
} from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const socialApi = {
  createComment(input: CreateCommentInput) {
    return getApiTransport().request<Comment>("POST", "/comments", input);
  },
  createDiscussion(input: CreateDiscussionInput) {
    return getApiTransport().request<Discussion>("POST", "/social/discussions", input);
  },
  deleteComment(id: string) {
    return getApiTransport().request<void>("DELETE", `/comments/${encodeURIComponent(id)}`);
  },
  followUser(userId: string) {
    return getApiTransport().request<PublicProfile>("POST", "/social/follows", { userId });
  },
  getComments(query: { targetId: string; targetType: CommentTargetType }) {
    const search = new URLSearchParams({ targetId: query.targetId, targetType: query.targetType });
    return getApiTransport().request<Comment[]>("GET", `/comments?${search.toString()}`);
  },
  getDiscussions() {
    return getApiTransport().request<Discussion[]>("GET", "/social/discussions");
  },
  getFeed() {
    return getApiTransport().request<ActivityFeedItem[]>("GET", "/social/feed");
  },
  getNotifications() {
    return getApiTransport().request<NotificationItem[]>("GET", "/social/notifications");
  },
  markNotificationRead(id: string) {
    return getApiTransport().request<NotificationItem>(
      "PATCH",
      `/social/notifications/${encodeURIComponent(id)}`,
      { read: true },
    );
  },
  replyToDiscussion(id: string, input: CreateCommentInput) {
    return getApiTransport().request<Comment>(
      "POST",
      `/social/discussions/${encodeURIComponent(id)}/replies`,
      input,
    );
  },
  unfollowUser(userId: string) {
    return getApiTransport().request<PublicProfile>(
      "DELETE",
      `/social/follows/${encodeURIComponent(userId)}`,
    );
  },
};
