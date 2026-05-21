import { notifications } from "./data/mocks";

export function NotificationsPanel() {
  return (
    <section className="rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-[var(--syn-working-surface)] p-6">
      <h2 className="mb-5 text-[13px] font-medium text-[var(--syn-working-secondary)]">
        Notifications
      </h2>
      <ul className="space-y-5">
        {notifications.map((item) => (
          <li className="grid grid-cols-[34px_1fr] gap-3" key={item.title}>
            <span className="grid size-8 place-items-center rounded-[var(--syn-radius)] border border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] text-[12px] font-semibold text-[var(--syn-working-ink)]">
              {item.avatar}
            </span>
            <span>
              <span className="block text-[14px] font-medium leading-6 text-[var(--syn-working-ink)]">
                {item.title}
              </span>
              <span className="text-[12px] text-[var(--syn-working-muted)]">
                {item.time}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
