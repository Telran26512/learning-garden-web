import { AppShell } from "@/components/app-shell";
import { DocsCardGrid } from "@/components/docs-card-grid";
import { DocsCodeBlock } from "@/components/docs-code-block";
import { DocsHeroPanel } from "@/components/docs-hero-panel";
import { DocsNotice } from "@/components/docs-notice";
import { DocsPageHeader } from "@/components/docs-page-header";

const roadmapLines = [
  { code: "M0 foundation", tone: "keyword" as const },
  { code: "  [x] route groups" },
  { code: "  [x] API boundary" },
  { code: "  [ ] identity session" },
  { code: "  [ ] private concept CRUD" },
  { code: "" },
  { code: "M1 personal loop", tone: "keyword" as const },
  { code: "  [ ] linear regression concept" },
  { code: "  [ ] runnable numpy example" },
  { code: "  [ ] paper notes" },
];

const workspaceCards = [
  {
    title: "Roadmap",
    description:
      "Follow the learning plan by milestone instead of calendar pressure. Each milestone should leave a usable loop.",
    href: "/workspace",
    label: "Open roadmap",
  },
  {
    title: "Concepts",
    description:
      "Keep concept content stable and separate from personal learning status such as checked tasks or review state.",
    href: "/workspace",
    label: "Open concepts",
  },
  {
    title: "Review",
    description:
      "Review cards and SM-2 scheduling arrive later, once there is enough content worth revisiting.",
    href: "/workspace",
    label: "View review",
  },
];

export default function WorkspacePage() {
  return (
    <AppShell activePath="/workspace" sidebarActive="roadmap">
      <main className="mx-auto w-full max-w-[1180px] py-12 lg:py-14">
        <DocsPageHeader
          eyebrow="Workspace"
          title="Personal learning path"
          description="The workspace shows the owner's private and public content together with learning state that belongs outside the content tables."
        />

        <DocsHeroPanel
          actions={[
            { href: "/studio", label: "Create a concept" },
            { href: "/workspace", label: "View roadmap", variant: "secondary" },
          ]}
          body="Use the workspace to move from a weekly plan to a concrete concept page, then connect derivation, code, and paper notes."
          title="Workspace quickstart"
        >
          <DocsCodeBlock language="roadmap" lines={roadmapLines} />
        </DocsHeroPanel>

        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-semibold tracking-[-0.02em]">
            Learning surfaces
          </h2>
          <DocsCardGrid cards={workspaceCards} columns={3} />
        </section>

        <div className="mt-8">
          <DocsNotice title="Learning state is separate">
            Content remains portable Markdown and metadata. Task checks, mastery
            status, and review scheduling belong to the learning module.
          </DocsNotice>
        </div>
      </main>
    </AppShell>
  );
}
