import type { ReactNode } from "react";

export function SidebarHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="syn-kicker mb-3 px-1 text-[var(--syn-reading-muted)]">
      {children}
    </h2>
  );
}
