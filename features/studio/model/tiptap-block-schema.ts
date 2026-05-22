import {
  mergeAttributes,
  Node,
  type Extensions,
  type JSONContent,
  type NodeViewRenderer,
} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

export type MathBlockAttrs = {
  anchor: string;
  latex: string;
  step: string;
};

export type SynapseCodeBlockAttrs = {
  anchor: string;
  code: string;
  dependencies: string;
  language: string;
  ref?: string;
};

export type PaperBlockAttrs = {
  anchor: string;
  quote: string;
  ref: string;
  source: "arxiv" | "doi" | "manual";
  title: string;
};

export type StudioNodeViewRenderers = {
  codeBlock?: NodeViewRenderer;
  mathBlock?: NodeViewRenderer;
  paperBlock?: NodeViewRenderer;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mathBlock: {
      insertMathBlock: (attrs: Partial<MathBlockAttrs>) => ReturnType;
    };
    synapseCodeBlock: {
      insertSynapseCodeBlock: (
        attrs: Partial<SynapseCodeBlockAttrs>,
      ) => ReturnType;
    };
    paperBlock: {
      insertPaperBlock: (attrs: Partial<PaperBlockAttrs>) => ReturnType;
    };
  }
}

export const MathBlock = Node.create({
  name: "mathBlock",
  group: "block",
  atom: true,
  defining: true,
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      anchor: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-anchor") ?? "",
      },
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-latex") ?? "",
      },
      step: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-step") ?? "",
      },
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-synapse-block="math"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs = node.attrs as MathBlockAttrs;

    return [
      "section",
      mergeAttributes(
        HTMLAttributes,
        cleanDataAttributes({
          class: "syn-tiptap-block syn-tiptap-math-block",
          "data-anchor": attrs.anchor,
          "data-latex": attrs.latex,
          "data-step": attrs.step,
          "data-synapse-block": "math",
        }),
      ),
      ["div", { class: "syn-tiptap-block-label" }, "MathBlock"],
      ["pre", { class: "syn-tiptap-block-body" }, attrs.latex],
      attrs.anchor
        ? ["div", { class: "syn-tiptap-block-anchor" }, `#${attrs.anchor}`]
        : ["span", { hidden: "true" }],
    ];
  },

  addCommands() {
    return {
      insertMathBlock:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            attrs: {
              anchor: attrs.anchor ?? "",
              latex: attrs.latex ?? "",
              step: attrs.step ?? "",
            },
            type: this.name,
          }),
    };
  },
});

export const SynapseCodeBlock = Node.create({
  name: "codeBlock",
  group: "block",
  atom: true,
  code: true,
  defining: true,
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      anchor: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-anchor") ?? "",
      },
      code: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-code") ?? "",
      },
      dependencies: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-dependencies") ?? "",
      },
      language: {
        default: "text",
        parseHTML: (element) => element.getAttribute("data-language") ?? "text",
      },
      ref: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-ref") ?? "",
      },
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-synapse-block="code"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs = node.attrs as SynapseCodeBlockAttrs;

    return [
      "section",
      mergeAttributes(
        HTMLAttributes,
        cleanDataAttributes({
          class: "syn-tiptap-block syn-tiptap-code-block",
          "data-anchor": attrs.anchor,
          "data-code": attrs.code,
          "data-dependencies": attrs.dependencies,
          "data-language": attrs.language,
          "data-ref": attrs.ref,
          "data-synapse-block": "code",
        }),
      ),
      [
        "div",
        { class: "syn-tiptap-block-label" },
        `CodeBlock · ${attrs.language || "text"}`,
      ],
      [
        "pre",
        { class: "syn-tiptap-code-body" },
        ["code", { class: `language-${attrs.language || "text"}` }, attrs.code],
      ],
    ];
  },

  addCommands() {
    return {
      insertSynapseCodeBlock:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            attrs: {
              anchor: attrs.anchor ?? "",
              code: attrs.code ?? "",
              dependencies: attrs.dependencies ?? "",
              language: attrs.language ?? "text",
              ref: attrs.ref ?? "",
            },
            type: this.name,
          }),
    };
  },
});

