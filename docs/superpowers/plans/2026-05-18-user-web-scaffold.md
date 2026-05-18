# User Web Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `learning-garden-web` as a clean user-facing Next.js frontend scaffold with environment setup, clear folders, and repository hygiene.

**Architecture:** Keep the App Router as the routing boundary, shared UI in `components/`, domain modules in `features/`, backend URL helpers in `lib/api/`, environment parsing in `lib/config/`, and framework-neutral helpers in `lib/utils/`. Preserve the existing Git repository and remote while replacing the deleted old scaffold with a new minimal structure.

**Tech Stack:** Next.js 16.2.6, React 19.2.6, TypeScript 6.0.3, pnpm 11.1.1, Tailwind CSS 4.3.0, ESLint 10.4.0, Prettier 3.8.3, Vitest 4.1.6.

---

## File Structure

- Modify: `.gitignore` to ignore generated output, dependencies, local env files, logs, caches, and OS files.
- Modify: `.env.example` to document required API base URL values.
- Modify: `package.json` to define the app package, scripts, runtime dependencies, and dev dependencies.
- Modify: `pnpm-workspace.yaml` to keep this repository as a single pnpm workspace package.
- Modify: `next.config.ts` to enable strict Next.js defaults and typed routes.
- Modify: `tsconfig.json` to enable strict TypeScript and the `@/*` path alias.
- Modify: `next-env.d.ts` to provide Next.js type references.
- Modify: `postcss.config.mjs` to wire Tailwind CSS 4 through PostCSS.
- Modify: `eslint.config.mjs` to use Next.js flat ESLint config.
- Modify: `prettier.config.mjs` to enforce consistent formatting.
- Modify: `vitest.config.ts` to configure Vitest with the repo root alias.
- Modify: `vitest.setup.ts` for shared test setup.
- Modify: `app/globals.css` for Tailwind import and baseline app styles.
- Modify: `app/layout.tsx` for the root layout and metadata.
- Modify: `app/page.tsx` for the root scaffold page.
- Create: `app/(auth)/login/page.tsx` for the auth route group shell.
- Modify: `app/(community)/community/page.tsx` for the community route shell.
- Modify: `app/(workspace)/workspace/page.tsx` for the workspace route shell.
- Modify: `app/(studio)/studio/page.tsx` for the studio route shell.
- Create: `components/layout/app-frame.tsx` for shared page framing.
- Create: `components/ui/section-card.tsx` for shared section surfaces.
- Create: `features/auth/README.md` for auth module ownership.
- Create: `features/community/README.md` for community module ownership.
- Create: `features/studio/README.md` for studio module ownership.
- Create: `features/workspace/README.md` for workspace module ownership.
- Create: `lib/config/env.ts` for API base URL normalization.
- Modify: `lib/api/index.ts` to expose API URL helpers.
- Create: `lib/api/client.ts` for versioned API URL construction.
- Create: `lib/utils/cn.ts` for small class name composition.
- Create: `runtime/README.md` for runtime boundary ownership.
- Create: `tests/lib/config/env.test.ts` for config helper tests.
- Create: `tests/lib/api/client.test.ts` for API URL helper tests.
- Create: `tests/lib/utils/cn.test.ts` for utility helper tests.
- Modify: `README.md` to document the rebuilt scaffold and commands.
- Delete from Git tracking: old docs-console components and previous feature files that are not part of this scaffold.
- Delete from filesystem: `.next/` and `.DS_Store`.

---

### Task 1: Repository Hygiene And Package Baseline

**Files:**
- Modify: `.gitignore`
- Modify: `.env.example`
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Delete from filesystem: `.next/`
- Delete from filesystem: `.DS_Store`

- [ ] **Step 1: Remove generated local artifacts**

Run:

```bash
rm -rf .next .DS_Store
```

Expected: the command exits with status `0`. It does not remove `.git/`, source files, docs, or remote configuration.

