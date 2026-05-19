# Learning Garden Web

Next.js frontend for **AI Learning Garden / Synapse**. The current UI implements the M0-M6 mock-first frontend foundation: learning workspace, concept drill, studio draft flow, public community browsing, review scheduling, social activity, relation graph, portfolio aggregation, admin governance, and typed API/runtime boundaries.

## What Is Implemented

- Workspace training dashboard.
- Studio content editor shell.
- Concept training detail view.
- M2 public browsing: public content list, content detail, comments, backlinks, and public user profiles.
- M3 review scheduling: due cards, answer ratings, next-due feedback, and queue advancement.
- M4 social mock flows: activity feed, discussions, replies, follows, comments, and notifications.
- M5 graph/portfolio views: lightweight relation graph, backlinks, and portfolio evidence aggregation.
- M6 governance mock: moderation reports, registration settings, and admin action log.
- Login placeholder for future session-based auth.
- `lib/api` REST client boundary.
- `lib/config` public environment normalization.
- `runtime/python-runtime.ts` Pyodide placeholder that does not pretend to execute Python.
- `docs/api/openapi.yaml` formal M0-M6 API contract.
- Mock-first API facade for frontend development before backend implementation.
- Provided avatar image served from `public/avatar.jpg`.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- Vitest
- pnpm

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

Default local URL:

```text
http://localhost:3000
```

## Structure

```text
learning-garden-web/
|-- app/                         # App Router groups, loading/error/not-found, global styles
|-- components/layout/           # App shell, top navigation, route navigation hook
|-- components/ui/               # Shared UI primitives
|-- docs/api/openapi.yaml        # Backend-facing API contract
|-- features/admin/              # Admin governance console
|-- features/auth/               # Login placeholder
|-- features/community/          # Public learning community surface
|-- features/concepts/           # Linear regression concept drill
|-- features/graph/              # Relation graph surface
|-- features/portfolio/          # Portfolio aggregation surface
|-- features/review/             # Mistake replay and compare workflow
|-- features/social/             # Social feed, discussions, notifications
|-- features/studio/             # Content authoring shell
|-- features/workspace/          # Personal learning workspace
|-- lib/api/                     # Typed REST API client boundary
|-- lib/api/modules/             # Domain API facades used by feature modules
|-- lib/api/mock/                # In-process mock repository and transport
|-- lib/config/                  # Public env parsing and defaults
|-- lib/demo/                    # Legacy demo data; feature routes use lib/api instead
|-- lib/utils/                   # Shared utility helpers
|-- public/avatar.jpg            # User avatar asset
|-- runtime/                     # Browser runtime boundary placeholders
|-- tests/                       # Unit tests
`-- README.md
```

## Routes

```text
/                                      # Redirects to /workspace
/workspace
/workspace/concepts/linear-regression
/community
/community/concepts/[slug]
/users/[id]
/social
/graph
/portfolio
/studio
/review
/login
/admin
```

## Mock-First API

Frontend features call domain facades in `lib/api/modules/*`, not raw fixtures or URLs. The current default transport is mock mode, backed by `lib/api/mock/*`.

M2-M6 interactions are in-memory only. Creating comments, following users, answering review cards, resolving reports, or toggling registration changes the mock repository state for the current page session; a browser refresh resets it to fixture data.

```bash
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

When `learning-garden-server` is ready, keep the OpenAPI shapes in `docs/api/openapi.yaml`, set `NEXT_PUBLIC_API_MODE=http`, and implement the same `/api/v1` responses on the backend.

## Not Implemented

- Real backend persistence.
- Real-time notification delivery through WebSocket or SSE.
- Backend full-text search.
- Complex graph layout libraries.
- Production auth/session enforcement beyond the current API boundary.
