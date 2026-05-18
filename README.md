# Learning Garden Web

Next.js frontend for **AI Learning Garden**, a multi-user AI learning community that connects math derivations, runnable code, and paper reading workflows.

This repository owns the browser-facing product experience. Architecture, roadmap, data model, and cross-repository conventions live in the project control repository:

- [learning-garden](https://github.com/Telran26512/learning-garden)
- Backend server: [learning-garden-server](https://github.com/Telran26512/learning-garden-server)

## Current Status

This repository is initialized for the frontend application. The Next.js scaffold will be added during M0 after the project docs are reviewed.

Until the scaffold lands, this README defines the intended repository boundary, runtime expectations, and development conventions.

## Responsibilities

`learning-garden-web` is responsible for:

- The public and authenticated web experience.
- Learning workspace UI across the AI learning modules.
- Content studio flows for authoring and editing learning material.
- Community surfaces such as discovery, public profiles, comments, and discussions.
- Admin routes for future moderation workflows.
- The frontend API client boundary that talks to `learning-garden-server` only through REST contracts.

It is not responsible for:

- Database access.
- Authentication persistence.
- File storage.
- Server-side business authorization.
- Importing backend source code directly.

## Planned Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js App Router with React Server Components |
| Language | TypeScript strict mode |
| UI | React, Tailwind CSS, Radix UI primitives as needed |
| State | Zustand only for small client-side session or progress state |
| Content rendering | Markdown/MDX, KaTeX, Shiki |
| Runnable Python | Pyodide, lazy-loaded behind `runtime/` |
| Tests | Vitest, targeted Playwright coverage later |
| Package manager | pnpm |

## Planned Repository Structure

```text
learning-garden-web/
|-- app/
|   |-- (community)/      # Public discovery, profiles, discussions
|   |-- (workspace)/      # Authenticated learning workspace
|   |-- (studio)/         # Content authoring and editing
|   `-- (admin)/          # Moderation and review flows
|-- features/             # Feature modules; no cross-feature imports
|-- lib/api/              # The only layer that calls the backend API
|-- runtime/              # Pyodide and browser-only runtime capabilities
|-- components/           # Shared presentational components
|-- tests/
`-- README.md
```

## Architecture Rules

- `features/*` may use `lib/api`, `components`, and `runtime`.
- `features/*` must not import other feature modules directly.
- UI code must not call `fetch` against the backend outside `lib/api`.
- Browser code uses `NEXT_PUBLIC_API_BASE_URL`.
- Server Components or Server Actions that need backend access use a server-only API base URL.
- Route-level authorization belongs in route groups and server boundaries, not scattered inside presentational components.

## Environment Variables

Expected local variables after the scaffold is added:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
SERVER_API_BASE_URL=http://localhost:8080
```

Do not commit `.env` files. Commit `.env.example` when the scaffold introduces real environment requirements.

## Local Development

Expected commands after the Next.js scaffold is added:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
```

The local frontend should run against a local or deployed `learning-garden-server` instance through REST `/api/v1`.

## API Contract

The frontend treats the backend as an external service. Contract changes must be coordinated through:

- Backend API documentation in `learning-garden-server`.
- Cross-repository notes in `learning-garden`.
- Frontend API client updates in `lib/api`.

Breaking API changes should land server-side first with migration notes, then be adopted here.

## Git Conventions

Use Conventional Commits:

```text
feat(workspace): add concept overview page
fix(api): handle expired sessions
chore(repo): initialize next scaffold
```

Use short feature branches for larger work:

```text
feat/auth-session
feat/content-studio
feat/runnable-python
```

## Roadmap Entry Point

Frontend work starts with M0:

- Initialize Next.js with TypeScript strict mode.
- Add lint, format, typecheck, and test commands.
- Establish route groups.
- Add the `lib/api` boundary.
- Prepare deployment to Vercel.

See [learning-garden docs](https://github.com/Telran26512/learning-garden/tree/main/docs) for the full roadmap and architecture.
