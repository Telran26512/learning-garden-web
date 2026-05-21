export function SectionHeading({
  children,
  eyebrow,
  title,
}: {
  children: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header>
      <p className="font-mono text-[12px] text-[var(--syn-reading-muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance [font-family:var(--font-display)] text-[34px] font-medium leading-[1.15] text-[var(--syn-reading-ink)] sm:text-[42px]">
        {title}
      </h2>
      <p className="mt-4 max-w-[690px] text-[16px] leading-[1.75] text-[var(--syn-reading-secondary)]">
        {children}
      </p>
    </header>
  );
}
