import { describe, expect, it } from "vitest";

import { analyzePasswordStrength } from "./password-strength";

describe("analyzePasswordStrength", () => {
  it("marks short simple passwords as weak", () => {
    const result = analyzePasswordStrength("abc123");

    expect(result.label).toBe("弱");
    expect(result.score).toBeLessThan(2);
  });

  it("rewards length and mixed character classes", () => {
    const result = analyzePasswordStrength("Synapse-2026-private");

    expect(result.label).toBe("强");
    expect(result.score).toBe(4);
  });
});
