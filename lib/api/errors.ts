import type { ApiErrorPayload } from "@/lib/api/contracts";

export class ApiDomainError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly status: number;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiDomainError";
    this.status = status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

export function createApiDomainError(
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
) {
  return new ApiDomainError(status, { code, details, message });
}

export function normalizeApiError(error: unknown): ApiDomainError {
  if (error instanceof ApiDomainError) {
    return error;
  }

  if (error instanceof Error) {
    return createApiDomainError(500, "unknown_error", error.message);
  }

  return createApiDomainError(500, "unknown_error", "Unknown API error");
}