export const PaperBlock = Node.create({
  name: "paperBlock",
  group: "block",
  atom: true,
  defining: true,
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      anchor: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-anchor") ?? "",
      },
      quote: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-quote") ?? "",
      },
      ref: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-ref") ?? "",
      },
      source: {
        default: "manual",
        parseHTML: (element) =>
          normalizePaperSource(element.getAttribute("data-source")),
      },
      title: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-title") ?? "",
      },
    };
  },

  parseHTML() {
    return [{ tag: 'article[data-synapse-block="paper"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const attrs = node.attrs as PaperBlockAttrs;

    return [
      "article",
      mergeAttributes(
        HTMLAttributes,
        cleanDataAttributes({
          class: "syn-tiptap-block syn-tiptap-paper-block",
          "data-anchor": attrs.anchor,
          "data-quote": attrs.quote,
          "data-ref": attrs.ref,
          "data-source": attrs.source,
          "data-synapse-block": "paper",
          "data-title": attrs.title,
        }),
      ),
      ["div", { class: "syn-tiptap-block-label" }, "PaperBlock"],
      ["strong", { class: "syn-tiptap-paper-title" }, attrs.title || attrs.ref],
      attrs.quote
        ? ["blockquote", { class: "syn-tiptap-paper-quote" }, attrs.quote]
        : ["span", { hidden: "true" }],
    ];
  },

  addCommands() {
    return {
      insertPaperBlock:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            attrs: {
              anchor: attrs.anchor ?? "",
              quote: attrs.quote ?? "",
              ref: attrs.ref ?? "",
              source: attrs.source ?? "manual",
              title: attrs.title ?? "",
            },
            type: this.name,
          }),
    };
  },
});

export function createStudioTiptapExtensions(
  nodeViews: StudioNodeViewRenderers = {},
): Extensions {
  return [
    StarterKit.configure({
      codeBlock: false,
      heading: {
        levels: [1, 2, 3],
      },
    }),
    nodeViews.mathBlock
      ? MathBlock.extend({
          addNodeView() {
            return nodeViews.mathBlock!;
          },
        })
      : MathBlock,
    nodeViews.codeBlock
      ? SynapseCodeBlock.extend({
          addNodeView() {
            return nodeViews.codeBlock!;
          },
        })
      : SynapseCodeBlock,
    nodeViews.paperBlock
      ? PaperBlock.extend({
          addNodeView() {
            return nodeViews.paperBlock!;
          },
        })
      : PaperBlock,
  ];
}

export function studioMarkdownToTiptapDoc(markdown: string): JSONContent {
  const content: JSONContent[] = [];
  const lines = markdown.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line.startsWith("::math")) {
      const body = readDelimitedBody(lines, index);
      index = body.endIndex;
      content.push({
        attrs: {
          anchor: readDirectiveValue(line, "anchor"),
          latex: body.value.trim(),
          step: readDirectiveValue(line, "step"),
        },
        type: "mathBlock",
      });
      continue;
    }

    if (line.startsWith("::code")) {
      const body = readOptionalDelimitedBody(lines, index);
      index = body.endIndex;
      content.push({
        attrs: {
          anchor: readDirectiveValue(line, "anchor"),
          code: body.value.trim(),
          dependencies: readDirectiveValue(line, "deps"),
          language: readDirectiveValue(line, "lang") || "text",
          ref: readDirectiveValue(line, "ref"),
        },
        type: "codeBlock",
      });
      continue;
    }

    if (line.startsWith("::paper")) {
      content.push({
        attrs: {
          anchor: readDirectiveValue(line, "anchor"),
          quote: readDirectiveValue(line, "quote"),
          ref: readDirectiveValue(line, "ref"),
          source: normalizePaperSource(readDirectiveValue(line, "source")),
          title: readDirectiveValue(line, "title"),
        },
        type: "paperBlock",
      });
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);

    if (heading) {
      content.push({
        attrs: { level: heading[1].length },
        content: [{ text: heading[2], type: "text" }],
        type: "heading",
      });
      continue;
    }

    if (line.startsWith(">")) {
      content.push({
        content: [{ text: line.replace(/^>\s?/, ""), type: "text" }],
        type: "blockquote",
      });
      continue;
    }

    const paragraphLines = [line];

    while (
      index + 1 < lines.length &&
      lines[index + 1]?.trim() &&
      !isDirectiveOrBlockStart(lines[index + 1] ?? "")
    ) {
      index += 1;
      paragraphLines.push(lines[index]?.trim() ?? "");
    }

    content.push({
      content: [{ text: paragraphLines.join(" "), type: "text" }],
      type: "paragraph",
    });
  }

  return {
    type: "doc",
    content: content.length > 0 ? content : [{ type: "paragraph" }],
  };
}

