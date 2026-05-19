import type {
  AdminAction,
  ModerateContentInput,
  ModerationReport,
  RegistrationSettings,
  ResolveReportInput,
  RestrictUserInput,
  UpdateRegistrationInput,
} from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const moderationApi = {
  getAdminActions() {
    return getApiTransport().request<AdminAction[]>("GET", "/admin/actions");
  },
  getRegistration() {
    return getApiTransport().request<RegistrationSettings>("GET", "/admin/registration");
  },
  getReports() {
    return getApiTransport().request<ModerationReport[]>("GET", "/admin/reports");
  },
  moderateComment(id: string, input: ModerateContentInput) {
    return getApiTransport().request<AdminAction>(
      "POST",
      `/admin/comments/${encodeURIComponent(id)}/moderate`,
      input,
    );
  },
  moderateContent(id: string, input: ModerateContentInput) {
    return getApiTransport().request<AdminAction>(
      "POST",
      `/admin/content/${encodeURIComponent(id)}/moderate`,
      input,
    );
  },
  resolveReport(id: string, input: ResolveReportInput) {
    return getApiTransport().request<ModerationReport>(
      "POST",
      `/admin/reports/${encodeURIComponent(id)}/resolve`,
      input,
    );
  },
  restrictUser(id: string, input: RestrictUserInput) {
    return getApiTransport().request<AdminAction>(
      "POST",
      `/admin/users/${encodeURIComponent(id)}/restrict`,
      input,
    );
  },
  updateRegistration(input: UpdateRegistrationInput) {
    return getApiTransport().request<RegistrationSettings>("PATCH", "/admin/registration", input);
  },
};
