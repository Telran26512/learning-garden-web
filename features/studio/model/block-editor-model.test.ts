import { describe, expect, test } from "vitest";

import {
  createMathPreview,
  deriveMathStepAnchors,
  normalizeCodeLanguage,
} from "./block-editor-model";

describe("block editor model helpers", () => {
  test("renders valid LaTeX with KaTeX and returns structured preview state", () => {
    const preview = createMathPreview("A = softmax(QK^T / \\\\sqrt{d_k})V");

    expect(preview.ok).toBe(true);
    expect(preview.html).toContain("katex");
    expect(preview.error).toBe("");
  });

  test("normalizes markdown-escaped command slashes for KaTeX preview", () => {
    const preview = createMathPreview("\\\\sqrt{d_k}");

    expect(preview.ok).toBe(true);
    expect(preview.html).toContain("<msqrt>");
  });

  test("returns a readable error for invalid LaTeX", () => {
    const preview = createMathPreview("\\\\frac{1");

    expect(preview.ok).toBe(false);
    expect(preview.html).toBe("");
    expect(preview.error.length).toBeGreaterThan(0);
  });

  test("derives stable step anchors from LaTeX line breaks", () => {
    expect(
      deriveMathStepAnchors({
        anchor: "scale",
        latex: "qk / \\\\sqrt{d_k} \\\\\nsoftmax(score) \\\\\nscore @ v",
        step: "B",
      }),
    ).toEqual([
      { anchor: "scale-1", label: "B-01", latex: "qk / \\\\sqrt{d_k}" },
      { anchor: "scale-2", label: "B-02", latex: "softmax(score)" },
      { anchor: "scale-3", label: "B-03", latex: "score @ v" },
    ]);
  });

  test("normalizes CodeMirror language selection", () => {
    expect(normalizeCodeLanguage("py")).toBe("python");
    expect(normalizeCodeLanguage("typescript")).toBe("typescript");
    expect(normalizeCodeLanguage("tsx")).toBe("typescript");
    expect(normalizeCodeLanguage("")).toBe("text");
    expect(normalizeCodeLanguage("brainfuck")).toBe("text");
  });
});
