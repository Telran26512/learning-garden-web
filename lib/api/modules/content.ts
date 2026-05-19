import type {
  Concept,
  CreateConceptInput,
  ListConceptsQuery,
  ListPublicContentQuery,
  PublicContentDetail,
  PublicContentItem,
  PublicProfile,
  UpdateConceptInput,
} from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const contentApi = {
  createConcept(input: CreateConceptInput) {
    return getApiTransport().request<Concept>("POST", "/concepts", input);
  },
  getConcept(id: string) {
    return getApiTransport().request<Concept>("GET", `/concepts/${encodeURIComponent(id)}`);
  },
  listConcepts(query: ListConceptsQuery = {}) {
    const search = new URLSearchParams();
    if (query.owner) search.set("owner", query.owner);
    if (query.visibility) search.set("visibility", query.visibility);
    const suffix = search.size > 0 ? `?${search.toString()}` : "";

    return getApiTransport().request<Concept[]>("GET", `/concepts${suffix}`);
  },
  getPublicContent(slug: string) {
    return getApiTransport().request<PublicContentDetail>(
      "GET",
      `/content/public/${encodeURIComponent(slug)}`,
    );
  },
  getPublicProfile(id: string) {
    return getApiTransport().request<PublicProfile>(
      "GET",
      `/users/${encodeURIComponent(id)}/public-profile`,
    );
  },
  listPublicContent(query: ListPublicContentQuery = {}) {
    const search = new URLSearchParams();
    if (query.contentType) search.set("contentType", query.contentType);
    if (query.ownerId) search.set("ownerId", query.ownerId);
    if (query.tag) search.set("tag", query.tag);
    const suffix = search.size > 0 ? `?${search.toString()}` : "";

    return getApiTransport().request<PublicContentItem[]>("GET", `/content/public${suffix}`);
  },
  updateConcept(id: string, input: UpdateConceptInput) {
    return getApiTransport().request<Concept>(
      "PATCH",
      `/concepts/${encodeURIComponent(id)}`,
      input,
    );
  },
};
