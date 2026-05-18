import { afterEach, describe, expect, it } from "vitest";
import { getApiBaseUrl, resolveApiUrl } from "@/lib/api/config";

const originalPublicBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const originalServerBaseUrl = process.env.SERVER_API_BASE_URL;

afterEach(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = originalPublicBaseUrl;
  process.env.SERVER_API_BASE_URL = originalServerBaseUrl;
});

describe("getApiBaseUrl", () => {
  it("prefers the server-only API base URL when it is present", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://public.test";
    process.env.SERVER_API_BASE_URL = "http://server.test";

    expect(getApiBaseUrl()).toBe("http://server.test");
  });

  it("falls back to the public API base URL", () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://public.test";
    delete process.env.SERVER_API_BASE_URL;

    expect(getApiBaseUrl()).toBe("http://public.test");
  });
});

describe("resolveApiUrl", () => {
  it("prefixes resource paths with the versioned REST API root", () => {
    expect(resolveApiUrl("/concepts", "http://api.test").href).toBe(
      "http://api.test/api/v1/concepts",
    );
  });

  it("does not duplicate the versioned REST API root", () => {
    expect(resolveApiUrl("/api/v1/concepts", "http://api.test").href).toBe(
      "http://api.test/api/v1/concepts",
    );
  });
});
