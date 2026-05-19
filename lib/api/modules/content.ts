import type {
  Concept,
  CreateConceptInput,
  ListConceptsQuery,
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
  updateConcept(id: string, input: UpdateConceptInput) {
    return getApiTransport().request<Concept>("PATCH", `/concepts/${encodeURIComponent(id)}`, input);
  },
};