- [ ] **Step 2: Replace `.gitignore`**

Write `.gitignore` exactly as:

```gitignore
# dependencies
node_modules/
.pnp
.pnp.*

# next
.next/
out/

# production
dist/
build/

# testing
coverage/
.vitest/

# env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
!.env.example

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# caches
.turbo/
.eslintcache

# hosting
.vercel/

# os
.DS_Store
```

- [ ] **Step 3: Replace `.env.example`**

Write `.env.example` exactly as:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
SERVER_API_BASE_URL=http://localhost:8080
```

- [ ] **Step 4: Replace `package.json`**

Write `package.json` exactly as:

```json
{
  "name": "learning-garden-web",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@11.1.1",
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=11.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.6",
    "react-dom": "19.2.6"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.3.0",
    "@types/node": "25.8.0",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "eslint": "10.4.0",
    "eslint-config-next": "16.2.6",
    "prettier": "3.8.3",
    "tailwindcss": "4.3.0",
    "typescript": "6.0.3",
    "vitest": "4.1.6"
  }
}
```

- [ ] **Step 5: Replace `pnpm-workspace.yaml`**

Write `pnpm-workspace.yaml` exactly as:

```yaml
packages:
  - "."
```

- [ ] **Step 6: Install dependencies and generate the lockfile**

Run:

```bash
pnpm install
```

Expected: `pnpm-lock.yaml` is created or updated, and the command exits with status `0`.

- [ ] **Step 7: Commit package baseline**

Run:

```bash
git add .gitignore .env.example package.json pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "chore(web): rebuild package baseline"
```

Expected: a commit is created. Remaining deleted old scaffold files may still appear in `git status` until Task 4.

---

### Task 2: Framework Configuration And App Shell

**Files:**
- Modify: `next.config.ts`
- Modify: `tsconfig.json`
- Modify: `next-env.d.ts`
- Modify: `postcss.config.mjs`
- Modify: `eslint.config.mjs`
- Modify: `prettier.config.mjs`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `app/(auth)/login/page.tsx`
- Modify: `app/(community)/community/page.tsx`
- Modify: `app/(workspace)/workspace/page.tsx`
- Modify: `app/(studio)/studio/page.tsx`
- Create: `components/layout/app-frame.tsx`
- Create: `components/ui/section-card.tsx`

- [ ] **Step 1: Replace `next.config.ts`**

Write `next.config.ts` exactly as:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
};

export default nextConfig;
```

- [ ] **Step 2: Replace `tsconfig.json`**

Write `tsconfig.json` exactly as:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Replace `next-env.d.ts`**

Write `next-env.d.ts` exactly as:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is generated by Next.js type tooling and kept in source control for editor support.
```

- [ ] **Step 4: Replace `postcss.config.mjs`**

Write `postcss.config.mjs` exactly as:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Replace `eslint.config.mjs`**

Write `eslint.config.mjs` exactly as:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);
```

- [ ] **Step 6: Replace `prettier.config.mjs`**

Write `prettier.config.mjs` exactly as:

```js
const config = {
  printWidth: 100,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
};

export default config;
```

- [ ] **Step 7: Replace `app/globals.css`**

Write `app/globals.css` exactly as:

```css
@import "tailwindcss";

:root {
  --background: #f6f1e7;
  --background-deep: #e5dccb;
  --foreground: #1f2a24;
  --muted: #657065;
  --line: #d5c9b7;
  --panel: rgba(255, 252, 246, 0.86);
  --accent: #2f6f4e;
  --accent-strong: #17412d;
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
}

body {
  min-height: 100vh;
  margin: 0;
  color: var(--foreground);
  background:
    radial-gradient(circle at top left, rgba(107, 142, 83, 0.24), transparent 32rem),
    linear-gradient(135deg, var(--background), var(--background-deep));
  font-family: "Avenir Next", "Noto Sans SC", "PingFang SC", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}
```

