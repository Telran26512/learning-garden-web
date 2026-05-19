import { readdirSync, readFileSync, statSync } from "node:fs";
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
      expect(content, file).not.toContain("@/lib/api/mock/fixtures");
      expect(content, file).not.toContain("synapse-data");
    }
  });

  it("keeps app, components, and features away from the legacy demo layer", () => {
    for (const file of walkSourceFiles(["app", "components", "features"])) {
      const content = readFileSync(join(process.cwd(), file), "utf8");
      expect(content, file).not.toContain("@/lib/demo");
      expect(content, file).not.toContain("@/lib/api/mock/fixtures");
      expect(content, file).not.toContain("synapse-data");
    }
  });
});

function walkSourceFiles(roots: string[]) {
  const files: string[] = [];

  for (const root of roots) {
    visit(root);
  }

  return files.filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"));

  function visit(path: string) {
    const absolute = join(process.cwd(), path);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      for (const entry of readdirSync(absolute)) {
        visit(join(path, entry));
      }
      return;
    }

    files.push(path);
  }
}
