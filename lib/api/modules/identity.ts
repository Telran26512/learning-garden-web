import type { LoginRequest, LoginResponse, User } from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const identityApi = {
  getMe() {
    return getApiTransport().request<User>("GET", "/auth/me");
  },
  login(input: LoginRequest) {
    return getApiTransport().request<LoginResponse>("POST", "/auth/login", input);
  },
  logout() {
    return getApiTransport().request<void>("POST", "/auth/logout");
  },
};
