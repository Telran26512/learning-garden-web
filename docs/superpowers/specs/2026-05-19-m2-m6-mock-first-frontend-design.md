# M2-M6 Mock-First Frontend Design

Date: 2026-05-19

## Goal

Extend `learning-garden-web` from the current M0/M1 mock-first foundation into a complete M2-M6 frontend product surface. The result should be an operable in-memory mock frontend for public browsing, review, social activity, graph/portfolio views, and admin governance, without claiming real backend persistence or real-time infrastructure.

This phase is frontend-only. `learning-garden-server` does not yet have the Go M0 scaffold, so all new behavior must stay behind typed API facades and the in-process mock repository.

## Approved Direction

The approved implementation model is:

- Build M2-M6 as milestone-sliced features and routes, not one large demo page.
- Make mock interactions operable in memory: comments, follows, review ratings, graph filters, moderation actions, and registration controls update while the app is running.
- Do not persist mock state to `localStorage`; a refresh restores seed fixtures.
- Keep feature UI behind `lib/api/modules/*` and never import fixtures directly from pages or feature screens.
- Do not implement real WebSocket, real-time notification infrastructure, backend full-text search, or a complex graph layout library in this frontend-only phase.
- Preserve explicit future integration points for notifications, search, and graph data so backend implementation can replace the mock transport later.

## Product Scope

### M2: Content Expansion And Public Browsing

Routes:

```text
/community
/community/concepts/[slug]
/users/[id]
```

Capabilities:

- Public content feed with concepts, papers, and experiments.
- Filters for content type, tags, owner, and visibility.
- Public detail page for a concept-like content item, reusing the current math/code/paper content structure.
- User profile page with public profile data, public content, and learning activity summary.
- Backlink and relation previews on public detail pages.
- Clear empty state when no public content matches filters.

M2 remains read-mostly except for social actions introduced in M4.

### M3: Review Module

Route:

```text
/review
```

Capabilities:

- Due review queue grouped by due status.
- Flip-card or reveal interaction for the current card.
- Three rating choices: `again`, `good`, and `easy`.
- Mock SM-2-like scheduling updates: `ease`, `intervalDays`, `dueAt`, and `lastReviewedAt`.
- Visible next-due feedback after rating.
- Seed review cards represent content that would later be extracted from `::card` blocks; this phase does not build a Markdown parser.

### M4: Social Layer

Route:

```text
/social
```

Capabilities:

- Activity feed for followed users and the current user.
- Discussion list and discussion detail panel within the route.
- Notification list with read/unread state and badge count.
- Follow and unfollow actions on user profile surfaces.
- Comments on public content detail pages.
- Create comment, reply to comment, and delete current user's comment in mock state.
- Create discussion and reply to discussion in mock state.

Real-time delivery is out of scope. Notification data is ordinary mock state and should be labeled as such where needed.

### M5: Knowledge Graph And Portfolio

Routes:

```text
/graph
/portfolio
```

Capabilities:

- Lightweight graph view rendered with SVG/CSS and React components.
- Node state filters for mastered, active, next, and locked concepts.
- Node selection that shows prerequisites, dependents, related public content, and backlinks.
- Navigation from graph nodes to public or workspace detail routes.
- Portfolio page aggregating public content, projects, concept chains, and representative evidence.
- Relation API facade returns nodes, edges, and backlink records.

React Flow, Cytoscape, or a comparable graph layout library is deferred until backend relation data and graph scale justify the dependency.

### M6: Moderation And Open Registration Controls

Route:

```text
/admin
```

Capabilities:

- Expand the existing admin placeholder into a multi-panel governance console.
- Report queue with actions: resolve, dismiss, and escalate.
- Content moderation actions: hide, restore, and mark reviewed.
- Comment/discussion moderation actions: delete and restore.
- User overview with role, status, public content count, and restriction state.
- Registration control panel with open-registration toggle and invite-only status.
- Admin action log showing actor, target, action, reason, and timestamp.
- Forbidden state for non-admin mock users.

All M6 mutations are in-memory mock actions and must pass through `moderationApi` or `adminApi` facade methods.

## Explicit Non-Goals

- No real backend, database, object storage, session, password, or authorization implementation.
- No real WebSocket, SSE, or push notification transport.
- No backend full-text search or dedicated search index.
- No React Flow, Cytoscape, graph physics engine, or graph editing dependency.
- No durable mock state through browser storage.
- No real abuse prevention, rate limiting, audit log persistence, or public registration enforcement.
- No changes to `learning-garden-server` as part of this frontend design.

## Information Architecture

### New Routes

Create:

```text
app/(community)/community/concepts/[slug]/page.tsx
app/(community)/users/[id]/page.tsx
app/(social)/social/page.tsx
app/(workspace)/graph/page.tsx
app/(workspace)/portfolio/page.tsx
```

Extend:

```text
app/(community)/community/page.tsx
app/(workspace)/review/page.tsx
app/(admin)/admin/page.tsx
```

### Feature Modules

Create:

```text
features/community/public-content-detail-route.tsx
features/community/public-content-detail-screen.tsx
features/community/user-profile-route.tsx
features/community/user-profile-screen.tsx
features/social/social-route.tsx
features/social/social-screen.tsx
features/graph/graph-route.tsx
features/graph/graph-screen.tsx
features/portfolio/portfolio-route.tsx
features/portfolio/portfolio-screen.tsx
```

Extend:

```text
features/community/community-route.tsx
features/community/community-screen.tsx
features/review/review-route.tsx
features/review/review-screen.tsx
features/admin/admin-screen.tsx
```

Shared UI primitives should stay in `components/ui` only when they are reused by multiple features. Feature-specific panels should remain inside their owning feature directory.

## API Architecture

### Data Flow

