import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type DocsAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

function DocsButton({ action }: { action: DocsAction }) {
  const primary = action.variant !== "secondary";

  return (
    <Link
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition active:translate-y-px ${
        primary
          ? "primary-action bg-black hover:bg-zinc-800"
          : "bg-[#e9e9e9] text-zinc-900 hover:bg-[#dddddd]"
      }`}
      href={action.href}
    >
      {action.label}
      {primary ? <ArrowUpRight aria-hidden="true" size={15} /> : null}
    </Link>
  );
}

export function DocsHeroPanel({
  actions,
  body,
  children,
  title,
}: {
  actions?: DocsAction[];
  body: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="grid gap-10 rounded-[18px] bg-[var(--panel-soft)] p-7 sm:p-9 lg:grid-cols-[minmax(280px,0.55fr)_minmax(360px,1fr)] lg:gap-12">
      <div className="flex max-w-[440px] flex-col justify-center">
        <h2 className="text-2xl font-semibold tracking-[-0.01em]">{title}</h2>
        <p className="mt-5 text-base leading-7 text-[var(--muted)]">{body}</p>
        {actions?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {actions.map((action) => (
              <DocsButton action={action} key={action.label} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
