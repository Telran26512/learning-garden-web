import { todayTasks } from "./data/mocks";

export function TodayPanel() {
  return (
    <section className="rounded-md border border-border-subtle bg-black p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[13px] font-medium text-text-secondary">Today</h2>
        <span className="text-[12px] text-text-muted tabular-nums">5/19</span>
      </div>
      <ul className="space-y-4">
        {todayTasks.map((task) => (
          <li className="grid grid-cols-[18px_1fr] gap-3" key={task.title}>
            <span className="mt-1 size-4 rounded border border-border-muted" />
            <span>
              <span className="block text-[15px] font-medium leading-6 text-text-strong">
                {task.title}
              </span>
              <span className="mt-0.5 grid grid-cols-[minmax(0,1fr)_auto] gap-4 text-[12px] text-text-muted">
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