All feature data follows the current mock-first path:

```text
route component
  -> feature screen
  -> lib/api/modules/*
  -> selected transport
  -> mock repository
```

Rules:

- Pages and feature screens must not import `lib/api/mock/fixtures`.
- Feature screens must not construct raw URLs.
- Feature screens must not import sibling feature internals.
- Mock repository methods should simulate API payloads and status codes, not component-only data shapes.
- HTTP transport compatibility must be preserved for future backend replacement.

### New API Modules

Create:

```text
lib/api/modules/social.ts
lib/api/modules/relation.ts
lib/api/modules/portfolio.ts
lib/api/modules/moderation.ts
```

Extend:

```text
lib/api/modules/content.ts
lib/api/modules/learning.ts
lib/api/modules/admin.ts
```

### Contract Scope

Extend `docs/api/openapi.yaml` and `lib/api/contracts.ts` with M2-M6 DTOs and paths.

Content:

```text
GET /content/public
GET /content/public/{slug}
GET /users/{id}/public-profile
```

Learning:

```text
GET  /learning/review-queue
POST /learning/review-cards/{id}/answer
```

Social:

```text
GET    /social/feed
GET    /social/discussions
POST   /social/discussions
POST   /social/discussions/{id}/replies
GET    /social/notifications
PATCH  /social/notifications/{id}
POST   /social/follows
DELETE /social/follows/{userId}
GET    /comments
POST   /comments
DELETE /comments/{id}
```

Relation:

```text
GET /relations/graph
GET /relations/backlinks
```

Portfolio:

```text
GET /portfolio/{userId}
```

Moderation:

```text
GET   /admin/reports
POST  /admin/reports/{id}/resolve
POST  /admin/content/{id}/moderate
POST  /admin/comments/{id}/moderate
POST  /admin/users/{id}/restrict
GET   /admin/registration
PATCH /admin/registration
GET   /admin/actions
```

The exact OpenAPI component names should mirror TypeScript DTO names so future generated-client migration is straightforward.

## Mock State Model

Extend `lib/api/mock/fixtures.ts` with seed data for:

- public content items
- public profiles
- review cards with scheduling fields
- comments and replies
- follows
- activity feed items
- discussions and discussion replies
- notifications
- graph nodes and edges
- backlinks
- portfolio evidence
- moderation reports
- registration settings
- admin action records

Extend `lib/api/mock/repository.ts` so mutations update in-memory arrays:

- `answerReviewCard()` updates scheduling fields.
- `createComment()`, `replyToComment()`, and `deleteComment()` update comment state.
- `followUser()` and `unfollowUser()` update follow state and user profile flags.
- `createDiscussion()` and `replyToDiscussion()` update discussions.
- `markNotificationRead()` updates notification state.
- `resolveReport()`, `moderateContent()`, `moderateComment()`, `restrictUser()`, and `toggleRegistration()` update moderation state and append admin action records.

Refresh resets all state because the repository is re-created from fixtures.

## Error Handling

Use `normalizeApiError()` for all feature route failures.

Required states:

- Loading state for every route that performs API calls.
- Empty state for feed, review queue, comments, discussions, notifications, graph selection, portfolio evidence, reports, and admin action log.
- `401` auth-required state where current user is missing.
- `403` forbidden state for admin-only calls when current user is not admin.
- Validation error state for empty comment/discussion/reason submissions.
- Clear "backend not connected" wording for capabilities intentionally left as mock-first, especially notifications and search-adjacent surfaces.

## Search And Notification Boundaries

This phase may include lightweight local filters in list UIs, but it must not build a full product search system.

Future backend integration points:

- Search module naming should leave room for `/search` once backend indexing exists.
- Notification DTOs should include `id`, `type`, `title`, `body`, `readAt`, `createdAt`, and optional `target`.
- Social UI should not assume polling, WebSocket, or SSE. It should render the notification list returned by `socialApi.getNotifications()`.

## Visual Direction

Keep the existing Synapse visual language from M0/M1:

- Warm paper background, graphite text, chlorophyll green primary accent, amber review/moderation accent.
- Editorial grids, dense learning surfaces, thin rule lines, and code/evidence panels.
- No generic AI purple gradient look.
- No heavy motion library.

M5 graph should feel like a research map embedded into the product, not a flashy graph demo. M6 admin should feel like governance tooling, not a separate admin SaaS template.

## Testing Strategy

Add tests for:

- M2-M6 contract types and fixture compatibility.
- OpenAPI path presence for M2-M6 endpoint groups.
- Mock repository flows:
  - follow and unfollow user
  - create and delete comment
  - answer review card and update next due date
  - create discussion and reply
  - mark notification read
  - resolve report and append admin action
  - toggle registration
- API modules exposing the new domain facade methods.
- Feature migration rule that prevents `features/*` from importing `lib/api/mock/fixtures`.

Verification commands remain:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

## Delivery Slices

Implement in this order:

1. M2 public content, detail page, user profile, and public browsing contracts.
2. M3 review scheduling and self-assessment state updates.
3. M4 social feed, comments, follows, discussions, and notifications.
4. M5 graph, backlinks, and portfolio aggregation.
5. M6 admin governance console, moderation actions, registration control, and admin action log.
6. Documentation, OpenAPI cleanup, README update, and full verification.

Each slice should keep the app buildable and should include focused tests before implementation.

## Success Criteria

- All M2-M6 routes render from direct URLs.
- User-visible M2-M6 interactions mutate mock state in the current browser session.
- No feature page imports mock fixtures directly.
- OpenAPI and TypeScript contracts cover the mock behavior.
- README clearly states that M2-M6 are mock-first frontend capabilities and not real backend persistence.
- `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, and `pnpm build` pass before the work is called complete.
