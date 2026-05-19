import { describe, expect, it } from "vitest";
import {
  adminApi,
  contentApi,
  identityApi,
  learningApi,
  moderationApi,
  portfolioApi,
  relationApi,
  runtimeApi,
  socialApi,
} from "@/lib/api";

describe("domain API modules", () => {
  it("loads identity, content, learning, runtime, and admin data through facades", async () => {
    await expect(identityApi.getMe()).resolves.toMatchObject({ id: "user_raymond" });
    await expect(contentApi.listConcepts()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "concept_linear_regression" })]),
    );
    await expect(contentApi.listPublicContent({ tag: "线性回归" })).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ slug: "linear-regression-ols" })]),
    );
    await expect(contentApi.getPublicProfile("user_raymond")).resolves.toMatchObject({
      publicContentCount: expect.any(Number),
    });
    await expect(socialApi.getFeed()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: "published_content" })]),
    );
    await expect(socialApi.getNotifications()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "notification_comment_reply" })]),
    );
    await expect(relationApi.getGraph()).resolves.toMatchObject({
      nodes: expect.arrayContaining([expect.objectContaining({ id: "node_linear_regression" })]),
    });
    await expect(portfolioApi.getPortfolio("user_raymond")).resolves.toMatchObject({
      owner: expect.objectContaining({ id: "user_raymond" }),
    });
    await expect(learningApi.getRoadmap()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "task_ols_bias" })]),
    );
    await expect(runtimeApi.runPython({ code: "print('hello')" })).resolves.toMatchObject({
      status: "succeeded",
    });
    await expect(adminApi.getOverview()).resolves.toMatchObject({
      moderationPendingCount: expect.any(Number),
    });
    await expect(moderationApi.getReports()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ status: "open" })]),
    );
  });
});
