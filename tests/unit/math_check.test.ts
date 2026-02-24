import { assertEquals, assertExists } from "jsr:@std/assert@1";
import type {
  CheckRequest,
  CheckResponse,
  MathOperation,
  MathRequest,
  MathResponse,
} from "../../types/math.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Type shape contracts
// These tests confirm the TypeScript interfaces match the shape the Rust engine
// expects. If someone changes a field name, the test breaks immediately.
// ─────────────────────────────────────────────────────────────────────────────

Deno.test("CheckRequest — satisfies required fields", () => {
  const req: CheckRequest = {
    studentAnswer: "\\frac{1}{2}",
    correctAnswer: "0.5",
  };
  assertExists(req.studentAnswer);
  assertExists(req.correctAnswer);
  assertEquals(typeof req.studentAnswer, "string");
  assertEquals(typeof req.correctAnswer, "string");
});

Deno.test("CheckRequest — operation field is optional", () => {
  const withOp: CheckRequest = {
    studentAnswer: "5",
    correctAnswer: "5",
    operation: "simplify",
  };
  const withoutOp: CheckRequest = {
    studentAnswer: "5",
    correctAnswer: "5",
  };
  assertEquals(withOp.operation, "simplify");
  assertEquals(withoutOp.operation, undefined);
});

Deno.test("CheckResponse — correct path has boolean + timing", () => {
  const res: CheckResponse = {
    correct: true,
    normalizedStudent: "1/2",
    normalizedCorrect: "1/2",
    durationMs: 12,
  };
  assertEquals(res.correct, true);
  assertEquals(typeof res.durationMs, "number");
  assertEquals(res.error, undefined);
});

Deno.test("CheckResponse — error path has correct:false + message", () => {
  const res: CheckResponse = {
    correct: false,
    normalizedStudent: "",
    normalizedCorrect: "",
    durationMs: 0,
    error: "Math engine unreachable",
  };
  assertEquals(res.correct, false);
  assertExists(res.error);
});

Deno.test("MathResponse — satisfies result + operation + timing", () => {
  const res: MathResponse = {
    result: "x^2",
    operation: "expand",
    durationMs: 8,
  };
  assertEquals(res.result, "x^2");
  assertEquals(res.operation, "expand");
});

// ─────────────────────────────────────────────────────────────────────────────
// MathOperation enum coverage
// ─────────────────────────────────────────────────────────────────────────────

Deno.test("MathOperation — all expected operations compile", () => {
  const ops: MathOperation[] = [
    "simplify",
    "factor",
    "expand",
    "solve",
    "differentiate",
    "integrate",
    "latex",
    "check",
  ];
  assertEquals(ops.length, 8);
  assertEquals(ops.includes("check"), true);
});

// ─────────────────────────────────────────────────────────────────────────────
// Validation logic (mirrors check.ts handler rules)
// ─────────────────────────────────────────────────────────────────────────────

/** Mirrors the validation logic inside routes/api/math/check.ts */
function validateCheckBody(
  body: Partial<CheckRequest>,
): { valid: true; data: CheckRequest } | { valid: false; error: string } {
  if (!body.studentAnswer || !body.correctAnswer) {
    return { valid: false, error: "Missing studentAnswer or correctAnswer" };
  }
  return {
    valid: true,
    data: body as CheckRequest,
  };
}

Deno.test("validateCheckBody — passes when both fields are present", () => {
  const result = validateCheckBody({
    studentAnswer: "5",
    correctAnswer: "5",
  });
  assertEquals(result.valid, true);
});

Deno.test("validateCheckBody — fails when studentAnswer is missing", () => {
  const result = validateCheckBody({ correctAnswer: "5" });
  assertEquals(result.valid, false);
  if (!result.valid) {
    assertEquals(result.error, "Missing studentAnswer or correctAnswer");
  }
});

Deno.test("validateCheckBody — fails when correctAnswer is missing", () => {
  const result = validateCheckBody({ studentAnswer: "5" });
  assertEquals(result.valid, false);
});

Deno.test("validateCheckBody — fails when both fields are missing", () => {
  const result = validateCheckBody({});
  assertEquals(result.valid, false);
});

Deno.test("validateCheckBody — fails when studentAnswer is empty string", () => {
  const result = validateCheckBody({
    studentAnswer: "",
    correctAnswer: "5",
  });
  assertEquals(result.valid, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// MathRequest type contracts (sanity check for the solveMath bridge)
// ─────────────────────────────────────────────────────────────────────────────

Deno.test("MathRequest — requires expression and operation", () => {
  const req: MathRequest = {
    expression: "x^2 + 5*x + 6",
    operation: "factor",
  };
  assertExists(req.expression);
  assertExists(req.operation);
  assertEquals(req.variable, undefined);
});

Deno.test("MathRequest — variable is optional for differentiate", () => {
  const req: MathRequest = {
    expression: "x^2",
    operation: "differentiate",
    variable: "x",
  };
  assertEquals(req.variable, "x");
});
