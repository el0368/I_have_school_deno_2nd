// ============================================================================
// App-wide Constants
// ============================================================================

export const APP_NAME = "Sovereign Academy";
export const APP_URL = Deno.env.get("APP_URL") ?? "http://localhost:5173";
export const APP_VERSION = "0.1.0";

export const SESSION_COOKIE = "sa_session";
export const SESSION_DURATION_DAYS = 30;

export const MATH_ENGINE_URL =
  Deno.env.get("MATH_ENGINE_URL") ?? "http://localhost:8080";
