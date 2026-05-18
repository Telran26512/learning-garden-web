import type { ReactNode } from "react";
import Link from "next/link";

export function DocsNotice({
  actionHref,
  actionLabel,
  children,
  title,
}: {
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-[var(--line)] bg-white p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="mt-2 max-w-[78ch] text-base leading-7 text-[var(--muted)]">
          {children}
        </div>
      </div>
      {actionHref && actionLabel ? (
        <Link
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#e9e9e9] px-5 text-sm font-semibold text-zinc-900 transition hover:bg-[#dddddd]"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