- [ ] **Step 8: Create `components/layout/app-frame.tsx`**

Write `components/layout/app-frame.tsx` exactly as:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/workspace", label: "Workspace" },
  { href: "/studio", label: "Studio" },
  { href: "/login", label: "Login" },
] as const;

type AppFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AppFrame({ eyebrow, title, description, children }: AppFrameProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-5 border-b border-[var(--line)] pb-6 md:flex-row md:items-center md:justify-between">
        <Link className="text-lg font-semibold tracking-tight" href="/">
          Learning Garden
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
          {navItems.map((item) => (
            <Link
              className="rounded-full border border-[var(--line)] bg-white/45 px-3 py-1.5 transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="grid flex-1 gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--foreground)] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{description}</p>
        </div>
        <div className="grid gap-4">{children}</div>
      </section>
    </main>
  );
}
```

- [ ] **Step 9: Create `components/ui/section-card.tsx`**

Write `components/ui/section-card.tsx` exactly as:

```tsx
import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <article className="rounded-[2rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(45,36,22,0.12)] backdrop-blur">
      <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </article>
  );
}
```

- [ ] **Step 10: Replace `app/layout.tsx`**

Write `app/layout.tsx` exactly as:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Learning Garden",
    template: "%s | Learning Garden",
  },
  description: "User-facing web client for the AI Learning Garden learning platform.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 11: Replace `app/page.tsx`**

Write `app/page.tsx` exactly as:

```tsx
import { AppFrame } from "@/components/layout/app-frame";
import { SectionCard } from "@/components/ui/section-card";

export default function HomePage() {
  return (
    <AppFrame
      description="A clean starting point for the learner workspace, content surfaces, and community routes."
      eyebrow="User Client Scaffold"
      title="Learning Garden web is ready for vertical slices."
    >
      <SectionCard
        description="Shared configuration, routing, and UI boundaries are in place before product behavior is added."
        title="Environment first"
      />
      <SectionCard
        description="Community, workspace, studio, and auth route groups are separated so later access rules stay localized."
        title="Route groups"
      />
    </AppFrame>
  );
}
```

- [ ] **Step 12: Create `app/(auth)/login/page.tsx`**

Write `app/(auth)/login/page.tsx` exactly as:

```tsx
import { AppFrame } from "@/components/layout/app-frame";
import { SectionCard } from "@/components/ui/section-card";

export default function LoginPage() {
  return (
    <AppFrame
      description="This route group reserves the future authenticated entry point without adding auth behavior in the scaffold phase."
      eyebrow="Auth Boundary"
      title="Authentication routes are isolated."
    >
      <SectionCard
        description="Session persistence and provider integration will live behind this route group when that slice is planned."
        title="No auth behavior yet"
      />
    </AppFrame>
  );
}
```

- [ ] **Step 13: Replace `app/(community)/community/page.tsx`**

Write `app/(community)/community/page.tsx` exactly as:

```tsx
import { AppFrame } from "@/components/layout/app-frame";
import { SectionCard } from "@/components/ui/section-card";

export default function CommunityPage() {
  return (
    <AppFrame
      description="The public discovery surface is separated from workspace and authoring concerns."
      eyebrow="Community Boundary"
      title="Community routes have a dedicated shell."
    >
      <SectionCard
        description="Discussion, discovery, profiles, and public learning material can grow inside this boundary."
        title="Public learning surface"
      />
    </AppFrame>
  );
}
```

- [ ] **Step 14: Replace `app/(workspace)/workspace/page.tsx`**

Write `app/(workspace)/workspace/page.tsx` exactly as:

```tsx
import { AppFrame } from "@/components/layout/app-frame";
import { SectionCard } from "@/components/ui/section-card";

