# Synapse Web

Synapse is a learning workspace for machine learning practitioners. It helps users keep papers, mathematical derivations, and code connected through a structured learning graph instead of leaving them scattered across note apps, repositories, and PDF managers.

This repository contains the Next.js frontend for Synapse: the public landing page, authentication screens, protected app shell, API client boundary, and product-facing UI.

## Current Scope

The current frontend focuses on P1 authentication, the Synapse marketing surface, and a first-pass authenticated workspace:

- Componentized landing page with product screenshot mockup, graph demo, community examples, pricing, FAQ, and scroll reveal polish.
- `/auth` page with email/password login, registration, password strength feedback, consent copy, GitHub login entry point UI, and workspace preview artwork.
- `/app` protected route with a basic route guard, current identity lookup, workspace header, roadmap, daily tasks, contribution activity, and notifications panels.
- Frontend auth client for register, login, refresh session, logout, and `/auth/me`.
- Legal placeholder pages for `/terms` and `/privacy`.
- Development guide in `docs/synapse-development-guide.md`.

Backend code lives in a separate repository:

- `learning-garden-server`: Go API, PostgreSQL migrations, auth service, Redis refresh-session revocation, and local infrastructure.

## Tech Stack

| Area            | Choice                            |
| --------------- | --------------------------------- |
| Framework       | Next.js 16 App Router             |
| UI runtime      | React 19                          |
| Language        | TypeScript                        |
| Styling         | Tailwind CSS 4 plus CSS variables |
| Tests           | Vitest                            |
| Linting         | ESLint 9 with Next config         |
| Formatting      | Prettier                          |
| Package manager | pnpm 11                           |

## Requirements

- Node.js `>= 22`
- pnpm `>= 11`
- Synapse backend running locally for real auth flows

The frontend expects the backend API at `http://localhost:18080` by default.

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open:

```text
http://127.0.0.1:3000
```

Use `pnpm dev` for daily frontend work. It runs one fixed development server on `127.0.0.1:3000` with hot reload. Do not use `pnpm start` for development; it serves the last production build and will not reflect file edits until you rebuild.

If the browser keeps showing old code or another port is already occupied, clean up stale local servers:

```bash
pnpm dev:stop
pnpm dev
```

For a full cache reset:

```bash
pnpm dev:clean
```

Run the backend separately from the server repository:

```bash
cd ../learning-garden-server
docker compose up -d
go run ./services/api/cmd/migrate
go run ./services/api/cmd/server
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:18080
```

`NEXT_PUBLIC_API_URL` points the browser client at the backend REST API. Because this value is exposed to the browser, do not put secrets in it.

## Scripts

```bash
pnpm dev           # Start fixed local Next.js dev server at 127.0.0.1:3000
pnpm dev:stop      # Stop stale local frontend servers on ports 3000-3003
pnpm dev:clean     # Stop stale servers, clear .next, then start dev
pnpm build         # Production build
pnpm start         # Serve production build at 127.0.0.1:3100
pnpm lint          # Run ESLint
pnpm test          # Run Vitest
pnpm typecheck     # Generate Next route types and run tsc
pnpm format        # Format files
pnpm format:check  # Check formatting
```

## Auth Flow

The frontend uses short-lived in-memory access tokens and an HTTP-only refresh cookie issued by the backend.

Implemented API client calls:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

Expected behavior:

- Registering a user returns an access token and sets the refresh cookie.
- Reloading the page restores the session through `/auth/refresh`.
- Visiting `/app` without a valid session redirects to `/auth?mode=login`.
- Logging out clears the in-memory token and asks the backend to revoke the refresh session.

## Project Structure

```text
app/
  page.tsx          # Landing page entry
  auth/page.tsx     # Login and registration
  app/page.tsx      # Protected app entry
  privacy/page.tsx
  terms/page.tsx
  globals.css
components/
  auth/             # Auth form, GitHub icon, and preview mockup
  landing/          # Landing page graph, particles, layout
  synapse/          # Brand primitives
  workspace/        # Protected workspace dashboard panels
lib/
  auth/             # Auth API client, session store, password strength
  hooks/            # Shared frontend hooks
  types/            # Shared UI/domain types
public/
  auth-workspace-preview.jpg
scripts/
  kill-dev-ports.mjs
docs/
  synapse-development-guide.md
```

## Verification

Before pushing changes, run:

```bash
pnpm format:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build
```

The current baseline passes all five commands.

## Design Direction

Synapse should feel like a focused technical tool, not a generic AI SaaS landing page. Current UI rules:

- Use product screenshots, graph states, notes, and real learning examples as primary content.
- Keep cyan out of default CTA styling; reserve bright colors for semantic graph data or explicit states.
- Avoid glow, particle-heavy marketing sections, repeated SaaS card grids, and generic all-caps labels.
- Prefer dense but calm UI: small metadata, restrained surfaces, low-contrast borders, and clear hierarchy.
- Support reduced motion for scroll animations.

## Related Repository

- Backend: `https://github.com/Telran26512/learning-garden-server`

## License

No license has been declared yet. Treat the code as all rights reserved unless a license file is added.
