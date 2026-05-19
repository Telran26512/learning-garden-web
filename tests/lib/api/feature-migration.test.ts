import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("feature API migration", () => {
  it("keeps workspace and concept screens away from direct demo fixtures", () => {
    const files = [
      "features/workspace/workspace-route.tsx",
      "features/workspace/workspace-screen.tsx",
      "features/concepts/concept-route.tsx",
      "features/concepts/concept-screen.tsx",
      "features/studio/studio-route.tsx",
      "features/studio/studio-screen.tsx",
      "features/review/review-route.tsx",
      "features/review/review-screen.tsx",
      "features/auth/login-screen.tsx",
      "features/admin/admin-screen.tsx",
    ];

    for (const file of files) {
      const content = readFileSync(join(process.cwd(), file), "utf8");
      expect(content, file).not.toContain("@/lib/demo");
      expect(content, file).not.toContain("synapse-data");
    }
  });
});
