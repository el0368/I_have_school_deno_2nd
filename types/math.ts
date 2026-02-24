// ============================================================================
// Math Engine Types (Client <-> Mojo Server)
// ============================================================================

export type MathOperation =
  | "simplify"
  | "factor"
  | "expand"
  | "solve"
  | "differentiate"
  | "integrate"
  | "latex";

export interface MathRequest {
  expression: string;
  operation: MathOperation;
  variable?: string; // e.g. "x" for integrate/differentiate
}

export interface MathResponse {
  result: string;      // LaTeX string
  operation: MathOperation;
  durationMs: number;
  error?: string;
}
