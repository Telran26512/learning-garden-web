import Link from "next/link";
import { ArrowUpRight, LockKeyhole, UnlockKeyhole } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import type { ConceptSummary } from "@/lib/api";

export function ConceptCard({ concept }: { concept: ConceptSummary }) {
  const VisibilityIcon =
    concept.visibility === "public" ? UnlockKeyhole : LockKeyhole;

  return (
    <article className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label={concept.visibility}
              tone={concept.visibility === "public" ? "green" : "amber"}
            />
            <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 text-xs font-medium text-zinc-700">
              <VisibilityIcon aria-hidden="true" size={13} />
              week {concept.week ?? "-"}
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-normal">
            {concept.title}
          </h2>
        </div>
        <Link
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
          href={`/workspace/concepts/${concept.slug}`}
          title="打开概念"
        >
          <ArrowUpRight aria-hidden="true" size={18} />
          <span className="sr-only">打开概念</span>
        </Link>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
        {concept.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {concept.tags.map((tag) => (
          <span
            className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
