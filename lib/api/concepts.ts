import { createApiClient, type ApiClient } from "@/lib/api/http";

export type Visibility = "private" | "public";

export type ConceptSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  visibility: Visibility;
  stage: number | null;
  week: number | null;
  tags: string[];
  updatedAt: string;
};

export type ListConceptsResponse = {
  concepts: ConceptSummary[];
};

export function listConcepts(
  client: ApiClient = createApiClient(),
): Promise<ListConceptsResponse> {
  return client.get<ListConceptsResponse>("/concepts");
}
