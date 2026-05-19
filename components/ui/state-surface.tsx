import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type StateSurfaceProps = {
  children?: ReactNode;
  className?: string;
  description: string;
  label?: string;
  title: string;
  tone?: "amber" | "green" | "neutral";
};

export function StateSurface({
  children,
  className,
  description,
  label = "状态",
  title,
  tone = "neutral",
}: StateSurfaceProps) {
  return (
    <div
      className={cn(
        "relative border-y hair py-5",
        tone === "green" && "border-garden-600/30",
        tone === "amber" && "border-amber-500/35",
        className,
      )}
    >
      <div className="absolute right-0 top-3 font-mono text-[52px] leading-none text-black/[0.035]">
        {tone === "amber" ? "!" : "∴"}
      </div>
      <div className="sect-label">{label}</div>
      <h2 className="mt-2 font-serif text-[22px] font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-[color:var(--muted)]">
        {description}
      </p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