export function tiptapDocToStudioMarkdown(doc: JSONContent): string {
  const content = Array.isArray(doc.content) ? doc.content : [];
  const chunks = content
    .map((node) => nodeToMarkdown(node))
    .filter((chunk) => chunk.trim().length > 0);

  return chunks.join("\n\n");
}

function nodeToMarkdown(node: JSONContent): string {
  switch (node.type) {
    case "heading": {
      const level = Number(node.attrs?.level ?? 1);
      return `${"#".repeat(Math.min(Math.max(level, 1), 3))} ${nodeText(node)}`;
    }
    case "blockquote":
      return `> ${nodeText(node)}`;
    case "paragraph":
      return nodeText(node);
    case "mathBlock": {
      const attrs = node.attrs as Partial<MathBlockAttrs> | undefined;
      return [
        `::math${formatDirectiveAttrs({
          anchor: attrs?.anchor,
          step: attrs?.step,
        })}`,
        attrs?.latex ?? "",
        "::",
      ].join("\n");
    }
    case "codeBlock": {
      const attrs = node.attrs as Partial<SynapseCodeBlockAttrs> | undefined;
      const ref = attrs?.ref || attrs?.anchor;

      return [
        `::code${formatDirectiveAttrs({
          lang: attrs?.language,
          ref,
          deps: attrs?.dependencies,
          anchor: attrs?.anchor,
        })}`,
        attrs?.code ?? "",
        "::",
      ].join("\n");
    }
    case "paperBlock": {
      const attrs = node.attrs as Partial<PaperBlockAttrs> | undefined;
      return `::paper${formatDirectiveAttrs({
        ref: attrs?.ref,
        source: attrs?.source,
        title: attrs?.title,
        quote: attrs?.quote,
        anchor: attrs?.anchor,
      })}`;
    }
    default:
      return nodeText(node);
  }
}

function nodeText(node: JSONContent): string {
  if (node.text) {
    return node.text;
  }

  return (node.content ?? []).map((child) => nodeText(child)).join("");
}

function readDelimitedBody(lines: string[], startIndex: number) {
  const bodyLines: string[] = [];
  let index = startIndex + 1;

  while (index < lines.length && lines[index]?.trim() !== "::") {
    bodyLines.push(lines[index] ?? "");
    index += 1;
  }

  return {
    endIndex: index < lines.length ? index : startIndex,
    value: bodyLines.join("\n"),
  };
}

function readOptionalDelimitedBody(lines: string[], startIndex: number) {
  const nextIndex = startIndex + 1;
  const nextLine = lines[nextIndex];

  if (!nextLine?.trim()) {
    if (lines[nextIndex + 1]?.trim() === "::") {
      return { endIndex: nextIndex + 1, value: "" };
    }

    return { endIndex: startIndex, value: "" };
  }

  return readDelimitedBody(lines, startIndex);
}

function isDirectiveOrBlockStart(line: string) {
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

function readDirectiveValue(line: string, key: string) {
  const match = new RegExp(`${key}=(\"[^\"]*\"|[^\\s}]+)`).exec(line);

  if (!match) {
    return "";
  }

  return match[1].replace(/^"|"$/g, "");
}

function formatDirectiveAttrs(attrs: Record<string, unknown>) {
  const pairs = Object.entries(attrs)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(([key, value]) => `${key}=${formatDirectiveValue(String(value))}`);

  return pairs.length > 0 ? `{${pairs.join(" ")}}` : "";
}

function formatDirectiveValue(value: string) {
  return /[\s"]/u.test(value) ? `"${value.replaceAll('"', '\\"')}"` : value;
}

function cleanDataAttributes(attrs: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(attrs).filter(
      ([, value]) => value !== undefined && value.length > 0,
    ),
  );
}

function normalizePaperSource(value: string | null | undefined) {
  if (value === "arxiv" || value === "doi") {
    return value;
  }

  return "manual";
}
