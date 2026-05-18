const API_VERSION_ROOT = "/api/v1";
const DEFAULT_API_BASE_URL = "http://localhost:8080";

export function getApiBaseUrl(): string {
  return (
    process.env.SERVER_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_API_BASE_URL
  );
}

export function resolveApiUrl(path: string, baseUrl = getApiBaseUrl()): URL {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const versionedPath = normalizedPath.startsWith(API_VERSION_ROOT)
    ? normalizedPath
    : `${API_VERSION_ROOT}${normalizedPath}`;

  return new URL(versionedPath, `${normalizedBaseUrl}/`);
}
