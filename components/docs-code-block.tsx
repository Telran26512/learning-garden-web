type CodeLine = {
  code: string;
  tone?: "default" | "keyword" | "string" | "comment" | "accent";
};

const toneClassName: Record<NonNullable<CodeLine["tone"]>, string> = {
  accent: "text-[#0b6f57]",
  comment: "text-zinc-400",
  default: "text-zinc-700",
  keyword: "text-[#1f6feb]",
  string: "text-[#008060]",
};

export function DocsCodeBlock({
  language,
  lines,
}: {
  language: string;
  lines: CodeLine[];
}) {
  return (
    <div className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-zinc-800">{language}</span>
        <span className="rounded-md border border-[var(--line)] px-2 py-1 text-xs text-[var(--muted)]">
          copy
        </span>
      </div>
      <pre className="overflow-x-auto text-[15px] leading-7">
        <code>
          {lines.map((line, index) => (
            <span
              className="grid grid-cols-[2.25rem_minmax(0,1fr)]"
              key={index}
            >
              <span className="select-none pr-4 text-right tabular-nums text-zinc-400">
                {index + 1}
              </span>
              <span
                className={`min-w-0 whitespace-pre ${toneClassName[line.tone ?? "default"]}`}
              >
                {line.code || " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
