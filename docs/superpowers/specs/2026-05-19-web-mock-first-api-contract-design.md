# Web Mock-First API Contract Design

## Context

`learning-garden-web` currently has the M0/M1 frontend foundation: route groups, feature modules, shared layout/UI primitives, static demo data, and a typed low-level API client. The next phase keeps frontend development ahead of backend implementation while avoiding a rewrite later.

The approved direction is:

- OpenAPI is the formal backend-facing contract.
- TypeScript contracts are the frontend-facing consumption model.
- Frontend screens use mock API modules instead of directly importing demo fixtures.
- When the backend is ready, only the API transport changes; feature UI should not be rewritten.

## Goals

1. Define M0/M1 API contracts before backend implementation.
2. Replace direct `lib/demo` consumption with a mock-first API facade.
3. Keep UI development productive with deterministic mock data.
4. Make the future backend implementation straightforward by documenting request/response schemas in OpenAPI.
5. Keep feature modules isolated: `features/*` may call `lib/api/modules/*`, but feature modules must not import other feature modules.

## Non-Goals

- No real backend calls in this phase.
- No MSW service worker yet; a pure in-process mock repository is enough for current development.
- No full M4 social features: comments, follows, notifications, dynamic feeds.
- No full M6 moderation workflow: detailed reports, audit mutation flows, abuse prevention.
- No generated client pipeline yet. Manual TS contracts are acceptable for the first contract pass, as long as they mirror OpenAPI names and shapes.

## Contract Sources

### Formal Contract

Create:

```text
docs/api/openapi.yaml
```

This file is the source for backend-facing API behavior:

- paths
- methods
- query params
- request bodies
- response schemas
- error schemas
- enum values
- pagination conventions

### Frontend Contract

Create:

```text
lib/api/contracts.ts
```

This file defines TypeScript types that mirror OpenAPI schemas. Naming should stay close to OpenAPI component names:

- `User`
- `Concept`
- `RoadmapTask`
- `ReviewCard`
- `AdminOverview`
- `ModerationQueueItem`
- `ApiErrorPayload`
- request/response DTO types

The TS file is not the authoritative public contract; it is the frontend consumption contract derived from the OpenAPI design.

## API Scope

Only M0/M1 APIs are included.

### Identity

```text
GET  /auth/me
POST /auth/login
POST /auth/logout
```

Purpose:

- identify current user
- expose `role=user|admin`
- allow route guards to distinguish unauthenticated, user, and admin states

### Content

```text
GET   /concepts
POST  /concepts
GET   /concepts/{id}
PATCH /concepts/{id}
```

Purpose:

- support private concept CRUD
- provide the linear-regression concept detail page
- preserve `ownerId` and `visibility=private|public`
- keep content extensible for papers and experiments later

### Learning

```text
GET   /learning/roadmap
PATCH /learning/tasks/{id}
GET   /learning/review-queue
POST  /learning/review-cards/{id}/answer
```

Purpose:

- persist roadmap checklist state
- support review queue and answer grading
- expose concept mastery/progress needed by Workspace and Review

### Runtime

```text
POST /runtime/python-runs
```

Purpose:

- preserve an API contract for a future server-side runner if needed
- allow the frontend mock to behave like a remote execution endpoint
- keep browser Pyodide as an implementation detail behind `runtime/`

The frontend may still execute Python locally through Pyodide later; the route exists as a contract for optional backend execution.

### Admin

```text
GET /admin/overview
GET /admin/moderation-queue
```

Purpose:

- keep M0 admin shell data-driven
- expose governance summary without building full M6 moderation mutations
- preserve route and API boundaries for `role=admin`

## Frontend Architecture

### New Structure

```text
lib/api/
|-- client.ts                 # Low-level HTTP client, already exists
|-- contracts.ts              # Shared DTOs matching OpenAPI schemas
|-- errors.ts                 # Normalized frontend API errors
|-- transport.ts              # Transport interface and selector
|-- modules/
|   |-- identity.ts
|   |-- content.ts
|   |-- learning.ts
|   |-- runtime.ts
|   `-- admin.ts
`-- mock/
    |-- fixtures.ts
    |-- repository.ts
    |-- transport.ts
    `-- latency.ts