export default function WorkspacePage() {
  return (
    <AppFrame
      description="The learner workspace has its own route group for progress, lessons, runnable code, and study state."
      eyebrow="Workspace Boundary"
      title="Learning workspace routes are isolated."
    >
      <SectionCard
        description="Course flow, concept review, and personal progress can be added here without leaking into public routes."
        title="Learner-owned state"
      />
    </AppFrame>
  );
}
```

- [ ] **Step 15: Replace `app/(studio)/studio/page.tsx`**

Write `app/(studio)/studio/page.tsx` exactly as:

```tsx
import { AppFrame } from "@/components/layout/app-frame";
import { SectionCard } from "@/components/ui/section-card";

export default function StudioPage() {
  return (
    <AppFrame
      description="Authoring and review workflows are kept separate from learner and public community surfaces."
      eyebrow="Studio Boundary"
      title="Content studio routes are isolated."
    >
      <SectionCard
        description="Drafting, review, and publishing workflows can be added as a focused vertical slice."
        title="Authoring surface"
      />
    </AppFrame>
  );
}
```

- [ ] **Step 16: Run framework checks**

Run:

```bash
pnpm lint
pnpm typecheck
```

Expected: both commands exit with status `0`.

- [ ] **Step 17: Commit framework shell**

Run:

```bash
git add next.config.ts tsconfig.json next-env.d.ts postcss.config.mjs eslint.config.mjs prettier.config.mjs app/globals.css app/layout.tsx app/page.tsx 'app/(auth)/login/page.tsx' 'app/(community)/community/page.tsx' 'app/(workspace)/workspace/page.tsx' 'app/(studio)/studio/page.tsx' components/layout/app-frame.tsx components/ui/section-card.tsx
git commit -m "chore(web): add next app shell"
```

Expected: a commit is created. Remaining deleted old scaffold files may still appear in `git status` until Task 4.

---

### Task 3: Boundaries, Helpers, And Tests

**Files:**
- Create: `features/auth/README.md`
- Create: `features/community/README.md`
- Create: `features/studio/README.md`
- Create: `features/workspace/README.md`
- Create: `lib/config/env.ts`
- Create: `lib/api/client.ts`
- Modify: `lib/api/index.ts`
- Create: `lib/utils/cn.ts`
- Create: `runtime/README.md`
- Modify: `vitest.config.ts`
- Modify: `vitest.setup.ts`
- Create: `tests/lib/config/env.test.ts`
- Create: `tests/lib/api/client.test.ts`
- Create: `tests/lib/utils/cn.test.ts`

- [ ] **Step 1: Write the config tests first**

Write `tests/lib/config/env.test.ts` exactly as:

```ts
import { describe, expect, it } from "vitest";
import { normalizeBaseUrl } from "@/lib/config/env";

describe("normalizeBaseUrl", () => {
  it("removes trailing slashes", () => {
    expect(normalizeBaseUrl("http://localhost:8080///")).toBe("http://localhost:8080");
  });

  it("uses the fallback when the value is blank", () => {
    expect(normalizeBaseUrl("   ", "http://fallback.test")).toBe("http://fallback.test");
  });
});
```

- [ ] **Step 2: Write the API helper tests first**

Write `tests/lib/api/client.test.ts` exactly as:

```ts
import { describe, expect, it } from "vitest";
import { buildApiUrl } from "@/lib/api";

describe("buildApiUrl", () => {
  it("adds the API version prefix to relative paths", () => {
    expect(buildApiUrl("concepts", "http://localhost:8080/")).toBe(
      "http://localhost:8080/api/v1/concepts",
    );
  });

  it("does not duplicate the API version prefix", () => {
    expect(buildApiUrl("/api/v1/concepts", "http://localhost:8080")).toBe(
      "http://localhost:8080/api/v1/concepts",
    );
  });
});
```

- [ ] **Step 3: Write the utility tests first**

Write `tests/lib/utils/cn.test.ts` exactly as:

```ts
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("base", false, "active", null, undefined)).toBe("base active");
  });
});
```

- [ ] **Step 4: Configure Vitest**

Write `vitest.config.ts` exactly as:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Write `vitest.setup.ts` exactly as:

```ts
process.env.NEXT_PUBLIC_API_BASE_URL ??= "http://localhost:8080";
process.env.SERVER_API_BASE_URL ??= "http://localhost:8080";
```

- [ ] **Step 5: Run tests to verify missing modules fail**

Run:

```bash
pnpm test:run
```

Expected: the command exits with a non-zero status because `@/lib/config/env`, `@/lib/api`, and `@/lib/utils/cn` do not exist yet.

- [ ] **Step 6: Create `lib/config/env.ts`**

Write `lib/config/env.ts` exactly as:

```ts
const DEFAULT_API_BASE_URL = "http://localhost:8080";

