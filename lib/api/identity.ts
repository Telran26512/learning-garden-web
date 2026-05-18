import { createApiClient, type ApiClient } from "@/lib/api/http";

export type UserRole = "user" | "admin";

export type CurrentUser = {
  id: string;
  email: string;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  role: UserRole;
};

export type SessionResponse = {
  user: CurrentUser | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export function getCurrentSession(
  client: ApiClient = createApiClient(),
): Promise<SessionResponse> {
  return client.get<SessionResponse>("/auth/session");
}

export function login(
  input: LoginRequest,
  client: ApiClient = createApiClient(),
): Promise<SessionResponse> {
  return client.post<SessionResponse>("/auth/login", input);
}

export function logout(client: ApiClient = createApiClient()): Promise<void> {
  return client.post<void>("/auth/logout");
}
