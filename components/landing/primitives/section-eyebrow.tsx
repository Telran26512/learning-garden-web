import type * as React from "react";

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-[11px] tracking-[0.05em] text-text-secondary [font-family:var(--font-mono)]">
      {children}
    </div>
  );
}
