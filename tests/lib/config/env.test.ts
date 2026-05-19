import { describe, expect, it } from "vitest";
import { getPublicEnv, normalizeApiBaseUrl } from "@/lib/config/env";

describe("env", () => {
  it("normalizes API base URLs by trimming whitespace and trailing slashes", () => {
    expect(normalizeApiBaseUrl(" https://api.example.com/api/v1/// ")).toBe(
      "https://api.example.com/api/v1",
    );
  });

  it("supports relative API base URLs for same-origin deployments", () => {
    expect(normalizeApiBaseUrl("/api/v1/")).toBe("/api/v1");
  });

  it("builds public env defaults for local development", () => {
    expect(getPublicEnv({}).apiBaseUrl).toBe("http://localhost:3001/api/v1");
    expect(getPublicEnv({}).appEnv).toBe("local");
    expect(getPublicEnv({}).isMockApiEnabled).toBe(true);
  });

  it("rejects unsafe API base URL protocols", () => {
    expect(() => normalizeApiBaseUrl("ftp://api.example.com")).toThrow(/API base URL/);
  });
});
