# Zero JSON: Reality & Implementation Options

This document explores the possibility of moving Sovereign Academy toward a
"Zero JSON" runtime architecture by replacing standard JSON data formats with
high-performance binary alternatives like MessagePack or Protobuf.

---

## 1. What Cannot Be Removed (Tooling Config)

Certain files in your project are mandated by the tools themselves and **must**
remain in JSON format. These are "at rest" configuration files and do not affect
runtime performance.

- `deno.json`: Deno's project configuration and task runner.
- `package.json`: Node/npm dependency tracking.
- `.vscode/settings.json`: Editor-specific environment settings.
- `lib/types/*.ts`: TypeScript itself (not JSON, but generates type maps).

---

## 2. What CAN Be Removed (Runtime Data)

The "Runtime Pipeline" is where 100% Zero JSON is achievable. This is where the
actual math problems and student data travel through your system.

### A. Deno ↔ Mojo IPC (The Math Bridge)

- **Current**: JSON over local pipes/HTTP.
- **Goal**: MessagePack binary encoding.
- **Benefit**: No string escaping, smaller payloads, faster serialization on
  both Deno (V8) and Mojo (LLVM).

### B. API Responses (`routes/api/*`)

- **Current**: `Response.json({ ok: true, data: ... })`.
- **Goal**: Binary `Uint8Array` as response body with
  `Content-Type: application/msgpack`.
- **Benefit**: Faster parsing on the client-side (MathLive/Mafs islands).

### C. Server-Side Persistence (Deno KV)

- **Current**: Deno KV automatically serializes objects (often to a hidden
  JSON-like format).
- **Goal**: Manually serialize to binary `Uint8Array` before storing in KV.
- **Benefit**: Predictable storage size and faster retrieval.

---

## 3. The "Local-First" Trade-off

Browsers natively speak JSON. If we remove JSON from the runtime:

1. **Client-Side Decoding**: We must include a small MessagePack decoder in our
   frontend Islands (e.g., `npm:@msgpack/msgpack` which is ~3KB).
2. **Debugging**: You can no longer look at "Network Traces" in the Chrome
   DevTools and read the math equations as plain text. You will see binary data
   instead.

---

## 4. Implementation Plan (Phase 2 Upgrade)

If you decide to go "Zero JSON," the migration would look like this:

1. **Add Dependencies**:
   - Deno: `npm:msgpackr` (arguably the fastest MessagePack library for JS).
   - Mojo: `pip install msgpack` (added via `pixi.toml`).

2. **Update Response Helpers**:
   - Rewrite `lib/response.ts` to use
     `new Response(msgpack.encode(data), { headers: { "Content-Type": "application/msgpack" } })`.

3. **Update the Bridge**:
   - Refactor `lib/mojo.ts` and `server.mojo` to read/write raw bytes instead of
     strings.

---

## Summary Verdict

- **Static Config**: Always JSON.
- **Dynamic Runtime**: **100% Zero JSON is possible and recommended for
  high-performance math apps.**

You don't need to do this today, but your architecture is already "scaffolded"
to make this transition very easy when you hit your first 1,000 students.
