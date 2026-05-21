import type { RoadmapTaskStatus } from "@/lib/types/synapse";

export function doneStageBadgeClass() {
  return "grid size-10 place-items-center rounded-[var(--syn-radius)] bg-[var(--syn-accent)] text-[16px] font-bold leading-none text-[#FFFFFF]";
}

export function stageIndexBadgeClass(status: "active" | "locked") {
  return [
    "grid",
    "size-10",
    "place-items-center",
    "rounded-[var(--syn-radius)]",
    "border",
    "text-[14px]",
    "font-semibold",
    status === "active"
      ? "border-[var(--syn-accent)] bg-[#F6F9F6] text-[var(--syn-accent)]"
      : "border-[var(--syn-hairline-dark)] text-[var(--syn-working-muted)]",
  ].join(" ");
}

export function lessonCardClass(active: boolean) {
  return [
    "min-h-[82px]",
    "rounded-[var(--syn-radius)]",
    "p-4",
    "transition",
    active
      ? "border-[1.5px] border-[var(--syn-accent)] bg-[#F7FAF7] shadow-[inset_0_0_0_1px_rgba(27,75,52,0.06)]"
      : "border border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] hover:border-[#C7C7C7]",
  ].join(" ");
}

export function activeLessonBadgeClass() {
  return "rounded-[3px] bg-[var(--syn-accent)] px-2 py-0.5 text-[11px] font-bold leading-5 text-[#FFFFFF]";
}

export function doneTaskBoxClass() {
  return "grid size-4 place-items-center rounded-[3px] bg-[var(--syn-accent)] text-[10px] font-bold leading-none text-[#FFFFFF]";
}

export function doneCheckClass() {
  return "text-[15px] font-bold leading-none text-[var(--syn-accent)]";
}

export function taskLabelClass(status: RoadmapTaskStatus) {
  return status === "done"
    ? "text-[var(--syn-working-ink)] line-through decoration-[var(--syn-working-muted)] decoration-1"
    : "";
}
