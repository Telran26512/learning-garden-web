import type { AdminOverview, ModerationQueueItem } from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const adminApi = {
  getModerationQueue() {
    return getApiTransport().request<ModerationQueueItem[]>("GET", "/admin/moderation-queue");
  },
  getOverview() {
    return getApiTransport().request<AdminOverview>("GET", "/admin/overview");
  },
};
