import { AppShell } from "@/components/app-shell";
import { DocsCardGrid } from "@/components/docs-card-grid";
import { DocsCodeBlock } from "@/components/docs-code-block";
import { DocsHeroPanel } from "@/components/docs-hero-panel";
import { DocsNotice } from "@/components/docs-notice";
import { DocsPageHeader } from "@/components/docs-page-header";

const adminLines = [
  { code: "role: admin", tone: "keyword" as const },
  { code: "status: reserved", tone: "comment" as const },
  { code: "" },
  { code: "M6 enables:", tone: "default" as const },
  { code: "  reports" },
  { code: "  moderation actions" },
  { code: "  public registration controls" },
  { code: "  anti-abuse hooks" },
];

const adminCards = [
  {
    title: "Reports",
    description:
      "A future queue for user reports against public content, discussions, and comments.",
    href: "/admin",
    label: "Reserved",
  },
  {
    title: "Moderation",
    description:
      "Admin actions are planned for M6 and remain outside the M0 foundation.",
    href: "/admin",
    label: "Reserved",
  },
  {
    title: "Registration",
    description:
      "Public signup can be enabled later because identity is multi-user from the start.",
    href: "/admin",
    label: "Reserved",
  },
];

export default function AdminPage() {
  return (
    <AppShell activePath="/admin" sidebarActive="overview">
      <main className="mx-auto w-full max-w-[1180px] py-12 lg:py-14">
        <DocsPageHeader
          eyebrow="Admin"
          title="Restricted operations"
          description="The admin route exists as a boundary for future moderation and public registration controls. It does not implement those systems in M0."
        />

        <DocsHeroPanel
          actions={[
            { href: "/", label: "Back to overview", variant: "secondary" },
          ]}
          body="Moderation is deliberately deferred until the platform opens beyond the first small group. The route stays visible so the boundary is explicit."
          title="Admin shell"
        >
          <DocsCodeBlock language="yaml" lines={adminLines} />
        </DocsHeroPanel>

        <section className="mt-12">
          <h2 className="mb-5 text-3xl font-semibold tracking-[-0.02em]">
            Reserved controls
          </h2>
          <DocsCardGrid cards={adminCards} columns={3} />
        </section>

        <div className="mt-8">
          <DocsNotice title="No moderation behavior yet">
            This page is only a visual and routing shell. Reports, rate limits,
            and admin actions should be implemented with backend authorization
            before this becomes operational.
          </DocsNotice>
        </div>
      </main>
    </AppShell>
  );
}
