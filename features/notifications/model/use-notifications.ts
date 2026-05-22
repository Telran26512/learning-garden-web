"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  connectNotificationEvents,
  fetchNotifications,
  markNotificationsRead,
} from "@/lib/api/p7";
import {
  applyNotificationEvent,
  emptyNotificationState,
  markNotificationStateRead,
  notificationMenuItems,
  notificationStateFromResult,
  type NotificationState,
} from "./notifications-model";

export function useNotifications(enabled: boolean) {
  const [state, setState] = useState<NotificationState>(emptyNotificationState);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let active = true;
    fetchNotifications({ limit: 6 })
      .then((result) => {
        if (active) {
          setState(notificationStateFromResult(result));
        }
      })
      .catch((error) => {
        if (active) {
          setState((current) => ({
            ...current,
            error: error instanceof Error ? error.message : "通知接口请求失败",
          }));
        }
      });

    const connection = connectNotificationEvents({
      onError: (error) => {
        setState((current) => ({
          ...current,
          error: error.message,
        }));
      },
      onEvent: (event) => {
        setState((current) => applyNotificationEvent(current, event));
      },
    });
    return () => {
      active = false;
      connection.close();
    };
  }, [enabled]);

  const markRead = useCallback(async () => {
    try {
      await markNotificationsRead();
      setState((current) => markNotificationStateRead(current));
    } catch (error) {
      setState((current) => ({
        ...current,
        error: error instanceof Error ? error.message : "通知已读状态同步失败",
      }));
    }
  }, []);

  return {
    error: state.error,
    items: useMemo(() => notificationMenuItems(state.items), [state.items]),
    markRead,
    unread: state.unread,
  };
}
