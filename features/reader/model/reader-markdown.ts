export type ReaderInlineSegment =
  | { text: string; type: "text" }
  | { text: string; type: "concept" }
  | { text: string; type: "code" };

export type ReaderMarkdownBlock =
  | { id: string; level: 2 | 3; text: string; type: "heading" }
  | { segments: ReaderInlineSegment[]; type: "paragraph" }
  | { segments: ReaderInlineSegment[]; type: "blockquote" }
  | {
      body: string;
      equationNumber: number;
      id: string;
      steps: ReaderMathStep[];
      type: "math";
    }
  | { body: string; language: string; ref: string; type: "code" }
  | { back: string; front: string; type: "card" }
  | {
      anchor: string;
      citationLabel: string;
      ref: string;
      source: "arxiv" | "doi" | "manual";
      title: string;
      type: "paper";
    };

export type ReaderMathStep = {
  anchor: string;
  label: string;
  latex: string;
};

export function parseReaderMarkdown(
  source: string,
  options: { stripFirstH1?: boolean } = {},
): ReaderMarkdownBlock[] {
  const blocks: ReaderMarkdownBlock[] = [];
  const lines = source.split("\n");
  let equationNumber = 0;
  let strippedFirstH1 = false;

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line.startsWith("::math")) {
      const body = readDelimitedBody(lines, index);
      index = body.endIndex;
      equationNumber += 1;
      blocks.push({
        body: body.value.trim(),
        equationNumber,
        id: readDirectiveValue(line, "anchor") || `eq-${equationNumber}`,
        steps: deriveReaderMathSteps(body.value, equationNumber),
        type: "math",
      });
      continue;
    }

    if (line.startsWith("::code")) {
      const body = readOptionalDelimitedBody(lines, index);
      index = body.endIndex;
      blocks.push({
        body: body.value.trim(),
        language: readDirectiveValue(line, "lang") || "text",
        ref: readDirectiveValue(line, "ref"),
        type: "code",
      });
      continue;
    }

    if (line.startsWith("::card")) {
      blocks.push({
        back: readDirectiveValue(line, "back"),
        front: readDirectiveValue(line, "front"),
        type: "card",
      });
      continue;
    }

    if (line.startsWith("::paper")) {
      const ref = readDirectiveValue(line, "ref");
      const anchor = readDirectiveValue(line, "anchor");
      const title = readDirectiveValue(line, "title");
      const source = normalizePaperSource(
        readDirectiveValue(line, "source"),
        ref,
      );

      blocks.push({
        anchor,
        citationLabel: createCitationLabel(ref, anchor, title),
        ref,
        source,
        title,
        type: "paper",
      });
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);

    if (heading) {
      const rawLevel = heading[1].length;
      const text = heading[2];

      if (rawLevel === 1 && options.stripFirstH1 && !strippedFirstH1) {
        strippedFirstH1 = true;
        continue;
      }

      const level = rawLevel <= 2 ? 2 : 3;
      blocks.push({
        id: slugifyReaderHeading(text),
        level,
        text,
        type: "heading",
      });
      continue;
    }

    if (line.startsWith(">")) {
      blocks.push({
        segments: parseInlineConcepts(line.replace(/^>\s?/u, "")),
        type: "blockquote",
      });
      continue;
    }

    const paragraphLines = [line];

    while (
      index + 1 < lines.length &&
      lines[index + 1]?.trim() &&
      !isReaderBlockStart(lines[index + 1] ?? "")
    ) {
      index += 1;
      paragraphLines.push(lines[index]?.trim() ?? "");
    }

    blocks.push({
      segments: parseInlineConcepts(paragraphLines.join(" ")),
      type: "paragraph",
    });
  }

  return blocks;
}

export function slugifyReaderHeading(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/gu, "-")
    .replace(/[^\p{L}\p{N}§.-]/gu, "");
}

function isReaderBlockStart(line: string) {
  const trimmed = line.trim();

  return (
    trimmed.startsWith("#") ||
    trimmed.startsWith(">") ||
    trimmed.startsWith("::math") ||
    trimmed.startsWith("::code") ||
    trimmed.startsWith("::card") ||
    trimmed.startsWith("::paper")
  );
}

function parseInlineConcepts(text: string): ReaderInlineSegment[] {
  const segments: ReaderInlineSegment[] = [];
  const matcher = /::concept\[([^\]]+)\]|`([^`]+)`/gu;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(text))) {
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), type: "text" });
    }

    if (match[1]) {
      segments.push({ text: match[1], type: "concept" });
    } else {
      segments.push({ text: match[2], type: "code" });
    }
    cursor = matcher.lastIndex;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), type: "text" });
  }

  return segments;
}

function readDelimitedBody(lines: string[], startIndex: number) {
  const body: string[] = [];
  let index = startIndex + 1;

  while (index < lines.length && lines[index]?.trim() !== "::") {
    body.push(lines[index] ?? "");
    index += 1;
  }

  return {
    endIndex: index < lines.length ? index : lines.length - 1,
    value: body.join("\n"),
  };
}

function readOptionalDelimitedBody(lines: string[], startIndex: number) {
  const nextIndex = startIndex + 1;
  const next = lines[nextIndex]?.trim();

  if (!next) {
    const nextSignificant = findNextSignificantLine(lines, nextIndex + 1);

    if (!nextSignificant || isReaderBlockStart(nextSignificant)) {
      return { endIndex: startIndex, value: "" };
    }
  }

  if (next === "::") {
    return { endIndex: nextIndex, value: "" };
  }

  if (next && isReaderBlockStart(next)) {
    return { endIndex: startIndex, value: "" };
  }

  return readDelimitedBody(lines, startIndex);
}

function findNextSignificantLine(lines: string[], startIndex: number) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index]?.trim();
    if (line) return line;
  }

  return "";
}

function readDirectiveValue(line: string, key: string) {
  const match = new RegExp(`${key}=(\"[^\"]*\"|[^\\s}]+)`, "u").exec(line);

  if (!match) {
    return "";
  }

  return match[1].replace(/^"|"$/gu, "");
}

function normalizePaperSource(
  value: string,
  ref: string,
): "arxiv" | "doi" | "manual" {
  if (value === "arxiv" || looksLikeArxiv(value) || looksLikeArxiv(ref)) {
    return "arxiv";
  }
  if (value === "doi" || value.startsWith("10.") || ref.startsWith("10.")) {
    return "doi";
  }

  return "manual";
}

function createCitationLabel(ref: string, anchor: string, title: string) {
  const base =
    title ||
    (ref === "1706.03762" ? "Vaswani 2017" : ref ? `arXiv:${ref}` : "paper");

  return anchor ? `${base}, ${anchor}` : base;
}

function looksLikeArxiv(value: string) {
  return /^\d{4}\.\d{4,5}$/u.test(value);
}

function deriveReaderMathSteps(latex: string, equationNumber: number) {
  return latex
    .split(/\\\\(?=\s*(?:\n|$))/u)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => ({
      anchor: `eq-${equationNumber}-${index + 1}`,
      label: `S-${String(index + 1).padStart(2, "0")}`,
      latex: part,
    }));
}
