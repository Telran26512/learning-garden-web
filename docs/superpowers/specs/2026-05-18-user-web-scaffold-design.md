# User Web Scaffold Design

Date: 2026-05-18

## Goal

Rebuild the `learning-garden-web` user-facing frontend repository from a deliberately cleared working tree. This phase only establishes the development environment, repository hygiene, and project structure. It does not implement product features, authentication behavior, backend integration, or detailed UI.

## Chosen Approach

Use a clean Next.js App Router scaffold with TypeScript, pnpm, ESLint, Prettier, Tailwind CSS, and Vitest. Preserve the existing Git repository and remote configuration, but remove generated artifacts and rebuild tracked source/config files intentionally.

This avoids restoring the previous scaffold while keeping repository history and remote linkage intact.

## Repository Structure

```text
learning-garden-web/
|-- app/
|   |-- (auth)/
|   |-- (community)/
|   |-- (workspace)/
|   |-- (studio)/
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- layout/
|   `-- ui/
|-- features/
|   |-- auth/
|   |-- community/
|   |-- studio/
|   `-- workspace/
|-- lib/
|   |-- api/
|   |-- config/
|   `-- utils/
|-- runtime/
|-- tests/
|-- docs/
|-- package.json
|-- pnpm-workspace.yaml
|-- tsconfig.json
|-- next.config.ts
|-- eslint.config.mjs
|-- prettier.config.mjs
`-- README.md
```

## Boundaries

- `app/` owns routing, layout, and route group boundaries.
- `components/` owns shared UI and layout primitives.
- `features/` owns domain-specific frontend modules. Feature modules should not import each other directly.
- `lib/api/` is the only intended backend API access boundary.
- `lib/config/` owns environment parsing and app constants.
- `lib/utils/` owns framework-neutral helpers.
- `runtime/` is reserved for browser-only or heavy runtime capabilities such as future Pyodide support.
- `tests/` contains unit and integration tests for shared logic and feature boundaries.

## Environment

The scaffold should support:

- Next.js App Router.
- React and TypeScript strict mode.
- pnpm as the package manager.
- Tailwind CSS for styling.
- ESLint and Prettier for static checks and formatting.
- Vitest for early test coverage.
- `.env.example` with frontend and server API base URL placeholders.

## Git Cleanup

The implementation should:

- Preserve `.git/` and the existing `origin` remote.
- Preserve commit history.
- Remove generated directories such as `.next/`.
- Update `.gitignore` to exclude build output, dependencies, local env files, logs, caches, and OS artifacts.
- Convert the current deleted-file working tree into a clean new scaffold commit-ready state.

The implementation must not use destructive Git commands such as `git reset --hard` or delete repository history.

## Verification

Before completion, run the available checks for the new scaffold:

- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:run`
- `pnpm build`

If any command cannot run because dependencies or network access fail, document the exact blocker and leave the project structure consistent.

## Non-Goals

- No authentication implementation.
- No real API calls beyond placeholder boundaries.
- No community, workspace, studio, or admin feature behavior.
- No production-grade visual design pass.
- No backend repository changes.
