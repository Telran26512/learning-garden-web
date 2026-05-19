import type { PythonRunRequest, PythonRunResponse } from "@/lib/api/contracts";
import { getApiTransport } from "@/lib/api/transport";

export const runtimeApi = {
  runPython(input: PythonRunRequest) {
    return getApiTransport().request<PythonRunResponse>("POST", "/runtime/python-runs", input);
  },
};
