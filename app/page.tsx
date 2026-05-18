import { AppShell } from "@/components/app-shell";
import { DocsCardGrid } from "@/components/docs-card-grid";
import { DocsCodeBlock } from "@/components/docs-code-block";
import { DocsHeroPanel } from "@/components/docs-hero-panel";
import { DocsNotice } from "@/components/docs-notice";
import { DocsPageHeader } from "@/components/docs-page-header";

const quickstartLines = [
  { code: "---", tone: "comment" as const },
  { code: 'title: "Linear Regression"', tone: "string" as const },
  { code: 'visibility: "private"', tone: "string" as const },
  { code: "week: 7", tone: "accent" as const },
  { code: "---", tone: "comment" as const },
  { code: "" },
  { code: "## Math derivation", tone: "keyword" as const },
  { code: "$$ y = Xw + b $$", tone: "string" as const },
  { code: "" },
  { code: "```python", tone: "comment" as const },
  { code: "theta = np.linalg.solve(X.T @ X, X.T @ y)" },
  { code: "```", tone: "comment" as const },
  { code: "" },
  { code: "[Paper notes](./papers/least-squares)", tone: "accent" as const },
];

const buildPathCards = [
  {
    title: "Workspace",
    description:
      "Track the private learning path, current concepts, review queue, and implementation notes in one place.",
    href: "/workspace",
    label: "Open workspace",
  },
  {
    title: "Studio",
    description:
      "Write concept pages that connect derivations, runnable numpy code, and paper reading notes.",
    href: "/studio",
    label: "Start writing",
  },
];

const moduleCards = [
  {
    title: "Math derivations",
    description:
      "Keep proofs and equations close to the concept they support, with KaTeX-ready Markdown.",
    href: "/workspace",
    label: "View path",
  },
  {
    title: "Runnable code",
    description:
      "Use a browser runtime boundary for small numpy examples, and link heavier RL work to external notebooks.",
    href: "/studio",
    label: "See runtime",
  },
  {
    title: "Paper notes",
    description:
      "Attach original paper links and reading notes directly to concepts and experiments.",
    href: "/community",
    label: "Browse notes",
  },
];

export default function HomePage() {
  return (
    <AppShell activePath="/" sidebarActive="overview">
      <main className="mx-auto w-full max-w-[1180px] py-12 lg:py-14">
        <DocsPageHeader
          eyebrow="Get started"
          title="Learning Garden"
          description="A docs-style learning workspace for connecting math derivations, runnable code, and paper reading across a multi-user AI learning platform."
        />

        <DocsHeroPanel
          actions={[
            { href: "/workspace", label: "Get started" },
            { href: "/studio", label: "Create concept", variant: "secondary" },
          ]}
          body="Create the first private concept, keep the learning state separate from content, and expose public notes only when visibility is explicitly changed."
          title="Developer quickstart"
        >
          <DocsCodeBlock language="markdown" lines={quickstartLines} />
        </DocsHeroPanel>

        <div className="mt-8">
          <DocsNotice
            actionHref="/workspace"
            actionLabel="Open the path"
            title="Build with the project docs"
          >
            The frontend follows the documented route groups and keeps all
            backend calls behind `lib/api`, so later M0 identity and concept
            slices can land without reshaping the UI foundation.
          </DocsNotice>
        </div>

        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-semibold tracking-[-0.02em]">
            Build paths
          </h2>
          <DocsCardGrid cards={buildPathCards} />
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.02em]">
                Learning modules
              </h2>
              <p className="mt-2 max-w-[72ch] text-base leading-7 text-[var(--muted)]">
                Start with a narrow M0 foundation, then add modules as real
                learning content appears.
              </p>
            </div>
          </div>
          <DocsCardGrid cards={moduleCards} columns={3} />
        </section>
      </main>
    </AppShell>
  );
}
