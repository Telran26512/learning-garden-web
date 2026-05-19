import type {
  AdminAction,
  AdminOverview,
  ModerationQueueItem,
  ModerationReport,
  RegistrationSettings,
} from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const adminApi = {
  getAdminActions() {
    return getApiTransport().request<AdminAction[]>("GET", "/admin/actions");
  },
  getModerationQueue() {
    return getApiTransport().request<ModerationQueueItem[]>("GET", "/admin/moderation-queue");
  },
  getOverview() {
    return getApiTransport().request<AdminOverview>("GET", "/admin/overview");
  },
  getRegistration() {
    return getApiTransport().request<RegistrationSettings>("GET", "/admin/registration");
  },
  getReports() {
    return getApiTransport().request<ModerationReport[]>("GET", "/admin/reports");
  },
};
