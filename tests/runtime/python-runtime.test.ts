import { describe, expect, it } from "vitest";
import { createUnavailablePythonRuntime } from "@/runtime/python-runtime";

describe("createUnavailablePythonRuntime", () => {
  it("fails clearly until Pyodide is explicitly wired", async () => {
    const runtime = createUnavailablePythonRuntime();

    expect(runtime.status).toBe("unavailable");
    await expect(runtime.run("print(1)")).rejects.toThrow(
      "Pyodide runtime is not loaded",
    );
  });
});
