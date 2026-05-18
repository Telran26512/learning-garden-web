import { resolveApiUrl } from "@/lib/api/config";

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type JsonRecord = Record<string, unknown>;

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export type ApiClientOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

export type ApiClient = ReturnType<typeof createApiClient>;

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function errorMessageFromBody(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof (body as JsonRecord).message === "string"
  ) {
    return (body as JsonRecord).message as string;
  }

  return fallback;
}

export function createApiClient(options: ApiClientOptions = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);

    if (init.body && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    const response = await fetchImpl(resolveApiUrl(path, options.baseUrl), {
      ...init,
      credentials: "include",
      headers,
    });
    const body = await readResponseBody(response);

    if (!response.ok) {
      throw new ApiError(
        errorMessageFromBody(body, response.statusText),
        response.status,
        body,
      );
    }

    return body as T;
  }

  return {
    request,
    get: <T>(path: string, init?: RequestInit) =>
      request<T>(path, { ...init, method: "GET" }),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>(path, {
        ...init,
        body: body === undefined ? undefined : JSON.stringify(body),
        method: "POST",
      }),
    put: <T>(path: string, body?: unknown, init?: RequestInit) =>
      request<T>(path, {
        ...init,
        body: body === undefined ? undefined : JSON.stringify(body),
        method: "PUT",
      }),
    delete: <T>(path: string, init?: RequestInit) =>
      request<T>(path, { ...init, method: "DELETE" }),
  };
}
