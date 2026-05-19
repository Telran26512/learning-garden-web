export type PythonRuntimeStatus = {
  canExecute: false;
  kind: "placeholder";
  label: string;
};

export type PythonRunResult = {
  durationMs: number;
  stderr: string;
  stdout: string;
  status: "skipped";
};

export function getPythonRuntimeStatus(): PythonRuntimeStatus {
  return {
    canExecute: false,
    kind: "placeholder",
    label: "Pyodide runtime not loaded",
  };
}

export async function runPythonSnippet(code: string): Promise<PythonRunResult> {
  const startedAt = Date.now();

  if (code.trim().length === 0) {
    throw new Error("Python snippet cannot be empty.");
  }

  return {
    durationMs: Math.max(0, Date.now() - startedAt),
    stderr: "Pyodide runtime is not bundled in the M0/M1 frontend foundation. No code was executed.",
    stdout: "",
    status: "skipped",
  };
}
