import type {
  RoadmapLesson,
  RoadmapStage,
  RoadmapTaskStatus,
} from "@/lib/types/synapse";
import { roadmap } from "./data/mocks";

export function RoadmapPanel() {
  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1.5 text-[12px] font-medium tracking-[0.05em] text-text-secondary">
            Roadmap
          </p>
          <h2 className="text-[24px] font-medium text-white">
            从基础到 RL · 12 个月
          </h2>
        </div>
        <div className="flex gap-6 pb-1 text-[14px]">
          <button
            className="bg-transparent p-0 font-medium text-text-secondary transition hover:text-white"
            type="button"
          >
            编辑 Roadmap
          </button>
          <button
            className="bg-transparent p-0 font-medium text-text-secondary transition hover:text-white"
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
      ? "bg-success"
      : stage.status === "active"
        ? "bg-white"
        : "bg-muted";

  return (
    <article className={isMuted ? "opacity-45" : ""}>
      <div className="mb-5 grid gap-4 sm:grid-cols-[44px_minmax(0,1fr)_max-content_240px] sm:items-center">
        <StageBadge status={stage.status}>{stage.index}</StageBadge>
        <h3 className="text-[17px] font-semibold text-text-soft">
          Stage {stage.index} · {stage.title}
        </h3>
        {stage.status === "locked" ? (
          <span className="text-[12px] text-text-muted">预计 7-8 周后开始</span>
        ) : (
          <span className="hidden sm:block" />
        )}
        <div className="flex items-center gap-3 sm:justify-end">
          <span className="h-1.5 w-44 overflow-hidden rounded-full bg-surface-strong">
            <span
              className={`block h-full rounded-full ${progressColor}`}
              style={{ width: `${stage.progress}%` }}
            />
          </span>
          <span className="min-w-10 text-right text-[13px] text-text-muted tabular-nums">
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
    return (
      <span className="grid size-10 place-items-center rounded-full bg-success text-[14px] font-semibold text-black">
        ✓
      </span>
    );
  }
  return (
    <span
      className={`grid size-10 place-items-center rounded-full border text-[14px] font-semibold ${
        status === "active"
          ? "border-white text-white"
          : "border-border-muted text-text-muted"
      }`}
    >
      {children}
    </span>
  );
}

function LessonCard({ lesson }: { lesson: RoadmapLesson }) {
  return (
    <article
      className={`min-h-[82px] rounded-md p-4 transition ${
        lesson.active
          ? "border-[1.5px] border-white bg-black"
          : "border border-border-subtle bg-base hover:border-border-strong"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-text-muted">
          {lesson.week}
        </span>
        {lesson.done && <span className="text-[14px] text-success">✓</span>}
        {lesson.active && (
          <span className="rounded-[3px] bg-white px-2 py-0.5 text-[11px] font-semibold text-black">
            在做
          </span>
        )}
      </div>
      <h4 className="text-[15px] font-semibold text-text-primary">
        {lesson.title}
      </h4>
      {lesson.tasks && (
        <ul className="mt-3 space-y-2">
          {lesson.tasks.map((task) => (
            <li
              className="group flex items-center gap-2 text-[13px] text-text-secondary"
              key={task.label}
            >
              <TaskBox status={task.status} />
              <span
                className={
                  task.status === "done" ? "line-through opacity-60" : ""
                }
              >
                {task.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function TaskBox({ status }: { status: RoadmapTaskStatus }) {
  if (status === "done") {
    return (
      <span className="grid size-4 place-items-center rounded-[4px] bg-success text-[10px] font-bold text-black">
        ✓
      </span>
    );
  }
  return (
    <span className="size-4 rounded-[4px] border border-border-muted transition group-hover:border-white" />
  );
}
