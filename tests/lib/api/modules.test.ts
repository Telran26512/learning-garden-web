import { describe, expect, it } from "vitest";
import { adminApi, contentApi, identityApi, learningApi, runtimeApi } from "@/lib/api";

describe("domain API modules", () => {
  it("loads identity, content, learning, runtime, and admin data through facades", async () => {
    await expect(identityApi.getMe()).resolves.toMatchObject({ id: "user_raymond" });
    await expect(contentApi.listConcepts()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "concept_linear_regression" })]),
    );
    await expect(learningApi.getRoadmap()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "task_ols_bias" })]),
    );
    await expect(runtimeApi.runPython({ code: "print('hello')" })).resolves.toMatchObject({
      status: "succeeded",
    });
    await expect(adminApi.getOverview()).resolves.toMatchObject({
      moderationPendingCount: expect.any(Number),
    });
  });
});
