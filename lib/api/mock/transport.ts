import type { ApiMethod, ApiTransport } from "@/lib/api/transport";
import type { CommentTargetType, ListPublicContentQuery } from "@/lib/api/contracts";
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
  const [pathname, queryString] = path.split("?");
  const searchParams = new URLSearchParams(queryString);

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

  if (method === "GET" && pathname === "/content/public") {
    return repository.listPublicContent({
      contentType: readPublicContentType(searchParams),
      ownerId: searchParams.get("ownerId") ?? undefined,
      tag: searchParams.get("tag") ?? undefined,
    });
  }

  const publicContentMatch = pathname?.match(/^\/content\/public\/([^/]+)$/);
  if (publicContentMatch && method === "GET") {
    return repository.getPublicContent(decodeURIComponent(publicContentMatch[1]!));
  }

  const publicProfileMatch = pathname?.match(/^\/users\/([^/]+)\/public-profile$/);
  if (publicProfileMatch && method === "GET") {
    return repository.getPublicProfile(decodeURIComponent(publicProfileMatch[1]!));
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

  if (method === "GET" && pathname === "/social/feed") {
    return repository.getFeed();
  }

  if (method === "GET" && pathname === "/social/discussions") {
    return repository.getDiscussions();
  }

  if (method === "POST" && pathname === "/social/discussions") {
    return repository.createDiscussion(body as never);
  }

  const discussionReplyMatch = pathname?.match(/^\/social\/discussions\/([^/]+)\/replies$/);
  if (discussionReplyMatch && method === "POST") {
    return repository.replyToDiscussion(decodeURIComponent(discussionReplyMatch[1]!), body as never);
  }

  if (method === "GET" && pathname === "/social/notifications") {
    return repository.getNotifications();
  }

  const notificationMatch = pathname?.match(/^\/social\/notifications\/([^/]+)$/);
  if (notificationMatch && method === "PATCH") {
    return repository.markNotificationRead(decodeURIComponent(notificationMatch[1]!));
  }

  if (method === "POST" && pathname === "/social/follows") {
    return repository.followUser((body as { userId?: string }).userId ?? "");
  }

  const followMatch = pathname?.match(/^\/social\/follows\/([^/]+)$/);
  if (followMatch && method === "DELETE") {
    return repository.unfollowUser(decodeURIComponent(followMatch[1]!));
  }

  if (method === "GET" && pathname === "/comments") {
    return repository.getComments(
      searchParams.get("targetId") ?? "",
      readCommentTargetType(searchParams),
    );
  }

  if (method === "POST" && pathname === "/comments") {
    return repository.createComment(body as never);
  }

  const commentMatch = pathname?.match(/^\/comments\/([^/]+)$/);
  if (commentMatch && method === "DELETE") {
    return repository.deleteComment(decodeURIComponent(commentMatch[1]!));
  }

  if (method === "GET" && pathname === "/relations/graph") {
    return repository.getGraph();
  }

  if (method === "GET" && pathname === "/relations/backlinks") {
    return repository.getBacklinks(searchParams.get("targetId") ?? "");
  }

  const portfolioMatch = pathname?.match(/^\/portfolio\/([^/]+)$/);
  if (portfolioMatch && method === "GET") {
    return repository.getPortfolio(decodeURIComponent(portfolioMatch[1]!));
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

  if (method === "GET" && pathname === "/admin/reports") {
    return repository.getReports();
  }

  const reportResolveMatch = pathname?.match(/^\/admin\/reports\/([^/]+)\/resolve$/);
  if (reportResolveMatch && method === "POST") {
    return repository.resolveReport(decodeURIComponent(reportResolveMatch[1]!), body as never);
  }

  const adminContentModerateMatch = pathname?.match(/^\/admin\/content\/([^/]+)\/moderate$/);
  if (adminContentModerateMatch && method === "POST") {
    return repository.moderateContent(
      decodeURIComponent(adminContentModerateMatch[1]!),
      body as never,
    );
  }

  const adminCommentModerateMatch = pathname?.match(/^\/admin\/comments\/([^/]+)\/moderate$/);
  if (adminCommentModerateMatch && method === "POST") {
    return repository.moderateComment(
      decodeURIComponent(adminCommentModerateMatch[1]!),
      body as never,
    );
  }

  const adminUserRestrictMatch = pathname?.match(/^\/admin\/users\/([^/]+)\/restrict$/);
  if (adminUserRestrictMatch && method === "POST") {
    return repository.restrictUser(decodeURIComponent(adminUserRestrictMatch[1]!), body as never);
  }

  if (method === "GET" && pathname === "/admin/registration") {
    return repository.getRegistration();
  }

  if (method === "PATCH" && pathname === "/admin/registration") {
    return repository.updateRegistration(body as never);
  }

  if (method === "GET" && pathname === "/admin/actions") {
    return repository.getAdminActions();
  }

  throw new Error(`Unhandled mock API request: ${method} ${path}`);
}

function readCommentTargetType(searchParams: URLSearchParams): CommentTargetType {
  const value = searchParams.get("targetType");

  if (value === "discussion") {
    return "discussion";
  }

  return "content";
}

function readPublicContentType(
  searchParams: URLSearchParams,
): ListPublicContentQuery["contentType"] {
  const value = searchParams.get("contentType");

  if (value === "all" || value === "concept" || value === "experiment" || value === "paper") {
    return value;
  }

  return undefined;
}
