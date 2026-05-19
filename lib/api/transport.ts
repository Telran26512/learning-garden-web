import { createApiClient } from "@/lib/api/client";
import { createHttpTransport } from "@/lib/api/transport-http";
import { createMockApiRepository } from "@/lib/api/mock/repository";
import { createMockTransport } from "@/lib/api/mock/transport";
import { getPublicEnv } from "@/lib/config/env";

export type ApiMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export type ApiTransport = {
  request<TResponse>(method: ApiMethod, path: string, body?: unknown): Promise<TResponse>;
};

let transport: ApiTransport | null = null;

export function getApiTransport(): ApiTransport {
  if (transport) {
    return transport;
  }

  const env = getPublicEnv();
  transport =
    env.apiMode === "http"
      ? createHttpTransport(createApiClient({ baseUrl: env.apiBaseUrl }))
      : createMockTransport(createMockApiRepository());

  return transport;
}

export function setApiTransportForTests(nextTransport: ApiTransport | null) {
  transport = nextTransport;
}
