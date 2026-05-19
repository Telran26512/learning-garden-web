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
  const [pathname] = path.split("?");

  if (method === "GET" && pathname === "/auth/me") {
    return repository.getCurrentUser();
  }

  if (method === "POST" && pathname === "/auth/login") {
    return repository.login();
  }

  if (method === "POST" && pathname === "/auth/logout") {
    return repository.logout();
  }

  if (method === "GET" && pathname === "/concepts") {
    return repository.listConcepts();
  }

  if (method === "POST" && pathname === "/concepts") {
    return repository.createConcept(body as never);
  }

  const conceptMatch = pathname?.match(/^\/concepts\/([^/]+)$/);
  if (conceptMatch && method === "GET") {
    return repository.getConcept(decodeURIComponent(conceptMatch[1]!));
  }

  if (conceptMatch && method === "PATCH") {
    return repository.updateConcept(decodeURIComponent(conceptMatch[1]!), body as never);
  }

  if (method === "GET" && pathname === "/learning/roadmap") {
    return repository.getRoadmap();
  }

  const taskMatch = pathname?.match(/^\/learning\/tasks\/([^/]+)$/);
  if (taskMatch && method === "PATCH") {
    return repository.updateRoadmapTask(decodeURIComponent(taskMatch[1]!), body as never);
  }

  if (method === "GET" && pathname === "/learning/review-queue") {
    return repository.getReviewQueue();
  }

  const reviewMatch = pathname?.match(/^\/learning\/review-cards\/([^/]+)\/answer$/);
  if (reviewMatch && method === "POST") {
    return repository.answerReviewCard(decodeURIComponent(reviewMatch[1]!), body as never);
  }

  if (method === "POST" && pathname === "/runtime/python-runs") {
    const request = body as { code?: string };
    return repository.runPython(request.code ?? "");
  }

  if (method === "GET" && pathname === "/admin/overview") {
    return repository.getAdminOverview();
  }

  if (method === "GET" && pathname === "/admin/moderation-queue") {
    return repository.getModerationQueue();
  }

  throw new Error(`Unhandled mock API request: ${method} ${path}`);
}
