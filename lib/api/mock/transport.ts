import type { ApiMethod, ApiTransport } from "@/lib/api/transport";
import type { MockApiRepository } from "@/lib/api/mock/repository";
import { mockLatency } from "@/lib/api/mock/latency";

export function createMockTransport(repository: MockApiRepository): ApiTransport {
  return {
    async request<TResponse>(method: ApiMethod, path: string, body?: unknown) {
      await mockLatency();
      return handleRequest(repository, method, path, body) as TResponse;
    },
  };
}

function handleRequest(
  repository: MockApiRepository,
  method: ApiMethod,
  path: string,
  body: unknown,
) {
  if (method === "GET" && path === "/auth/me") {
    return repository.getCurrentUser();
  }

  if (method === "POST" && path === "/auth/login") {
    return repository.login();
  }

  if (method === "POST" && path === "/auth/logout") {
    return repository.logout();
  }

  if (method === "GET" && path === "/concepts") {
    return repository.listConcepts();
  }

  if (method === "POST" && path === "/concepts") {
    return repository.createConcept(body as never);
  }

  const conceptMatch = path.match(/^\/concepts\/([^/]+)$/);
  if (conceptMatch && method === "GET") {
    return repository.getConcept(decodeURIComponent(conceptMatch[1]!));
  }

  if (conceptMatch && method === "PATCH") {
    return repository.updateConcept(decodeURIComponent(conceptMatch[1]!), body as never);
  }

  if (method === "GET" && path === "/learning/roadmap") {
    return repository.getRoadmap();
  }

  const taskMatch = path.match(/^\/learning\/tasks\/([^/]+)$/);
  if (taskMatch && method === "PATCH") {
    return repository.updateRoadmapTask(decodeURIComponent(taskMatch[1]!), body as never);
  }

  if (method === "GET" && path === "/learning/review-queue") {
    return repository.getReviewQueue();
  }

  const reviewMatch = path.match(/^\/learning\/review-cards\/([^/]+)\/answer$/);
  if (reviewMatch && method === "POST") {
    return repository.answerReviewCard(decodeURIComponent(reviewMatch[1]!), body as never);
  }

  if (method === "POST" && path === "/runtime/python-runs") {
    const request = body as { code?: string };
    return repository.runPython(request.code ?? "");
  }

  if (method === "GET" && path === "/admin/overview") {
    return repository.getAdminOverview();
  }

  if (method === "GET" && path === "/admin/moderation-queue") {
    return repository.getModerationQueue();
  }

  throw new Error(`Unhandled mock API request: ${method} ${path}`);
}
