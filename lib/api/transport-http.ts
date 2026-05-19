import type { ApiClient } from "@/lib/api/client";
import type { ApiMethod, ApiTransport } from "@/lib/api/transport";

export function createHttpTransport(client: ApiClient): ApiTransport {
  return {
    request<TResponse>(method: ApiMethod, path: string, body?: unknown) {
      return client.request<TResponse>(path, {
        body: isBodyMethod(method) ? toRequestBody(body) : undefined,
        method,
      });
    },
  };
}

function isBodyMethod(method: ApiMethod) {
  return method !== "GET" && method !== "DELETE";
}

function toRequestBody(body: unknown) {
  if (body == null || typeof body === "string" || body instanceof FormData) {
    return body;
  }

  if (typeof body === "object") {
    return body as Record<string, unknown>;
  }

  return { value: body };
}
