export type StudioContentType =
  | "Concept"
  | "Paper Note"
  | "Experiment"
  | "Journal";

export type StudioDraftStatus = "draft" | "published";
export type StudioVisibility = "Private" | "Unlisted" | "Public";
export type StudioRelationType = "derives_from" | "implements" | "cites";
export type StudioResourceKind = "code" | "pdf" | "notebook";

export type StudioRelationship = {
  icon: string;
  id: string;
  rel: StudioRelationType;
  target: string;
};

export type StudioResource = {
  icon: string;
  id: string;
  kind: StudioResourceKind;
  name: string;
  source: string;
};

export type StudioRoadmap = {
  stage: string;
  track: string;
  week: string;
};

export type StudioHistoryEntry = {
  id: string;
  label: string;
  markdown: string;
  summary: string;
  title: string;
};

export type StudioDraft = {
  allowComments: boolean;
  allowDerivatives: boolean;
  contentType: StudioContentType;
  history: StudioHistoryEntry[];
  id: string;
  license: string;
  markdown: string;
  relationships: StudioRelationship[];
  resources: StudioResource[];
  roadmap: StudioRoadmap;
  slug: string;
  status: StudioDraftStatus;
  summary: string;
  tags: string[];
  title: string;
  updatedAtLabel: string;
  visibility: StudioVisibility;
};

export type StudioInlineSegment =
  | { text: string; type: "text" }
  | { text: string; type: "concept" };

export type StudioMarkdownBlock =
  | { level: 1 | 2 | 3; text: string; type: "heading" }
  | { segments: StudioInlineSegment[]; type: "paragraph" }
  | { segments: StudioInlineSegment[]; type: "blockquote" }
  | { body: string; type: "math" }
  | { lang: string; ref: string; type: "code" }
  | { back: string; front: string; type: "card" }
  | { anchor: string; ref: string; type: "paper" };

const relationIconByType: Record<StudioRelationType, string> = {
  cites: "※",
  derives_from: "⟶",
  implements: "≡",
};

const resourceIconByKind: Record<StudioResourceKind, string> = {
  code: ">_",
  notebook: "{}",
  pdf: "§",
};

export function slugifyTitle(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "untitled";
}

export function syncMarkdownTitle(markdown: string, title: string) {
  const nextTitle = title.trim() || "Untitled Note";

  if (/^#\s+.+$/m.test(markdown)) {
    return markdown.replace(/^#\s+.+$/m, `# ${nextTitle}`);
  }

  return `# ${nextTitle}\n\n${markdown}`;
}

export function createStudioDraft(
  existingCount: number,
  title = "Untitled Note",
): StudioDraft {
  return {
    allowComments: true,
    allowDerivatives: true,
    contentType: "Concept",
    history: [],
    id: `draft-${existingCount + 1}`,
    license: "CC BY-SA 4.0",
    markdown: `# ${title}\n\n`,
    relationships: [],
    resources: [],
    roadmap: {
      stage: "Stage 2 · Deep Learning",
      track: "Transformer 精读",
      week: "W3 · Transformer 精读",
    },
    slug: slugifyTitle(title),
    status: "draft",
    summary: "",
    tags: [],
    title,
    updatedAtLabel: "刚刚",
    visibility: "Public",
  };
}

export function addUniqueTag(tags: string[], nextTag: string) {
  const normalized = nextTag.trim().replace(/^#/, "");

  if (!normalized || tags.includes(normalized)) {
    return tags;
  }

  return [...tags, normalized];
}

export function removeTag(tags: string[], tagToRemove: string) {
  return tags.filter((tag) => tag !== tagToRemove);
}

export function createRelationship(
  existingCount: number,
  rel: StudioRelationType,
  target: string,
): StudioRelationship {
  return {
    icon: relationIconByType[rel],
    id: `rel-${existingCount + 1}`,
    rel,
    target,
  };
}

export function createResource(
  existingCount: number,
  kind: StudioResourceKind,
  name: string,
  source: string,
): StudioResource {
  return {
    icon: resourceIconByKind[kind],
    id: `res-${existingCount + 1}`,
    kind,
    name,
    source,
  };
}

export function createStudioHistoryEntry(
  existingCount: number,
  draft: Pick<StudioDraft, "markdown" | "summary" | "title">,
): StudioHistoryEntry {
  return {
    id: `version-${existingCount + 1}`,
    label: "刚刚保存",
    markdown: draft.markdown,
    summary: draft.summary,
    title: draft.title,
  };
}

export function parseStudioMarkdown(source: string): StudioMarkdownBlock[] {
  const blocks: StudioMarkdownBlock[] = [];
  const lines = source.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line === "::math") {
      const mathLines: string[] = [];
      index += 1;

      while (index < lines.length && lines[index]?.trim() !== "::") {
        mathLines.push(lines[index] ?? "");
        index += 1;
      }

      blocks.push({
        body: mathLines.join("\n").trim(),
        type: "math",
      });
      continue;
    }

    if (line.startsWith("::code")) {
      blocks.push({
        lang: readDirectiveValue(line, "lang") || "text",
        ref: readDirectiveValue(line, "ref") || "",
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
      blocks.push({
        anchor: readDirectiveValue(line, "anchor"),
        ref: readDirectiveValue(line, "ref"),
        type: "paper",
      });
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);

    if (heading) {
      blocks.push({
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2],
        type: "heading",
      });
      continue;
    }

    if (line.startsWith(">")) {
      blocks.push({
        segments: parseInlineConcepts(line.replace(/^>\s?/, "")),
        type: "blockquote",
      });
      continue;
    }

    const paragraphLines = [line];

    while (
      index + 1 < lines.length &&
      lines[index + 1]?.trim() &&
      !isBlockStart(lines[index + 1] ?? "")
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

function isBlockStart(line: string) {
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

function parseInlineConcepts(text: string): StudioInlineSegment[] {
  const segments: StudioInlineSegment[] = [];
  const matcher = /::concept\[([^\]]+)\]/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(text))) {
    if (match.index > cursor) {
      segments.push({
        text: text.slice(cursor, match.index),
        type: "text",
      });
    }

    segments.push({
      text: match[1],
      type: "concept",
    });
    cursor = matcher.lastIndex;
  }

  if (cursor < text.length) {
    segments.push({
      text: text.slice(cursor),
      type: "text",
    });
  }

  return segments;
}

function readDirectiveValue(line: string, key: string) {
  const match = new RegExp(`${key}=(\"[^\"]*\"|[^\\s}]+)`).exec(line);

  if (!match) {
    return "";
  }

  return match[1].replace(/^"|"$/g, "");
}