```

### Feature Data Flow

```text
features/* -> lib/api/modules/* -> lib/api/transport -> mock transport -> mock repository
```

Rules:

- Feature components do not import `lib/demo`.
- Feature components do not construct URLs.
- Feature components call domain-specific API modules.
- API modules return typed DTOs from `contracts.ts`.
- Mock transport simulates API status codes and payloads, not arbitrary component-shaped data.

### Transport Switching

Use one switch point:

```text
NEXT_PUBLIC_API_MODE=mock|http
```

Default:

```text
mock
```

Behavior:

- `mock`: use in-process mock repository.
- `http`: use `createApiClient()` and call backend `/api/v1`.

This avoids changing feature code when the backend arrives.

## Error Model

OpenAPI defines a shared error payload:

```ts
type ApiErrorPayload = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};
```

Common frontend states:

- loading
- empty
- error
- unauthorized
- forbidden

Mock APIs must be able to produce:

- `401 unauthenticated`
- `403 forbidden`
- `404 not_found`
- `422 validation_error`

## Data Modeling Conventions

### IDs

Use stable string IDs in mocks:

```text
user_raymond
concept_linear_regression
task_ols_bias
review_bias_column
```

### Timestamps

Use ISO strings:

```text
2026-05-19T00:00:00.000Z
```

### Visibility

Allowed values:

```text
private
public
unlisted
```

M0/M1 UI defaults to `private`.

### Roles

Allowed values:

```text
user
admin
```

## UI Integration Plan

### Workspace

Replace hardcoded roadmap/recent topic data with:

- `learningApi.getRoadmap()`
- `contentApi.listConcepts({ owner: "me" })`

Workspace should render loading, empty, error, and ready states.

### Concept Detail

Replace static linear-regression content with:

- `contentApi.getConcept("concept_linear_regression")`
- `runtimeApi.runPython(...)` mock response

The three-column learning page must consume typed concept sections rather than component-local constants.

### Studio

Replace static draft with:

- `contentApi.createConcept(input)`
- `contentApi.updateConcept(id, patch)`

In mock mode, repository mutates in memory during the current browser session.

### Review

Replace local queue constants with:

- `learningApi.getReviewQueue()`
- `learningApi.answerReviewCard(id, answer)`

Review answer state should update from returned DTOs.

### Auth

Replace static-only login with:

- `identityApi.login(input)`
- `identityApi.getMe()`
- `identityApi.logout()`

In mock mode, login returns the Raymond user by default.

### Admin

Replace static admin data with:

- `adminApi.getOverview()`
- `adminApi.getModerationQueue()`

Mock transport must return `403` if the active mock user is not admin.

## Testing Strategy

### Unit Tests

Add tests for:

- OpenAPI file existence and parseability.
- `contracts.ts` mock fixture compatibility through TypeScript checks.
- API modules returning typed mock payloads.
- mock auth role behavior.
- transport selector defaulting to mock.
- error normalization for `401/403/404/422`.

### Route Smoke Tests

Keep existing build-level route verification. Add lightweight tests only where they protect API facade behavior; do not over-test visual layout.

### Verification Commands

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

## Migration Strategy

1. Add OpenAPI and TS contracts.
2. Add mock transport/repository and module APIs.
3. Move current demo constants into mock fixtures shaped like API DTOs.
4. Update Workspace to consume API facade.
5. Update Concept detail to consume API facade.
6. Update Studio to create/update through API facade.
7. Update Review to consume API facade.
8. Update Auth/Admin shells to consume API facade.
9. Remove obsolete direct `lib/demo` imports from feature modules.

## Backend Handoff

When `learning-garden-server` starts implementing endpoints:

- backend reads `docs/api/openapi.yaml`
- backend preserves `/api/v1` base path
- backend returns the same DTO and error shapes
- frontend switches `NEXT_PUBLIC_API_MODE=http`
- frontend should not require feature-module rewrites

## Self-Review

- No incomplete sections remain.
- Scope is limited to M0/M1 contract-driven mock development.
- OpenAPI is authoritative, TypeScript mirrors it for frontend use.
- The design avoids backend dependency while preserving backend handoff clarity.
- Social and full moderation are explicitly out of scope until later milestones.
