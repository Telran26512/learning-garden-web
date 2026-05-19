import type { Backlink, KnowledgeGraph } from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const relationApi = {
  getBacklinks(query: { targetId: string }) {
    const search = new URLSearchParams({ targetId: query.targetId });
    return getApiTransport().request<Backlink[]>(
      "GET",
      `/relations/backlinks?${search.toString()}`,
    );
  },
  getGraph() {
    return getApiTransport().request<KnowledgeGraph>("GET", "/relations/graph");
  },
};
