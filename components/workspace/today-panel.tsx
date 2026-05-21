import { todayTasks } from "./data/mocks";

export function TodayPanel() {
  return (
    <section className="rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-[var(--syn-working-surface)] p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[13px] font-medium text-[var(--syn-working-secondary)]">
          Today
        </h2>
        <span className="text-[12px] text-[var(--syn-working-muted)] tabular-nums">
          5/19
        </span>
      </div>
      <ul className="space-y-4">
        {todayTasks.map((task) => (
          <li className="grid grid-cols-[18px_1fr] gap-3" key={task.title}>
            <span className="mt-1 size-4 rounded-[3px] border border-[var(--syn-hairline-dark)]" />
            <span>
              <span className="block text-[15px] font-medium leading-6 text-[var(--syn-working-ink)]">
                {task.title}
              </span>
              <span className="mt-0.5 grid grid-cols-[minmax(0,1fr)_auto] gap-4 text-[12px] text-[var(--syn-working-muted)]">
                <span>{task.status}</span>
                <span className="text-right tabular-nums">{task.source}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
