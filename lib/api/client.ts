import { getPublicEnv } from "@/lib/config/env";

export type ApiFetcher = (input: string, init?: RequestInit) => Promise<Response>;

export type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: BodyInit | JsonBody | null;
};

export type JsonBody = Array<unknown> | Record<string, unknown>;

export type ApiClient = {
  request<TResponse>(path: string, init?: ApiRequestInit): Promise<TResponse>;
};

export class ApiError extends Error {
  readonly payload: unknown;
  readonly status: number;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function createApiClient({
  baseUrl = getPublicEnv().apiBaseUrl,
  fetcher = globalThis.fetch,
}: {
  baseUrl?: string;
  fetcher?: ApiFetcher;
} = {}): ApiClient {
  if (!fetcher) {
    throw new Error("Fetch API is not available in this environment.");
  }

  return {
    async request<TResponse>(path: string, init: ApiRequestInit = {}): Promise<TResponse> {
      const headers = new Headers(init.headers);
      headers.set("accept", headers.get("accept") ?? "application/json");

      const { body, ...rest } = init;
      const requestInit: RequestInit = {
        ...rest,
        headers,
      };

      if (body != null) {
        if (isJsonBody(body)) {
          headers.set("content-type", headers.get("content-type") ?? "application/json");
          requestInit.body = JSON.stringify(body);
        } else {
          requestInit.body = body;
        }
      }

      const response = await fetcher(joinUrl(baseUrl, path), requestInit);
      const payload = await parsePayload(response);

      if (!response.ok) {
        throw new ApiError(getErrorMessage(payload, response.statusText), response.status, payload);
      }

      return payload as TResponse;
    },
  };
}

function joinUrl(baseUrl: string, path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function isJsonBody(body: BodyInit | JsonBody): body is JsonBody {
  if (body == null || typeof body !== "object") {
    return false;
  }

  if (body instanceof URLSearchParams) {
    return false;
  }

  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return false;
  }

  if (typeof Blob !== "undefined" && body instanceof Blob) {
    return false;
  }

  if (body instanceof ArrayBuffer) {
    return false;
  }

  return true;
}

async function parsePayload(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return JSON.parse(text);
  }

  return text;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null) {
    const message = "message" in payload ? payload.message : undefined;
    const error = "error" in payload ? payload.error : undefined;

    if (typeof message === "string") {
      return message;
    }

    if (typeof error === "string") {
      return error;
    }
  }

  return fallback || "API request failed";
}