export function normalizeBaseUrl(
  value: string | undefined,
  fallback = DEFAULT_API_BASE_URL,
): string {
  const rawValue = value?.trim() || fallback;
  return rawValue.replace(/\/+$/, "");
}

export const publicEnv = {
  apiBaseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
} as const;

export const serverEnv = {
  apiBaseUrl: normalizeBaseUrl(process.env.SERVER_API_BASE_URL, publicEnv.apiBaseUrl),
} as const;
```

- [ ] **Step 7: Create `lib/api/client.ts` and `lib/api/index.ts`**

Write `lib/api/client.ts` exactly as:

```ts
import { normalizeBaseUrl, publicEnv } from "@/lib/config/env";

export const API_VERSION_PREFIX = "/api/v1";

export function buildApiUrl(path: string, baseUrl = publicEnv.apiBaseUrl): string {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathWithoutVersion = normalizedPath.startsWith(API_VERSION_PREFIX)
    ? normalizedPath.slice(API_VERSION_PREFIX.length)
    : normalizedPath;

  return `${normalizedBaseUrl}${API_VERSION_PREFIX}${pathWithoutVersion}`;
}
```

Write `lib/api/index.ts` exactly as:

```ts
export { API_VERSION_PREFIX, buildApiUrl } from "./client";
```

- [ ] **Step 8: Create `lib/utils/cn.ts`**

Write `lib/utils/cn.ts` exactly as:

```ts
type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
```

- [ ] **Step 9: Create feature boundary README files**

Write `features/auth/README.md` exactly as:

```markdown
# Auth Feature

Owns user identity UI and client-side session surfaces when the auth slice is planned.
```

Write `features/community/README.md` exactly as:

```markdown
# Community Feature

Owns public discovery, discussion, and profile UI when the community slice is planned.
```

Write `features/studio/README.md` exactly as:

```markdown
# Studio Feature

Owns authoring, review, and publishing UI when the studio slice is planned.
```

Write `features/workspace/README.md` exactly as:

```markdown
# Workspace Feature

Owns learner progress, study flow, and workspace UI when the workspace slice is planned.
```

- [ ] **Step 10: Create `runtime/README.md`**

Write `runtime/README.md` exactly as:

```markdown
# Runtime Boundary

