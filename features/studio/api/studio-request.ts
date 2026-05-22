import { getAccessToken } from "../../../lib/auth/session";

type APIEnvelope<T> = {
  data: T | null;
  error: { code: string; message?: string } | null;
  meta?: Record<string, unknown>;
};

export async function studioRequest<T = unknown>(
  path: string,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiURL(path), {
    ...init,
    credentials: "include",
    headers,
    method: init.method ?? "GET",
  });
  const envelope = (await response.json()) as APIEnvelope<T>;

  if (!response.ok || !envelope.data) {
    throw new Error(
      envelope.error?.message ?? `Studio request failed (${response.status})`,
    );
  }

  return envelope.data;
}

function apiURL(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18080";
  return `${base}${path}`;
}
