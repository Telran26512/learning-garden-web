# Learning Garden Web

Next.js frontend for **AI Learning Garden / Synapse**. The current UI implements the M0/M1 frontend foundation from the product docs: route groups, learning workspace, concept drill, studio draft flow, review workflow, community shell, auth/admin placeholders, and typed API/runtime boundaries.

## What Is Implemented

- Workspace training dashboard.
- Studio content editor shell.
- Concept training detail view.
- Community feed and profile sidebar.
- Review/correction workflow with local compare interaction.
- Login placeholder for future session-based auth.
- Admin governance placeholder in the same web app.
- `lib/api` REST client boundary.
- `lib/config` public environment normalization.
- `runtime/python-runtime.ts` Pyodide placeholder that does not pretend to execute Python.
- `docs/api/openapi.yaml` formal M0/M1 API contract.
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
|-- features/admin/              # Admin governance console placeholder
|-- features/auth/               # Login placeholder
|-- features/community/          # Public learning community surface
|-- features/concepts/           # Linear regression concept drill
|-- features/review/             # Mistake replay and compare workflow
|-- features/studio/             # Content authoring shell
|-- features/workspace/          # Personal learning workspace
|-- lib/api/                     # Typed REST API client boundary
|-- lib/api/modules/             # Domain API facades used by feature modules
|-- lib/api/mock/                # In-process mock repository and transport
|-- lib/config/                  # Public env parsing and defaults
|-- lib/demo/                    # Demo data shared by the current frontend prototype
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
/studio
/review
/login
/admin
```

## Mock-First API

Frontend features call domain facades in `lib/api/modules/*`, not raw fixtures or URLs. The current default transport is mock mode, backed by `lib/api/mock/*`.

```bash
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

When `learning-garden-server` is ready, keep the OpenAPI shapes in `docs/api/openapi.yaml`, set `NEXT_PUBLIC_API_MODE=http`, and implement the same `/api/v1` responses on the backend.
