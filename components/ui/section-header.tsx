import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  action,
  className,
  description,
  eyebrow,
  title,
}: SectionHeaderProps) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-4 border-b hair pb-4", className)}>
      <div>
        {eyebrow ? <div className="sect-label mb-1">{eyebrow}</div> : null}
        <h1 className="font-serif text-[26px] font-semibold leading-tight tracking-[-0.03em] text-[color:var(--ink)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-[72ch] text-[13px] leading-relaxed text-[color:var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
