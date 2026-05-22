import katex from "katex";

import type { MathBlockAttrs } from "./tiptap-block-schema";

export type MathPreviewState = {
  error: string;
  html: string;
  ok: boolean;
};

export type MathStepAnchor = {
  anchor: string;
  label: string;
  latex: string;
};

export type SupportedCodeLanguage =
  | "javascript"
  | "markdown"
  | "python"
  | "text"
  | "typescript";

const languageAliases: Record<string, SupportedCodeLanguage> = {
  js: "javascript",
  javascript: "javascript",
  markdown: "markdown",
  md: "markdown",
  py: "python",
  python: "python",
  text: "text",
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
};

export const supportedCodeLanguages: SupportedCodeLanguage[] = [
  "python",
  "typescript",
  "javascript",
  "markdown",
  "text",
];

export function createMathPreview(latex: string): MathPreviewState {
  const source = normalizeLatexForPreview(latex).trim();

  if (!source) {
    return { error: "", html: "", ok: true };
  }

  try {
    return {
      error: "",
      html: katex.renderToString(source, {
        displayMode: true,
        strict: "ignore",
        throwOnError: true,
        trust: false,
      }),
      ok: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Invalid LaTeX",
      html: "",
      ok: false,
    };
  }
}

function normalizeLatexForPreview(latex: string) {
  return latex.replace(/\\\\(?=[A-Za-z])/gu, "\\");
}

export function deriveMathStepAnchors({
  anchor,
  latex,
  step,
}: MathBlockAttrs): MathStepAnchor[] {
  const anchorPrefix = anchor.trim() || "math";
  const labelPrefix = normalizeStepPrefix(step);

  return latex
    .split(/\\\\(?=\s*(?:\n|$))/u)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => ({
      anchor: `${anchorPrefix}-${index + 1}`,
      label: `${labelPrefix}-${String(index + 1).padStart(2, "0")}`,
      latex: part,
    }));
}

export function normalizeCodeLanguage(language: string): SupportedCodeLanguage {
  return languageAliases[language.trim().toLowerCase()] ?? "text";
}

export function labelForCodeLanguage(language: string) {
  const normalized = normalizeCodeLanguage(language);

  if (normalized === "typescript") return "TypeScript";
  if (normalized === "javascript") return "JavaScript";
  if (normalized === "markdown") return "Markdown";
  if (normalized === "python") return "Python";

  return "Text";
}

function normalizeStepPrefix(step: string) {
  const trimmed = step.trim();

  if (!trimmed) {
    return "S";
  }

  return trimmed.replace(/-\d+$/u, "");
}
