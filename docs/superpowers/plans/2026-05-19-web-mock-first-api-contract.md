# Web Mock-First API Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mock-first API contract layer so the frontend can finish UI development against stable OpenAPI and TypeScript contracts before the backend exists.

**Architecture:** OpenAPI lives in `docs/api/openapi.yaml` as the backend-facing contract. TypeScript DTOs live in `lib/api/contracts.ts`; feature modules call `lib/api/modules/*`, which use a selectable transport backed by an in-process mock repository by default. Existing screens are migrated away from direct `lib/demo` imports toward typed API facade calls.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Vitest, OpenAPI 3.1 YAML, in-process mock transport.

---

## File Structure

- Create `docs/api/openapi.yaml`: formal M0/M1 OpenAPI contract for identity, content, learning, runtime, and admin.
- Create `lib/api/contracts.ts`: TypeScript DTOs that mirror OpenAPI component schemas.
- Create `lib/api/errors.ts`: normalized API error type helpers.
- Create `lib/api/transport.ts`: `ApiTransport` interface and `getApiTransport()` selector using `NEXT_PUBLIC_API_MODE`.
- Create `lib/api/mock/fixtures.ts`: deterministic API-shaped mock data.
- Create `lib/api/mock/repository.ts`: in-memory repository for mock reads/writes.
- Create `lib/api/mock/transport.ts`: mock transport implementing endpoint behavior and status codes.
- Create `lib/api/mock/latency.ts`: small helper for deterministic async behavior.
- Create `lib/api/modules/identity.ts`: identity API facade.
- Create `lib/api/modules/content.ts`: content API facade.
- Create `lib/api/modules/learning.ts`: learning API facade.
- Create `lib/api/modules/runtime.ts`: runtime API facade.
- Create `lib/api/modules/admin.ts`: admin API facade.
- Modify `lib/api/index.ts`: export contracts and module APIs.
- Modify `lib/config/env.ts`: add `apiMode`.
- Modify `features/*`: migrate screens/routes from direct demo constants to API facade data.
- Modify `features/workspace/learning-garden-app.tsx`: preserve prototype coordinator while feeding API data.
- Modify `README.md`: document mock-first API mode and contract location.
- Add tests under `tests/lib/api/`.

## Task 1: OpenAPI Contract

**Files:**
- Create: `docs/api/openapi.yaml`
- Test: `tests/lib/api/openapi-contract.test.ts`

- [ ] **Step 1: Write failing OpenAPI contract tests**

```ts
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const openApi = readFileSync(join(process.cwd(), "docs/api/openapi.yaml"), "utf8");

describe("OpenAPI contract", () => {
  it("declares the M0/M1 API paths needed by the frontend", () => {
    for (const path of [
      "/auth/me:",
      "/auth/login:",
      "/auth/logout:",
      "/concepts:",
      "/concepts/{id}:",
      "/learning/roadmap:",
      "/learning/tasks/{id}:",
      "/learning/review-queue:",
      "/learning/review-cards/{id}/answer:",
      "/runtime/python-runs:",
      "/admin/overview:",
      "/admin/moderation-queue:",
    ]) {
      expect(openApi).toContain(path);
    }
  });

  it("declares shared DTO schemas used by TypeScript contracts", () => {
    for (const schema of [
      "User:",
      "Concept:",
      "RoadmapTask:",
      "ReviewCard:",
      "AdminOverview:",
      "ModerationQueueItem:",
      "ApiErrorPayload:",
    ]) {
      expect(openApi).toContain(schema);
    }
  });
});
```

- [ ] **Step 2: Run the contract tests and verify RED**

Run: `pnpm test:run tests/lib/api/openapi-contract.test.ts`

Expected: FAIL because `docs/api/openapi.yaml` does not exist.

- [ ] **Step 3: Add `docs/api/openapi.yaml`**

Include OpenAPI 3.1 with:

