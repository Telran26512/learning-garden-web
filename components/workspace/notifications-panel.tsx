import { notifications } from "./data/mocks";

export function NotificationsPanel() {
  return (
    <section className="rounded-md border border-border-subtle bg-black p-6">
      <h2 className="mb-5 text-[13px] font-medium text-text-secondary">
        Notifications
      </h2>
      <ul className="space-y-5">
        {notifications.map((item) => (
          <li className="grid grid-cols-[34px_1fr] gap-3" key={item.title}>
            <span className="grid size-8 place-items-center rounded-full bg-surface-strong text-[12px] font-semibold text-white">
              {item.avatar}
            </span>
            <span>
              <span className="block text-[14px] font-medium leading-6 text-text-strong">
                {item.title}
              </span>
              <span className="text-[12px] text-text-muted">{item.time}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
