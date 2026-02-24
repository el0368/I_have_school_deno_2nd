// ============================================================================
// Math Engine Types (Deno <-> Rust/Axum Server)
// ============================================================================

export type MathOperation =
  | "simplify"
  | "factor"
  | "expand"
  | "solve"
  | "differentiate"
  | "integrate"
  | "latex"
  | "check";

export interface MathRequest {
  expression: string;
  operation: MathOperation;
  variable?: string; // e.g. "x" for integrate/differentiate
}

export interface MathResponse {
  result: string; // LaTeX string
  operation: MathOperation;
  durationMs: number;
  error?: string;
}

// ─── Answer Checking ──────────────────────────────────────────────────────────

/** Sent from MathInput island → /api/math/check */
export interface CheckRequest {
  /** The student's LaTeX answer */
  studentAnswer: string;
  /** The correct LaTeX answer (embedded in the MDX as a prop) */
  correctAnswer: string;
  /** Optional: the operation to use for normalization (default: "simplify") */
  operation?: MathOperation;
}

/** Returned from /api/math/check → MathInput island */
export interface CheckResponse {
  correct: boolean;
  /** Normalized form of the student's answer (for debugging / "show steps") */
  normalizedStudent: string;
  /** Normalized form of the correct answer */
  normalizedCorrect: string;
  durationMs: number;
  error?: string;
}