- `servers.url: /api/v1`
- shared `Error` response schema
- enums: `UserRole`, `Visibility`, `ConceptStatus`, `ReviewAnswerRating`
- paths listed in Step 1
- schemas listed in Step 1
- request bodies for login, create concept, update concept, update roadmap task, answer review card, and python run

- [ ] **Step 4: Verify GREEN**

Run: `pnpm test:run tests/lib/api/openapi-contract.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/api/openapi.yaml tests/lib/api/openapi-contract.test.ts
git commit -m "docs(web): add m0 m1 openapi contract"
```

## Task 2: TypeScript Contracts And Fixtures

**Files:**
- Create: `lib/api/contracts.ts`
- Create: `lib/api/mock/fixtures.ts`
- Test: `tests/lib/api/contracts.test.ts`

- [ ] **Step 1: Write failing contract fixture tests**

```ts
import { describe, expect, it } from "vitest";
import { mockAdminOverview, mockConcepts, mockCurrentUser, mockRoadmapTasks } from "@/lib/api/mock/fixtures";
import type { Concept, User } from "@/lib/api/contracts";

describe("API contracts and fixtures", () => {
  it("provides a current user shaped like the identity contract", () => {
    const user: User = mockCurrentUser;

    expect(user.id).toBe("user_raymond");
    expect(user.role).toBe("admin");
    expect(user.email).toContain("@");
  });

  it("provides concept fixtures shaped like the content contract", () => {
    const concept: Concept = mockConcepts[0]!;

    expect(concept.id).toBe("concept_linear_regression");
    expect(concept.visibility).toBe("private");
    expect(concept.sections.some((section) => section.kind === "math")).toBe(true);
    expect(concept.sections.some((section) => section.kind === "code")).toBe(true);
    expect(concept.sections.some((section) => section.kind === "paper")).toBe(true);
  });

  it("provides learning and admin fixtures used by route UIs", () => {
    expect(mockRoadmapTasks.length).toBeGreaterThan(0);
    expect(mockAdminOverview.moderationPendingCount).toBeGreaterThanOrEqual(0);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test:run tests/lib/api/contracts.test.ts`

Expected: FAIL because `contracts.ts` and fixtures do not exist.

- [ ] **Step 3: Implement `contracts.ts`**

Define the exact DTOs for:

- `UserRole`, `User`
- `Visibility`, `ConceptStatus`, `ConceptSection`, `Concept`
- `CreateConceptInput`, `UpdateConceptInput`
- `RoadmapTask`, `UpdateRoadmapTaskInput`
- `ReviewCard`, `AnswerReviewCardInput`, `AnswerReviewCardResponse`
- `PythonRunRequest`, `PythonRunResponse`
- `AdminOverview`, `ModerationQueueItem`
- `ApiErrorPayload`

- [ ] **Step 4: Implement API-shaped fixtures**

Move existing demo constants into typed objects in `lib/api/mock/fixtures.ts`. Preserve current content, but shape it as DTOs instead of component-specific arrays.

- [ ] **Step 5: Verify GREEN**

Run: `pnpm test:run tests/lib/api/contracts.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/api/contracts.ts lib/api/mock/fixtures.ts tests/lib/api/contracts.test.ts
git commit -m "feat(web): add typed api contracts and mock fixtures"
```

## Task 3: API Errors, Transport, And Mock Repository

**Files:**
- Create: `lib/api/errors.ts`
- Create: `lib/api/transport.ts`
- Create: `lib/api/mock/repository.ts`
- Create: `lib/api/mock/transport.ts`
- Create: `lib/api/mock/latency.ts`
- Modify: `lib/config/env.ts`
- Test: `tests/lib/api/mock-transport.test.ts`

- [ ] **Step 1: Write failing mock transport tests**

