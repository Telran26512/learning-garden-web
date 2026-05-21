import type {
  RoadmapLesson,
  RoadmapStage,
  RoadmapTaskStatus,
} from "@/lib/types/synapse";
import { roadmap } from "../data/mocks";
import {
  activeLessonBadgeClass,
  doneCheckClass,
  doneStageBadgeClass,
  doneTaskBoxClass,
  lessonCardClass,
  stageIndexBadgeClass,
  taskLabelClass,
} from "./roadmap-style";

export function RoadmapPanel() {
  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[12px] font-medium tracking-[0.02em] text-[var(--syn-working-secondary)]">
            Roadmap
          </p>
          <h2 className="text-[24px] font-medium text-[var(--syn-working-ink)]">
            从基础到 RL · 12 个月
          </h2>
        </div>
        <div className="flex gap-6 pb-1 text-[14px]">
          <button
            className="bg-transparent p-0 font-medium text-[var(--syn-working-secondary)] transition hover:text-[var(--syn-accent)]"
            type="button"
          >
            编辑 Roadmap
          </button>
          <button
            className="bg-transparent p-0 font-medium text-[var(--syn-working-secondary)] transition hover:text-[var(--syn-accent)]"
            type="button"
          >
            导出
          </button>
        </div>
      </div>
      <div className="space-y-11">
        {roadmap.map((stage) => (
          <StageRow key={stage.title} stage={stage} />
        ))}
      </div>
    </section>
  );
}

function StageRow({ stage }: { stage: RoadmapStage }) {
  const isMuted = stage.status === "locked";
  const progressColor =
    stage.status === "done"
      ? "bg-[var(--syn-accent)]"
      : stage.status === "active"
        ? "bg-[var(--syn-accent)]"
        : "bg-[#CFCFCF]";

  return (
    <article className={isMuted ? "opacity-45" : ""}>
      <div className="mb-5 grid gap-4 sm:grid-cols-[44px_minmax(0,1fr)_max-content_240px] sm:items-center">
        <StageBadge status={stage.status}>{stage.index}</StageBadge>
        <h3 className="text-[17px] font-semibold text-[var(--syn-working-ink)]">
          Stage {stage.index} · {stage.title}
        </h3>
        {stage.status === "locked" ? (
          <span className="text-[12px] text-[var(--syn-working-muted)]">
            预计 7-8 周后开始
          </span>
        ) : (
          <span className="hidden sm:block" />
        )}
        <div className="flex items-center gap-3 sm:justify-end">
          <span className="h-1.5 w-44 overflow-hidden rounded-full bg-[#ECECEC]">
            <span
              className={`block h-full rounded-full ${progressColor}`}
              style={{ width: `${stage.progress}%` }}
            />
          </span>
          <span className="min-w-10 text-right text-[13px] text-[var(--syn-working-muted)] tabular-nums">
            {stage.progress}%
          </span>
        </div>
      </div>

      <div className="grid gap-3 pl-0 sm:pl-[58px] xl:grid-cols-4">
        {stage.lessons.map((lesson) => (
          <LessonCard key={`${stage.index}-${lesson.week}`} lesson={lesson} />
        ))}
      </div>
    </article>
  );
}

function StageBadge({
  children,
  status,
}: {
  children: number;
  status: RoadmapStage["status"];
}) {
  if (status === "done") {
    return <span className={doneStageBadgeClass()}>✓</span>;
  }
  return <span className={stageIndexBadgeClass(status)}>{children}</span>;
}

function LessonCard({ lesson }: { lesson: RoadmapLesson }) {
  const isActive = lesson.active === true;

  return (
    <article className={lessonCardClass(isActive)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[var(--syn-working-muted)]">
          {lesson.week}
        </span>
        {lesson.done && <span className={doneCheckClass()}>✓</span>}
        {isActive && <span className={activeLessonBadgeClass()}>在做</span>}
      </div>
      <h4 className="text-[15px] font-semibold text-[var(--syn-working-ink)]">
        {lesson.title}
      </h4>
      {lesson.tasks && (
        <ul className="mt-3 space-y-2">
          {lesson.tasks.map((task) => (
            <li
              className="group flex items-center gap-2 text-[13px] text-[var(--syn-working-secondary)]"
              key={task.label}
            >
              <TaskBox status={task.status} />
              <span className={taskLabelClass(task.status)}>{task.label}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function TaskBox({ status }: { status: RoadmapTaskStatus }) {
  if (status === "done") {
    return <span className={doneTaskBoxClass()}>✓</span>;
  }
  return (
    <span className="size-4 rounded-[3px] border border-[var(--syn-hairline-dark)] transition group-hover:border-[var(--syn-accent)]" />
  );
}
