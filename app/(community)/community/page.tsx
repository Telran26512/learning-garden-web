import { AppShell } from "@/components/app-shell";
import { DocsCardGrid } from "@/components/docs-card-grid";
import { DocsCodeBlock } from "@/components/docs-code-block";
import { DocsHeroPanel } from "@/components/docs-hero-panel";
import { DocsNotice } from "@/components/docs-notice";
import { DocsPageHeader } from "@/components/docs-page-header";

const communityLines = [
  { code: "GET /api/v1/concepts?visibility=public", tone: "keyword" as const },
  { code: "" },
  { code: "{", tone: "default" as const },
  { code: '  "concepts": [', tone: "default" as const },
  { code: "    {", tone: "default" as const },
  { code: '      "title": "Policy Gradient",', tone: "string" as const },
  { code: '      "owner": "@raymond",', tone: "string" as const },
  { code: '      "visibility": "public"', tone: "string" as const },
  { code: "    }", tone: "default" as const },
  { code: "  ]", tone: "default" as const },
  { code: "}", tone: "default" as const },
];

const communityCards = [
  {
    title: "Public notes",
    description:
      "Browse concepts that owners have intentionally published from their private workspace.",
    href: "/community",
    label: "View notes",
  },
  {
    title: "Profiles",
    description:
      "Public user pages will collect a learner's visible concepts, papers, and experiments.",
    href: "/community",
    label: "View profiles",
  },
  {
    title: "Discussions",
    description:
      "Comments and discussions stay out of M0 and come online when the first small community is ready.",
    href: "/community",
    label: "Read plan",
  },
];

export default function CommunityPage() {
  return (
    <AppShell activePath="/community" sidebarActive="public-notes">
      <main className="mx-auto w-full max-w-[1180px] py-12 lg:py-14">
        <DocsPageHeader
          eyebrow="Community"
          title="Public learning notes"
          description="Community is an aggregation layer over public content, not a separate wiki. Private work stays private until the owner changes visibility."
        />

        <DocsHeroPanel
          actions={[
            { href: "/workspace", label: "Write privately" },
            {
              href: "/community",
              label: "Browse public",
              variant: "secondary",
            },
          ]}
          body="Public content is the same concept data viewed through a visibility filter. Social features are intentionally deferred until M4."
          title="Community quickstart"
        >
          <DocsCodeBlock language="http" lines={communityLines} />
        </DocsHeroPanel>

        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-semibold tracking-[-0.02em]">
            Community paths
          </h2>
          <DocsCardGrid cards={communityCards} columns={3} />
        </section>

        <div className="mt-8">
          <DocsNotice title="Visibility is the boundary">
            Every public surface starts from `visibility=public`. Comments,
            follows, and feeds attach later without changing the content model.
          </DocsNotice>
        </div>
      </main>
    </AppShell>
  );
}
