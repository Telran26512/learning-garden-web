import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type DocsCard = {
  description: string;
  href: string;
  label: string;
  title: string;
};

export function DocsCardGrid({
  cards,
  columns = 2,
}: {
  cards: DocsCard[];
  columns?: 2 | 3;
}) {
  return (
    <div
      className={`grid gap-4 ${
        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
      }`}
    >
      {cards.map((card) => (
        <article
          className="flex min-h-[172px] flex-col rounded-2xl border border-[var(--line)] bg-white p-6 transition hover:border-[var(--line-strong)]"
          key={card.title}
        >
          <h3 className="text-lg font-semibold tracking-[-0.01em]">
            {card.title}
          </h3>
          <p className="mt-4 max-w-[58ch] flex-1 text-base leading-7 text-[var(--muted)]">
            {card.description}
          </p>
          <Link
            className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-zinc-950"
            href={card.href}
          >
            {card.label}
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </article>
      ))}
    </div>
  );
}
