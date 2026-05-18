export type PythonRuntimeStatus = "unavailable" | "loading" | "ready" | "error";

export type PythonExecutionResult = {
  stdout: string;
  stderr: string;
};

export type PythonRuntime = {
  readonly status: PythonRuntimeStatus;
  run(source: string): Promise<PythonExecutionResult>;
};

export function createUnavailablePythonRuntime(): PythonRuntime {
  return {
    status: "unavailable",
    async run() {
      throw new Error("Pyodide runtime is not loaded");
    },
  };
}