Browser-only and heavyweight runtime capabilities live here. The first expected use is a dedicated Pyodide integration slice.
```

- [ ] **Step 11: Run boundary tests**

Run:

```bash
pnpm test:run
```

Expected: all tests pass.

- [ ] **Step 12: Run type and lint checks**

Run:

```bash
pnpm lint
pnpm typecheck
```

Expected: both commands exit with status `0`.

- [ ] **Step 13: Commit boundaries and tests**

Run:

```bash
git add features/auth/README.md features/community/README.md features/studio/README.md features/workspace/README.md lib/config/env.ts lib/api/client.ts lib/api/index.ts lib/utils/cn.ts runtime/README.md tests/lib/config/env.test.ts tests/lib/api/client.test.ts tests/lib/utils/cn.test.ts vitest.config.ts vitest.setup.ts
git commit -m "chore(web): add scaffold boundaries"
```

Expected: a commit is created. Remaining deleted old scaffold files may still appear in `git status` until Task 4.

---

### Task 4: Documentation, Git Cleanup, And Full Verification

**Files:**
- Modify: `README.md`
- Delete from Git tracking: `app/(admin)/admin/page.tsx`
- Delete from Git tracking: `components/app-shell.tsx`
- Delete from Git tracking: `components/docs-card-grid.tsx`
- Delete from Git tracking: `components/docs-code-block.tsx`
- Delete from Git tracking: `components/docs-hero-panel.tsx`
- Delete from Git tracking: `components/docs-notice.tsx`
- Delete from Git tracking: `components/docs-page-header.tsx`
- Delete from Git tracking: `components/metric-strip.tsx`
- Delete from Git tracking: `components/status-pill.tsx`
- Delete from Git tracking: `features/concepts/concept-card.tsx`
- Delete from Git tracking: `features/identity/session-summary.tsx`
- Delete from Git tracking: `features/studio/content-draft-panel.tsx`
- Delete from Git tracking: `features/workspace/roadmap-preview.tsx`
- Delete from Git tracking: `lib/api/concepts.ts`
- Delete from Git tracking: `lib/api/config.ts`
- Delete from Git tracking: `lib/api/http.ts`
- Delete from Git tracking: `lib/api/identity.ts`
- Delete from Git tracking: `runtime/python-runtime.ts`
- Delete from Git tracking: `tests/lib/api/config.test.ts`
- Delete from Git tracking: `tests/lib/api/http.test.ts`
- Delete from Git tracking: `tests/runtime/python-runtime.test.ts`

- [ ] **Step 1: Replace `README.md`**

Write `README.md` exactly as:

````markdown
# Learning Garden Web

User-facing web client for AI Learning Garden.

This repository is the browser product surface. It is intentionally separated from backend persistence, authorization, and storage concerns.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS 4
- pnpm
- ESLint
- Prettier
- Vitest

## Structure

```text
learning-garden-web/
|-- app/                 # App Router routes and layouts
|-- components/          # Shared layout and UI primitives
|-- features/            # User-facing feature modules
|-- lib/api/             # Backend API URL and client boundary
|-- lib/config/          # Environment and app config
|-- lib/utils/           # Framework-neutral utilities
|-- runtime/             # Browser-only runtime integrations
|-- tests/               # Unit and boundary tests
`-- docs/                # Specs and implementation plans
```

## Local Environment

Create `.env.local` when running against a local backend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
SERVER_API_BASE_URL=http://localhost:8080
```

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

## Architecture Rules

- `app/` owns route boundaries.
- `components/` must stay reusable and feature-neutral.
- `features/*` modules must not import other feature modules directly.
- Backend API access must flow through `lib/api/`.
- Environment parsing must stay in `lib/config/`.
- Browser-only runtime integrations must stay in `runtime/`.
````

- [ ] **Step 2: Stage all intentional scaffold changes**

Run:

```bash
git add -A
```

Expected: new files, modified files, and deleted old scaffold files are staged. `.next/`, `node_modules/`, `.DS_Store`, and `.env.local` are not staged.

- [ ] **Step 3: Inspect staged changes**

Run:

```bash
git status --short
```

Expected: deleted old files are staged as `D`, new scaffold files are staged as `A`, and replaced files are staged as `M`. No `.next/`, `node_modules/`, `.DS_Store`, or `.env.local` entries appear.

- [ ] **Step 4: Run full verification**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

Expected: all four commands exit with status `0`.

- [ ] **Step 5: Commit final cleanup**

Run:

```bash
git commit -m "chore(web): clean rebuilt scaffold"
```

Expected: a commit is created that records the removal of obsolete tracked files and the final README update.

- [ ] **Step 6: Confirm repository state**

Run:

```bash
git status --short --branch
git remote -v
```

Expected: branch output still shows `main` with the existing `origin` remote. The working tree is clean except for files intentionally produced by verification tools and ignored by `.gitignore`.
