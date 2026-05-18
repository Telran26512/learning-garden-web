type MetricTone = "green" | "amber" | "red" | "neutral";

type MetricItem = {
  label: string;
  value: string;
  tone?: MetricTone;
};

const dotClassName: Record<MetricTone, string> = {
  green: "bg-[var(--accent)]",
  amber: "bg-[var(--warn)]",
  red: "bg-[var(--danger)]",
  neutral: "bg-zinc-400",
};

export function MetricStrip({ items }: { items: MetricItem[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          className="min-h-28 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-4 shadow-sm"
          key={item.label}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClassName[item.tone ?? "neutral"]}`}
            />
          </div>
          <p className="mt-4 break-words text-2xl font-semibold tracking-normal">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}
