export function DocsPageHeader({
  description,
  eyebrow,
  title,
}: {
  description?: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <header className="pb-8">
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium text-[var(--muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 max-w-[66ch] text-base leading-7 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
