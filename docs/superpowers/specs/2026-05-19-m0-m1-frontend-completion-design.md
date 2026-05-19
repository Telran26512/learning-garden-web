# M0-M1 Frontend Completion Design

Date: 2026-05-19

## Goal

Complete the `learning-garden-web` frontend through the M0 and M1 scope described in `ai-learning-garden/docs`. The result should be a usable, distinctive AI learning operating system for Synapse: it supports the product shell, route boundaries, auth/admin placeholders, API boundaries, workspace learning flow, content studio, concept detail, and review loop.

This phase must not build M4 social features or M6 full moderation workflows.

## Product Scope

### M0 Frontend Foundation

- Establish Next.js App Router route groups for:
  - `/` as the product entry and workspace default.
  - `/login` under `(auth)`.
  - `/community` under `(community)`.
  - `/workspace` under `(workspace)`.
  - `/studio` under `(studio)`.
  - `/admin` under `(admin)`.
- Add a frontend API boundary in `lib/api` with versioned `/api/v1` URL construction.
- Add environment parsing in `lib/config`.
- Add typed mock data boundaries for M0/M1 screens so UI does not mix demo data directly into large components.
- Add UI states for loading, empty, and error surfaces.
- Add an admin foundation screen that communicates role-gated governance without implementing full moderation.
- Keep frontend authorization as route-shell affordance only. Real authorization remains a backend service-layer responsibility.

### M1 Learning Loop

- Workspace dashboard:
  - Roadmap progress.
  - Current training block.
  - Today plan.
  - Training calendar.
  - Recent learning topics.
- Concept detail:
  - Three-part learning layout: derivation, runnable-code task, paper/reference context.
  - Linear regression as the first complete concept.
  - Clear bridge from formula to implementation.
- Studio:
  - Content authoring shell for title, tags, visibility, relations, markdown body, and publish readiness.
  - No real save/publish API call in this phase; use UI states and boundary methods.
- Review:
  - Review queue.
  - Code correction exercise.
  - Compare-to-reference interaction.
  - Three-level self-assessment UI.
- Runtime:
  - Define a `PythonRuntime` interface and a placeholder implementation boundary.
  - Do not ship real Pyodide execution in this phase unless separately planned.

## Non-Goals

- No real registration, login, session persistence, or password handling.
- No backend mutations.
- No comments, follows, notifications, or discussion threads.
- No public registration controls.
- No report queue processing, content takedown, user restriction, or admin action logging implementation.
- No graph visualization library.
- No heavy animation package unless a later design pass explicitly justifies it.

## Visual Direction

The product should feel like a learning laboratory, not a generic AI SaaS dashboard.

### Design Personality

- **Core metaphor:** field notebook plus research cockpit.
- **Texture:** paper, graphite, chlorophyll green, amber annotation, thin rule lines, tabular numbers, code slabs.
- **Avoid:** purple gradients, centered hero cards, generic AI badges, default Inter/Roboto look, repeated white cards with identical shadows.
- **Density:** information-rich but calm; long-form learning work should feel legible and deliberate.
- **Layout:** asymmetric editorial grids, left rails, split panes, annotation margins, and compact operation panels.

### Typography

- Use a distinctive local-first stack:
  - Display: `"Avenir Next", "Noto Serif SC", "Songti SC", serif`.
  - UI/body: `"Avenir Next", "Noto Sans SC", "PingFang SC", sans-serif`.
  - Code: `"SFMono-Regular", "Cascadia Code", "Roboto Mono", monospace`.
- Large headings should be wide and restrained, never narrow six-line walls.
- Numbers use tabular figures.

### Color

- Base: warm paper white and limestone gray.
- Primary: chlorophyll green, grounded and slightly desaturated.
- Secondary accents: amber for warnings/review, graphite for code, muted blue only for charts/code affordances.
- No purple/blue AI gradient palette.

### Motion

- Use lightweight CSS transitions for M0/M1:
  - Screen transition fade/slide.
  - Button press and hover response.
  - Subtle active navigation movement.
- Do not introduce GSAP in this phase. The docs emphasize low maintenance, YAGNI, and a learning-first time budget; heavy motion is not justified for M0/M1 app workflows.

## Information Architecture

### Route Shells

- `app/page.tsx` redirects or renders the workspace entry.
- `app/(workspace)/workspace/page.tsx` renders the workspace screen.
- `app/(studio)/studio/page.tsx` renders studio.
- `app/(community)/community/page.tsx` renders public content browsing shell.
- `app/(auth)/login/page.tsx` renders login/register foundation UI.
- `app/(admin)/admin/page.tsx` renders admin foundation UI.

The current in-memory screen switcher can remain as a prototype interaction only if duplicated routes are also available. The final M0/M1 frontend should support direct URLs.

### Feature Modules

- `features/workspace`: roadmap, current block, heatmap, recent topics.
- `features/studio`: editor shell and publish checklist.
- `features/community`: public content browsing shell and user profile preview.
- `features/review`: queue, code correction, self-assessment.
- `features/concepts`: concept detail layout and formula-to-code bridge.
- `features/auth`: login/register foundation.
- `features/admin`: admin governance foundation.

Feature modules must not import other feature modules directly. Shared layout, buttons, avatar, cards, and state surfaces belong in `components`.

### API Boundaries

- `lib/config/env.ts` normalizes `NEXT_PUBLIC_API_BASE_URL` and `SERVER_API_BASE_URL`.
- `lib/api/client.ts` builds `/api/v1` URLs.
- Domain-specific API files may be stubbed with typed function signatures, but no fake backend side effects should be hidden inside UI components.

## Component Boundaries

- `components/layout`: app shell, top navigation, page frame.
- `components/ui`: buttons, status surface, empty/error/loading state, section header, annotation panel.
- `features/*/data.ts`: mock data for screen-specific examples.
- `features/*/*.tsx`: screen-specific UI.
- `runtime/python-runtime.ts`: interface and placeholder runtime.

## Testing And Verification

Add or preserve tests for:

- API URL construction.
- Environment normalization.
- Utility class composition.
- Runtime placeholder behavior.

Verification commands:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:run`
- `pnpm build`

## Implementation Notes

- Keep the current Synapse prototype content as seed material.
- Refactor toward routes and feature boundaries rather than adding more code to the prototype app coordinator.
- Remove `.DS_Store` files from the working tree.
- Update README with implemented M0/M1 scope and commands.
