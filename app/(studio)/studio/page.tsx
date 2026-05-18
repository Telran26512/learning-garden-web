import { AppShell } from "@/components/app-shell";
import { DocsCardGrid } from "@/components/docs-card-grid";
import { DocsCodeBlock } from "@/components/docs-code-block";
import { DocsHeroPanel } from "@/components/docs-hero-panel";
import { DocsNotice } from "@/components/docs-notice";
import { DocsPageHeader } from "@/components/docs-page-header";

const studioLines = [
  { code: "concept.create({", tone: "keyword" as const },
  { code: '  slug: "linear-regression",', tone: "string" as const },
  { code: '  visibility: "private",', tone: "string" as const },
  { code: "  body: markdown`", tone: "default" as const },
  { code: "    ## Math", tone: "comment" as const },
  { code: "    $$ y = Xw + b $$", tone: "string" as const },
  { code: "    <RunnablePython />", tone: "accent" as const },
  { code: "    <PaperCode />", tone: "accent" as const },
  { code: "  `", tone: "default" as const },
  { code: "})", tone: "keyword" as const },
];

const studioCards = [
  {
    title: "Markdown",
    description:
      "The body stays portable and exportable instead of being locked into a proprietary editor format.",
    href: "/studio",
    label: "Write content",
  },
  {
    title: "KaTeX",
    description:
      "Math notation is rendered in the frontend while source remains plain Markdown.",
    href: "/studio",
    label: "Add math",
  },
  {
    title: "Runnable Python",
    description:
      "Small numpy examples run behind a runtime interface. Heavy RL code links out to notebooks.",
    href: "/studio",
    label: "Add code",
  },
  {
    title: "Paper links",
    description:
      "Attach source papers and reading notes directly to concept and experiment pages.",
    href: "/studio",
    label: "Add papers",
  },
];

export default function StudioPage() {
  return (
    <AppShell activePath="/studio" sidebarActive="code">
      <main className="mx-auto w-full max-w-[1180px] py-12 lg:py-14">
        <DocsPageHeader
          eyebrow="Studio"
          title="Create learning content"
          description="Studio is the authoring surface for durable concept pages: math, runnable code, and paper context in one Markdown-first workflow."
        />

        <DocsHeroPanel
          actions={[
            { href: "/studio", label: "Start a draft" },
            {
              href: "/workspace",
              label: "View workspace",
              variant: "secondary",
            },
          ]}
          body="Start private, keep the content portable, and publish only when the concept is ready to become part of the community view."
          title="Studio quickstart"
        >
          <DocsCodeBlock language="typescript" lines={studioLines} />
        </DocsHeroPanel>

        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-semibold tracking-[-0.02em]">
            Authoring blocks
          </h2>
          <DocsCardGrid cards={studioCards} />
        </section>

        <div className="mt-8">
          <DocsNotice title="Runtime stays isolated">
            Pyodide and future browser capabilities stay behind `runtime/`.
            Feature modules use interfaces, not direct runtime imports.
          </DocsNotice>
        </div>
      </main>
    </AppShell>
  );
}
