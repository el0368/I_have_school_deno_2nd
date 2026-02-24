// ============================================================================
// Standardized API Response Helpers
// ============================================================================
// Usage:
//   import { ok, fail, notFound } from "../lib/response.ts";
//   return ok({ user });
//   return fail("Invalid email", 400);
//   return notFound();

/**
 * Success response  →  { "ok": true, "data": { ... } }
 */
export function ok(data: unknown = null, status = 200): Response {
  return Response.json({ ok: true, data }, { status });
}

/**
 * Error response  →  { "ok": false, "error": "message" }
 */
export function fail(error: string, status = 400): Response {
  return Response.json({ ok: false, error }, { status });
}

/**
 * 404 shortcut
 */
export function notFound(msg = "Not found"): Response {
  return fail(msg, 404);
}

/**
 * 401 shortcut
 */
export function unauthorized(msg = "Unauthorized"): Response {
  return fail(msg, 401);
}

/**
 * 403 shortcut
 */
export function forbidden(msg = "Forbidden"): Response {
  return fail(msg, 403);
}

/**
 * 500 Internal Server Error
 */
export function serverError(msg = "Internal server error"): Response {
  return fail(msg, 500);
}
