// ============================================================================
// POST /api/math/check — Answer Checking Endpoint
// ============================================================================
// Receives { studentAnswer, correctAnswer } from the MathInput island,
// forwards both to the Rust math engine for symbolic comparison via SymPy,
// and returns { correct: boolean }.
//
// WHY a Deno proxy instead of calling Rust directly from the browser?
//   1. The Rust engine runs on a different port (8080). CORS is simpler
//      when the browser only talks to its own origin.
//   2. We can add rate-limiting, logging, and auth checks in this route
//      later — without touching the Rust server.
// ============================================================================

import { define } from "../../../utils.ts";
import { MATH_ENGINE_URL } from "../../../config/app.ts";
import type { CheckRequest, CheckResponse } from "../../../types/math.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const start = Date.now();

    // ─── 1. Parse the request body ────────────────────────────────────
    let body: CheckRequest;
    try {
      body = await ctx.req.json() as CheckRequest;
    } catch {
      return Response.json(
        { correct: false, error: "Invalid JSON body" } as Partial<
          CheckResponse
        >,
        { status: 400 },
      );
    }

    if (!body.studentAnswer || !body.correctAnswer) {
      return Response.json(
        {
          correct: false,
          error: "Missing studentAnswer or correctAnswer",
        } as Partial<CheckResponse>,
        { status: 400 },
      );
    }

    // ─── 2. Forward to the Rust math engine ───────────────────────────
    try {
      const engineRes = await fetch(`${MATH_ENGINE_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_answer: body.studentAnswer,
          correct_answer: body.correctAnswer,
          operation: body.operation ?? "simplify",
        }),
      });

      if (!engineRes.ok) {
        // Rust engine is running but returned an error
        const text = await engineRes.text();
        return Response.json(
          {
            correct: false,
            normalizedStudent: "",
            normalizedCorrect: "",
            durationMs: Date.now() - start,
            error: `Math engine error (${engineRes.status}): ${text}`,
          } satisfies CheckResponse,
          { status: 502 },
        );
      }

      const data = await engineRes.json() as {
        correct: boolean;
        normalized_student: string;
        normalized_correct: string;
      };

      return Response.json(
        {
          correct: data.correct,
          normalizedStudent: data.normalized_student,
          normalizedCorrect: data.normalized_correct,
          durationMs: Date.now() - start,
        } satisfies CheckResponse,
      );
    } catch (err) {
      // Rust engine is unreachable (not started, wrong port, etc.)
      return Response.json(
        {
          correct: false,
          normalizedStudent: "",
          normalizedCorrect: "",
          durationMs: Date.now() - start,
          error:
            `Math engine unreachable at ${MATH_ENGINE_URL}. Is it running? (${err})`,
        } satisfies CheckResponse,
        { status: 503 },
      );
    }
  },
});
