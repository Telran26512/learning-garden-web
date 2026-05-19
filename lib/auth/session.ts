export type SynapseUser = {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "suspended" | "banned";
};

type APIEnvelope<T> = {
  data: T | null;
  error: { code: string; message?: string } | null;
  meta: Record<string, unknown>;
};

type SessionPayload = {
  accessToken: string;
  user: SynapseUser;
};

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export async function register(input: {
  inviteCode?: string;
  email: string;
  handle: string;
  displayName: string;
  password: string;
}) {
  const session = await authRequest<SessionPayload>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setAccessToken(session.accessToken);
  return session.user;
}

export async function login(input: { email: string; password: string }) {
  const session = await authRequest<SessionPayload>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setAccessToken(session.accessToken);
  return session.user;
}

export async function logout() {
  try {
    await fetch(apiURL("/auth/logout"), {
      method: "POST",
      credentials: "include",
      headers: authHeaders(),
    });
  } finally {
    clearAccessToken();
  }
}

export async function requestCurrentUser() {
  const current = await requestMe();
  if (current.status !== 401) {
    return current.user;
  }

  const refreshed = await refreshSession();
  if (!refreshed) {
    clearAccessToken();
    return null;
  }

  const retried = await requestMe();
  return retried.user;
}

async function requestMe(): Promise<{
  status: number;
  user: SynapseUser | null;
}> {
  const response = await fetch(apiURL("/auth/me"), {
    method: "GET",
    credentials: "include",
    headers: authHeaders(),
  });
  if (response.status === 401) {
    return { status: 401, user: null };
  }
  if (!response.ok) {
    throw new Error(`Failed to load current user (${response.status})`);
  }
  const envelope = (await response.json()) as APIEnvelope<SynapseUser>;
  return { status: response.status, user: envelope.data };
}

async function refreshSession() {
  const response = await fetch(apiURL("/auth/refresh"), {
    method: "POST",
    credentials: "include",
    headers: baseHeaders(),
  });
  if (!response.ok) {
    return null;
  }
  const envelope = (await response.json()) as APIEnvelope<SessionPayload>;
  if (!envelope.data?.accessToken) {
    return null;
  }
  setAccessToken(envelope.data.accessToken);
  return envelope.data;
}

async function authRequest<T>(path: string, init: RequestInit) {
  const response = await fetch(apiURL(path), {
    ...init,
    credentials: "include",
    headers: {
      ...baseHeaders(),
      ...init.headers,
    },
  });
  const envelope = (await response.json()) as APIEnvelope<T>;
  if (!response.ok || !envelope.data) {
    throw new Error(
      envelope.error?.message ?? `Request failed (${response.status})`,
    );
  }
  return envelope.data;
}

function authHeaders() {
  const headers = baseHeaders();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

function baseHeaders() {
  return {
    "Content-Type": "application/json",
  } as Record<string, string>;
}

function apiURL(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:18080";
  return `${base}${path}`;
}
