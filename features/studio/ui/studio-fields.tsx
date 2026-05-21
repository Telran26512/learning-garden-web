import { useState, type ReactNode } from "react";

export function SidebarLabel({ children }: { children: ReactNode }) {
  return (
    <div className="syn-kicker mb-2 px-2 text-[var(--syn-working-muted)]">
      {children}
    </div>
  );
}

export function Section({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <section>
      <h2 className="syn-kicker mb-3 text-[var(--syn-working-muted)]">
        {label}
      </h2>
      {children}
    </section>
  );
}

export function MetaField({
  label,
  link,
  mono,
  value,
}: {
  label: string;
  link?: boolean;
  mono?: boolean;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-[12px]">
      <span className="text-[11.5px] text-[var(--syn-working-muted)]">
        {label}
      </span>
      {/* §1.g ROADMAP value 改纯白，可点击项 hover 下划线 */}
      <span
        className={[
          mono ? "font-mono" : "",
          link ? "cursor-pointer hover:underline" : "",
          "text-right text-[var(--syn-working-ink)]",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

export function MetaSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: readonly string[] | string[];
  value: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-1.5 text-[12px]">
      <span className="text-[11.5px] text-[var(--syn-working-muted)]">
        {label}
      </span>
      <select
        className="max-w-[190px] bg-transparent text-right text-[12px] text-[var(--syn-working-ink)] outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option
            className="bg-[var(--syn-working-surface)] text-[var(--syn-working-ink)]"
            key={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function MetaToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-1.5 text-[12px]">
      <span className="text-[11.5px] text-[var(--syn-working-muted)]">
        {label}
      </span>
      <input
        checked={checked}
        className="size-4 accent-[var(--syn-accent)]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}

export function EditableSlug({
  onSlugChange,
  slug,
}: {
  onSlugChange: (slug: string) => void;
  slug: string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="mt-2 inline-flex max-w-full items-center font-mono text-[12px]">
        {/* §4 URL slug 前缀不可编辑且更暗，后缀点击后进入 input */}
        <span className="text-[var(--syn-working-muted)]">
          synapse.app/u/zhe-li/c/
        </span>
        <input
          autoFocus
          className="min-w-[180px] bg-transparent p-0 text-[var(--syn-working-ink)] outline-none"
          onBlur={() => setIsEditing(false)}
          onChange={(event) => onSlugChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              event.currentTarget.blur();
            }
          }}
          value={slug}
        />
      </div>
    );
  }

  return (
    <button
      className="group mt-2 inline-flex max-w-full items-center gap-0 bg-transparent p-0 font-mono text-[12px]"
      onClick={() => setIsEditing(true)}
      type="button"
    >
      {/* §4 URL slug 去背景，前缀深灰、后缀更亮并 hover 下划线 */}
      <span className="text-[var(--syn-working-muted)]">
        synapse.app/u/zhe-li/c/
      </span>
      <span className="text-[var(--syn-working-ink)] underline-offset-3 group-hover:underline">
        {slug}
      </span>
    </button>
  );
}

export function InlineConcept({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-[#B39DDB]/[0.08] px-1.5 py-0.5 text-[12.5px] text-[#B39DDB]">
      {children}
    </span>
  );
}