```ts
import { describe, expect, it } from "vitest";
import { createMockApiRepository } from "@/lib/api/mock/repository";
import { createMockTransport } from "@/lib/api/mock/transport";
import { normalizeApiError } from "@/lib/api/errors";

describe("mock API transport", () => {
  it("returns the current mock user", async () => {
    const transport = createMockTransport(createMockApiRepository());

    await expect(transport.request("GET", "/auth/me")).resolves.toMatchObject({
      id: "user_raymond",
      role: "admin",
    });
  });

  it("mutates concepts in the mock repository", async () => {
    const transport = createMockTransport(createMockApiRepository());
    const created = await transport.request("POST", "/concepts", {
      title: "Mock Concept",
      summary: "Created from tests",
      visibility: "private",
    });

    expect(created).toMatchObject({ title: "Mock Concept", visibility: "private" });
    await expect(transport.request("GET", `/concepts/${created.id}`)).resolves.toMatchObject({
      title: "Mock Concept",
    });
  });

  it("normalizes missing resources as API errors", async () => {
    const transport = createMockTransport(createMockApiRepository());

    await expect(transport.request("GET", "/concepts/missing")).rejects.toMatchObject({
      code: "not_found",
      status: 404,
    });

    expect(normalizeApiError(new Error("x")).code).toBe("unknown_error");
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test:run tests/lib/api/mock-transport.test.ts`

Expected: FAIL because transport/repository modules do not exist.

- [ ] **Step 3: Implement errors and transport contracts**

Implement:

- `ApiDomainError`
- `createApiDomainError(status, code, message, details?)`
- `normalizeApiError(error)`
- `ApiTransport.request<T>(method, path, body?)`
- `getApiTransport()` defaulting to mock when `NEXT_PUBLIC_API_MODE` is missing

- [ ] **Step 4: Implement mock repository and transport**

Implement endpoint handling for:

- `GET /auth/me`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /concepts`
- `POST /concepts`
- `GET /concepts/{id}`
- `PATCH /concepts/{id}`
- `GET /learning/roadmap`
- `PATCH /learning/tasks/{id}`
- `GET /learning/review-queue`
- `POST /learning/review-cards/{id}/answer`
- `POST /runtime/python-runs`
- `GET /admin/overview`
- `GET /admin/moderation-queue`

- [ ] **Step 5: Verify GREEN**

Run: `pnpm test:run tests/lib/api/mock-transport.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/api/errors.ts lib/api/transport.ts lib/api/mock/repository.ts lib/api/mock/transport.ts lib/api/mock/latency.ts lib/config/env.ts tests/lib/api/mock-transport.test.ts
git commit -m "feat(web): add mock api transport"
```

## Task 4: Domain API Modules

**Files:**
- Create: `lib/api/modules/identity.ts`
- Create: `lib/api/modules/content.ts`
- Create: `lib/api/modules/learning.ts`
- Create: `lib/api/modules/runtime.ts`
- Create: `lib/api/modules/admin.ts`
- Modify: `lib/api/index.ts`
- Test: `tests/lib/api/modules.test.ts`

- [ ] **Step 1: Write failing domain module tests**

```ts
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
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test:run tests/lib/api/modules.test.ts`

Expected: FAIL because module APIs are not exported.

- [ ] **Step 3: Implement domain modules**

Each module imports `getApiTransport()` and calls stable paths. Return typed DTOs from `contracts.ts`.

- [ ] **Step 4: Export modules**

Update `lib/api/index.ts` to export:

- `identityApi`
- `contentApi`
- `learningApi`
- `runtimeApi`
- `adminApi`
- contracts and error helpers

- [ ] **Step 5: Verify GREEN**

Run: `pnpm test:run tests/lib/api/modules.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/api/modules lib/api/index.ts tests/lib/api/modules.test.ts
git commit -m "feat(web): add domain api facades"
```

## Task 5: Workspace And Concept UI Data Migration

**Files:**
- Modify: `features/workspace/workspace-route.tsx`
- Modify: `features/workspace/workspace-screen.tsx`
- Modify: `features/concepts/concept-route.tsx`
- Modify: `features/concepts/concept-screen.tsx`
- Modify: `features/workspace/learning-garden-app.tsx`

- [ ] **Step 1: Add route-level loading/error/ready state**

Use client route wrappers to fetch:

- `learningApi.getRoadmap()`
- `contentApi.listConcepts()`
- `contentApi.getConcept("concept_linear_regression")`

Keep fallback UI using existing `StateSurface`.

- [ ] **Step 2: Change Workspace props**

`WorkspaceScreen` should receive typed props:

- `roadmapTasks: RoadmapTask[]`
- `concepts: Concept[]`
- `goTo: GoToScreen`

Remove direct `recentTopics` import from the screen.

- [ ] **Step 3: Change Concept props**

`ConceptScreen` should receive:

- `concept: Concept`
- `showRunOutput: boolean`
- `runOutput?: PythonRunResponse`
- `onRun: () => void`
- `goTo: GoToScreen`

Remove direct `starterCode` import from the screen.

- [ ] **Step 4: Run verification**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add features/workspace features/concepts
git commit -m "feat(web): load workspace and concept from mock api"
```

