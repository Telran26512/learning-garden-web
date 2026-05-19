import type { Portfolio } from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const portfolioApi = {
  getPortfolio(userId: string) {
    return getApiTransport().request<Portfolio>(
      "GET",
      `/portfolio/${encodeURIComponent(userId)}`,
    );
  },
};
