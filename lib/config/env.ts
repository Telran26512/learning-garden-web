export type AppEnv = "development" | "local" | "production" | "test";

export type ApiMode = "http" | "mock";

export type PublicEnv = {
  apiMode: ApiMode;
  apiBaseUrl: string;
  appEnv: AppEnv;
  isMockApiEnabled: boolean;
};

type EnvSource = Record<string, string | undefined>;

const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";

export function normalizeApiBaseUrl(value: string | undefined): string {
  const trimmed = value?.trim() || DEFAULT_API_BASE_URL;
  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  const normalized = withoutTrailingSlash || "/";

  if (normalized.startsWith("/")) {
    return normalized;
  }

  if (!/^https?:\/\//.test(normalized)) {
    throw new Error("API base URL must use http(s) or be a same-origin relative path.");
  }

  return normalized;
}

export function getPublicEnv(source: EnvSource = getProcessEnv()): PublicEnv {
  const appEnv = normalizeAppEnv(source.NEXT_PUBLIC_APP_ENV ?? source.NODE_ENV);

  return {
    apiMode: normalizeApiMode(source.NEXT_PUBLIC_API_MODE),
    apiBaseUrl: normalizeApiBaseUrl(source.NEXT_PUBLIC_API_BASE_URL),
    appEnv,
    isMockApiEnabled: parseBoolean(source.NEXT_PUBLIC_MOCK_API, appEnv !== "production"),
  };
}

function normalizeApiMode(value: string | undefined): ApiMode {
  if (value === "http" || value === "mock") {
    return value;
  }

  return "mock";
}

function normalizeAppEnv(value: string | undefined): AppEnv {
  if (value === "development" || value === "production" || value === "test" || value === "local") {
    return value;
  }

  if (value === "dev") {
    return "development";
  }

  return "local";
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value.trim() === "") {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function getProcessEnv(): EnvSource {
  return typeof process === "undefined" ? {} : process.env;
}
