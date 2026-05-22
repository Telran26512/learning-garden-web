import type { P7Notification, P7NotificationEvent } from "@/lib/api/p7";

export type HeaderNotificationItem = {
  body: string;
  id: string;
  title: string;
  unread: boolean;
};

export type NotificationState = {
  error: string | null;
  items: P7Notification[];
  unread: number;
};

export const emptyNotificationState: NotificationState = {
  error: null,
  items: [],
  unread: 0,
};

export function notificationStateFromResult(input: {
  items: P7Notification[];
  unread: number;
}): NotificationState {
  return {
    error: null,
    items: sortNotifications(input.items),
    unread: input.unread,
  };
}

export function applyNotificationEvent(
  state: NotificationState,
  event: P7NotificationEvent,
): NotificationState {
  return {
    error: null,
    items: mergeNotifications(event.items, state.items),
    unread: event.unread,
  };
}

export function markNotificationStateRead(
  state: NotificationState,
): NotificationState {
  const readAt = new Date().toISOString();
  return {
    ...state,
    items: state.items.map((item) => ({
      ...item,
      readAt: item.readAt ?? readAt,
    })),
    unread: 0,
  };
}

export function notificationMenuItems(
  notifications: P7Notification[],
): HeaderNotificationItem[] {
  return notifications.slice(0, 6).map((notification) => ({
    body: notificationBody(notification),
    id: notification.id,
    title: notificationTitle(notification),
    unread: !notification.readAt,
  }));
}

function mergeNotifications(
  incoming: P7Notification[],
  existing: P7Notification[],
) {
  const byID = new Map<string, P7Notification>();
  for (const item of incoming) {
    byID.set(item.id, item);
  }
  for (const item of existing) {
    if (!byID.has(item.id)) {
      byID.set(item.id, item);
    }
  }
  return sortNotifications(Array.from(byID.values()));
}

function sortNotifications(notifications: P7Notification[]) {
  return [...notifications].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

function notificationTitle(notification: P7Notification) {
  const actor =
    notification.actorName || notification.actorHandle || "Synapse 用户";
  switch (notification.kind) {
    case "comment":
      return `${actor} 评论了你的 Note`;
    case "discussion":
      return `${actor} 发起了讨论`;
    case "follow":
      return `${actor} 关注了你`;
    case "mention":
      return `${actor} 提到了你`;
    case "reaction":
      return `${actor} 与你的内容互动`;
    default:
      return "新的社区通知";
  }
}

function notificationBody(notification: P7Notification) {
  const title = notification.metadata.contentTitle;
  if (typeof title === "string" && title.trim()) {
    return title;
  }
  if (notification.contentId) {
    return `content · ${notification.contentId.slice(0, 8)}`;
  }
  return "打开查看详情";
}
