# ================================================================================ MODULE 4: MIDDLEWARE & THE REQUEST PIPELINE

Estimated Time: 35 minutes Prerequisites: Module 3 of Beginner (routing), Module
3 of this level (API routes) Learning Objectives:

- Understand what middleware IS and WHY it exists
- Trace the exact path a request takes through the app
- Use ctx.state to pass data from middleware to handlers/pages
- Write a request logger middleware
- Write a simple auth-guard middleware
- Use _middleware.ts files for scoped middleware
- # Understand execution order: global vs scoped

Every web framework has middleware. In Fresh 2.x, middleware is how you run code
on EVERY request (or every request to a specific folder) without copy-pasting
the same logic into every handler.

---

## LESSON 1: WHAT IS MIDDLEWARE?

Middleware sits BETWEEN the incoming request and the final handler. It can:

- Log the request
- Check authentication and reject unauthorized requests
- Add data to ctx.state that every handler can read
- Modify request headers
- Return early (short-circuit) without calling ctx.next()

THE PIPELINE — ASCII DIAGRAM:

Browser │ ▼ [Global Middleware 1] ← app.use() in main.ts (runs for ALL routes) │
▼ [Global Middleware 2] ← another app.use() │ ▼ [Scoped Middleware] ←
_middleware.ts in routes/api/ (only /api/* routes) │ ▼ [Route Handler] ←
GET(ctx) or page component │ ▼ Response sent to browser

The KEY: each middleware calls `ctx.next()` to pass control to the next
middleware/handler in the chain. If it does NOT call `ctx.next()`, the chain
STOPS — the request never reaches the handler. This is how auth guards work.

---

## LESSON 2: ctx.next() — THE CHAIN MECHANISM

Every middleware receives `ctx` and must RETURN a Response. The two options:

PASS THROUGH: return ctx.next(); // "Do nothing special, let the next one handle
it" return await ctx.next(); // await it if you need to inspect the response
after

SHORT-CIRCUIT: return new Response("Forbidden", { status: 403 }); // Handler
never runs — middleware responded directly

WRAPPING PATTERN (run code BEFORE and AFTER the handler): app.use(async (ctx) =>
{ console.log("BEFORE:", ctx.req.url); // Runs before handler const response =
await ctx.next(); // Let the handler run console.log("AFTER:", response.status);
// Runs after handler return response; // Must return the response });

If you forget `return await ctx.next();` and just call `ctx.next()` without
await, the "after" code runs BEFORE the handler finishes. Always `await`.

---

## LESSON 3: ctx.state — SHARING DATA THROUGH THE PIPELINE

`ctx.state` is the SHARED CONTAINER that flows through the entire pipeline.
Middleware sets values on it; handlers and pages read them.

In utils.ts you define the State interface: interface State { shared: string; }
export const define = createDefine<State>();

The existing middleware in main.ts writes to it: app.use(async (ctx) => {
ctx.state.shared = "hello"; // Write return await ctx.next(); });

routes/index.tsx reads it: export default define.page(function Home(ctx) {
console.log("Shared value " + ctx.state.shared); // Read → "hello" ... });

ADDING YOUR OWN FIELDS: Step 1 — Extend the State interface in utils.ts: export
interface State { shared: string; userId?: string; // undefined until auth
middleware runs }

Step 2 — Set it in auth middleware: app.use(async (ctx) => { const token =
ctx.req.headers.get("Authorization")?.replace("Bearer ", ""); if (token) {
ctx.state.userId = getUserIdFromToken(token); } return await ctx.next(); });

Step 3 — Read it in a handler: GET(ctx) { if (!ctx.state.userId) { return new
Response("Unauthorized", { status: 401 }); } return
Response.json(getNotesForUser(ctx.state.userId)); }

Because `userId` is typed as `string | undefined` (note the `?`), TypeScript
forces you to check for undefined before using it. No accidental null bugs.

---

## LESSON 4: THE EXISTING MIDDLEWARE IN main.ts

Let's read the existing middleware from this project:

// Middleware 1: Static files (CSS, images, etc.) app.use(staticFiles());

This serves files from the static/ folder. If a request matches a file, it
returns the file immediately without calling ctx.next().

// Middleware 2: Inject shared state app.use(async (ctx) => { ctx.state.shared =
"hello"; return await ctx.next(); });

Sets a dummy shared value on every request. In a real app, this would be where
you decode a session cookie and set ctx.state.userid, ctx.state.role, etc.

// Middleware 3: Example logger const exampleLoggerMiddleware =
define.middleware((ctx) => { console.log(`${ctx.req.method} ${ctx.req.url}`);
return ctx.next(); // Note: no async needed since we don't wrap });
app.use(exampleLoggerMiddleware);

This logs every request to the terminal. It uses `define.middleware()` which
adds the same TypeScript typing as `define.handlers()` and `define.page()`.

// app.get("/api2/:name", ...) — a manually registered route (no file needed)

Fresh supports both file-based routing AND programmatic routes. They coexist.

---

## LESSON 5: WRITING A REQUEST LOGGER MIDDLEWARE

Here is a more complete logger than the example:

import { define } from "./utils.ts";

export const requestLogger = define.middleware(async (ctx) => { const start =
Date.now(); const method = ctx.req.method; const url = new URL(ctx.req.url);

    const response = await ctx.next();

    const elapsed = Date.now() - start;
    const status  = response.status;

    console.log(`[${new Date().toISOString()}] ${method} ${url.pathname} → ${status} (${elapsed}ms)`);
    return response;

});

// In main.ts: app.use(requestLogger);

Sample output: [2026-02-21T10:30:45.123Z] GET /api/notes → 200 (12ms)
[2026-02-21T10:30:46.456Z] POST /api/notes → 201 (8ms)

This wraps `ctx.next()` — it runs code AFTER the handler returns, so we know the
actual status code.

---

## LESSON 6: WRITING AN AUTH-GUARD MIDDLEWARE

This middleware protects all API routes. Any request to /api/* without a valid
API key gets a 401 response.

// In main.ts (global) — but we'll use a scoped _middleware.ts in Lesson 7:
const API_KEY = Deno.env.get("API_KEY") ?? "dev-secret";

const apiAuthMiddleware = define.middleware(async (ctx) => { const url = new
URL(ctx.req.url);

    // Only protect /api/ routes
    if (!url.pathname.startsWith("/api/")) {
      return ctx.next();
    }

    const key = ctx.req.headers.get("X-API-Key");
    if (key !== API_KEY) {
      return Response.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      );
    }

    return ctx.next();

});

TEST IT: curl http://localhost:5174/api/notes

# → 401 {"error":"Invalid or missing API key"}

curl -H "X-API-Key: dev-secret" http://localhost:5174/api/notes

# → 200 [...]

`Deno.env.get("API_KEY")` reads environment variables. The `?? "dev-secret"`
provides a fallback for local development. In production, set a real key. (Deno
requires --allow-env permission or the env.* grant in deno.json to read env
vars.)

---

## LESSON 7: _middleware.ts FILES — SCOPED MIDDLEWARE

Instead of checking `url.pathname.startsWith("/api/")` in a global middleware,
Fresh supports a SCOPED middleware file that ONLY runs for that folder.

Create: routes/api/_middleware.ts import { define } from "../../utils.ts";

const API_KEY = Deno.env.get("API_KEY") ?? "dev-secret";

export const handler = define.middleware(async (ctx) => { const key =
ctx.req.headers.get("X-API-Key"); if (key !== API_KEY) { return Response.json({
error: "Unauthorized" }, { status: 401 }); } return ctx.next(); });

EXECUTION ORDER with scoped middleware:

Request → /api/notes 1. Global middleware (app.use() in main.ts) — runs first 2.
routes/api/_middleware.ts — only for /api/* routes 3. routes/api/notes.tsx GET
handler — the actual handler

Request → /notes (page route) 1. Global middleware (app.use() in main.ts) — runs
first 2. routes/notes.tsx page component — directly

FOLDER SCOPING RULES: _middleware.ts in routes/ → runs for ALL routes
_middleware.ts in routes/api/ → runs only for /api/* routes _middleware.ts in
routes/api/v2/ → runs only for /api/v2/* routes

This is much cleaner than giant if-chains in a single global middleware.

---

## QUICK REFERENCE

REGISTRATION SCOPE

---

app.use(fn) Global — every request routes/_middleware.ts All routes in routes/
folder routes/api/_middleware Routes under /api/

IN THE FUNCTION: return ctx.next() → pass to next handler return await
ctx.next() → pass + inspect response afterward return new Response(...) →
short-circuit, respond directly

ctx PROPERTIES: ctx.req → Request object ctx.req.url → full URL string
ctx.req.method → "GET", "POST", etc. ctx.req.headers → Headers object ctx.state
→ shared State (typed from utils.ts) ctx.params → URL params (in route handlers)

STATE TYPING: 1. Add field to State interface in utils.ts 2. Set it in
middleware: ctx.state.yourField = value 3. Read it anywhere: ctx.state.yourField
(TypeScript knows the type)

---

## MINI QUIZ

1. What happens if middleware returns `new Response("Blocked", { status: 403 })`
   WITHOUT calling ctx.next()? A) The next middleware runs after B) The handler
   runs and its response overwrites "Blocked" C) The chain stops — the handler
   never runs D) An error is thrown

2. You want middleware that only runs for routes under /admin/. Where do you
   create the _middleware.ts file? A) routes/_middleware.ts B)
   routes/admin/_middleware.ts C) middleware/admin.ts D) main.ts with a
   startsWith check

3. You want to measure response time. Where do you put the "end time" code? A)
   Before ctx.next() B) Inside the route handler C) After `await ctx.next()`
   (wrapping pattern) D) In a separate file

4. What TypeScript feature makes ctx.state type-safe (no runtime type errors)?
   A) The any type B) The State interface passed as a generic to
   createDefine<State>() C) The Readonly utility type D) The define.middleware()
   wrapper only

Answers: 1-C, 2-B, 3-C, 4-B

================================================================================