## Task 6: Studio, Review, Auth, And Admin UI Data Migration

**Files:**
- Modify: `features/studio/studio-route.tsx`
- Modify: `features/studio/studio-screen.tsx`
- Modify: `features/review/review-route.tsx`
- Modify: `features/review/review-screen.tsx`
- Modify: `features/auth/login-screen.tsx`
- Modify: `features/admin/admin-screen.tsx`
- Modify: `README.md`

- [ ] **Step 1: Migrate Studio**

Load the existing concept draft through `contentApi.getConcept(...)`. Wire save buttons to `contentApi.updateConcept(...)` in mock mode.

- [ ] **Step 2: Migrate Review**

Load queue through `learningApi.getReviewQueue()`. Submit answer through `learningApi.answerReviewCard(...)`. Remove direct `queueItems` and `masteryItems` imports.

- [ ] **Step 3: Migrate Auth**

Wire login button to `identityApi.login(...)`. After success, keep user in mock state and navigate to `/workspace`.

- [ ] **Step 4: Migrate Admin**

Load admin data through `adminApi.getOverview()` and `adminApi.getModerationQueue()`. Render forbidden state if mock transport returns `403`.

- [ ] **Step 5: Update README**

Document:

- `docs/api/openapi.yaml`
- `NEXT_PUBLIC_API_MODE=mock|http`
- API facade structure
- backend handoff expectation

- [ ] **Step 6: Run verification**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add features/studio features/review features/auth features/admin README.md
git commit -m "feat(web): migrate remaining screens to mock api"
```

## Task 7: Cleanup, Full Verification, And Push

**Files:**
- Modify only files required by lint/typecheck/build cleanup.

- [ ] **Step 1: Remove obsolete direct demo imports**

Run:

```bash
rg -n "lib/demo|synapse-data|starterCode|studioDraft|recentTopics|feedItems|queueItems|masteryItems" features components app
```

Expected: no direct feature imports from old demo data. If `lib/demo` is no longer needed, remove it.

- [ ] **Step 2: Full verification**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

Expected: all pass.

- [ ] **Step 3: Route smoke test**

Run with an existing dev server or start one:

```bash
node -e 'const paths=["/","/workspace","/workspace/concepts/linear-regression","/community","/studio","/review","/login","/admin"]; Promise.all(paths.map(async p=>{const r=await fetch("http://127.0.0.1:3000"+p,{redirect:"manual"}); console.log(`${r.status} ${p}`)})).catch(e=>{console.error(e); process.exit(1)})'
```

Expected: each route returns `200`.

- [ ] **Step 4: Final commit if cleanup changed files**

```bash
git add -A
git commit -m "chore(web): clean up mock api migration"
```

Skip this commit if there are no changes.

- [ ] **Step 5: Push**

```bash
git push origin main
```

Expected: local `main` and `origin/main` point to the same commit.

## Self-Review

- Spec coverage: OpenAPI, TS contracts, mock transport, domain API modules, UI migration, error handling, tests, and backend handoff are covered.
- Incomplete-section scan: no unfinished-work markers are used.
- Type consistency: DTO names match the spec and are reused consistently across modules and tests.
- Scope check: M0/M1 only; no comments/follows/notifications/full moderation.
