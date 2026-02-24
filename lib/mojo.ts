// ============================================================================
// Mojo Math Engine Bridge
// ============================================================================
// Sends math requests to the Mojo/SymPy server running in WSL.
// The server is started via: pixi run mojo server.mojo

import { MATH_ENGINE_URL } from "../config/app.ts";
import type { MathRequest, MathResponse } from "../types/math.ts";

export async function solveMath(
  req: MathRequest,
): Promise<MathResponse> {
  const start = Date.now();

  // TODO: replace with real Mojo HTTP server once server.mojo is implemented.
  // For now, this calls the future endpoint.
  const res = await fetch(`${MATH_ENGINE_URL}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    return {
      result: "",
      operation: req.operation,
      durationMs: Date.now() - start,
      error: `Math engine returned ${res.status}`,
    };
  }

  const data = await res.json() as { result: string };
  return {
    result: data.result,
    operation: req.operation,
    durationMs: Date.now() - start,
  };
}
