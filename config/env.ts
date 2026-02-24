// ============================================================================
// Typed Environment Variable Loader
// ============================================================================
// Call loadEnv() once at startup to validate all required env vars.

export interface Env {
  APP_URL: string;
  MATH_ENGINE_URL: string;
  SESSION_SECRET: string;
  DATABASE_URL?: string;
}

export function loadEnv(): Env {
  const required = ["SESSION_SECRET"] as const;

  for (const key of required) {
    if (!Deno.env.get(key)) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    APP_URL: Deno.env.get("APP_URL") ?? "http://localhost:5173",
    MATH_ENGINE_URL: Deno.env.get("MATH_ENGINE_URL") ?? "http://localhost:8080",
    SESSION_SECRET: Deno.env.get("SESSION_SECRET")!,
    DATABASE_URL: Deno.env.get("DATABASE_URL"),
  };
}
