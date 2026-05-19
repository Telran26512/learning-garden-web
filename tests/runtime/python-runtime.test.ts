import { describe, expect, it } from "vitest";
import { getPythonRuntimeStatus, runPythonSnippet } from "@/runtime/python-runtime";

describe("python runtime placeholder", () => {
  it("reports that browser Python execution is intentionally unavailable", () => {
    expect(getPythonRuntimeStatus()).toEqual({
      canExecute: false,
      kind: "placeholder",
      label: "Pyodide runtime not loaded",
    });
  });

  it("returns a skipped result instead of pretending to execute Python", async () => {
    const result = await runPythonSnippet("print('hello')");

    expect(result.status).toBe("skipped");
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Pyodide");
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("rejects empty snippets before runtime execution", async () => {
    await expect(runPythonSnippet("  ")).rejects.toThrow(/Python snippet/);
  });
});
