import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ActionButtonProps = {
  children: ReactNode;
  tone?: "primary" | "secondary";
  onClick: () => void;
};

export function ActionButton({ children, tone = "secondary", onClick }: ActionButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring rounded-md px-4 py-2 font-medium transition",
        tone === "primary"
          ? "bg-garden-600 text-white hover:bg-garden-700"
          : "border hair hover:bg-slate-50",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
