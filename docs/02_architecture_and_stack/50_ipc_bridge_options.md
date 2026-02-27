# IPC Bridge: Deno ↔ Mojo Communication Options

This document describes how the Deno Fresh backend communicates with the
Mojo/SymPy math engine, and the available serialization formats.

---

## The Core Problem

Deno (TypeScript/V8) and Mojo (Python/C++) cannot share memory directly. Every
math request must be **serialized** (converted to bytes), **sent** across a
boundary, and **deserialized** on the other side.

The two decisions to make are:

1. **Transport**: How the bytes travel (HTTP, subprocess pipe, Unix socket)
2. **Serialization**: How data is encoded into bytes (JSON, MessagePack,
   Protobuf)

---

## Transport Options (Ranked by Simplicity → Performance)

### ✅ Option A: stdin/stdout Subprocess (Recommended for Phase 1)

Deno spawns Mojo as a child process and communicates via OS pipes.

```
Deno → stdin (bytes) → Mojo process
Deno ← stdout (bytes) ← Mojo process
```

- No ports, no TCP, no separate server to keep alive
- Mojo runs as a long-lived process reading one request per line (NDJSON loop)
- Works identically in WSL and on a Linux VPS
- **Deno API**: `Deno.Command` with `stdin: "piped"` / `stdout: "piped"`

### Option B: Unix Domain Socket (Phase 2)

Uses a local file socket (`/tmp/mojo_engine.sock`) instead of a TCP port. Skips
the entire OS network stack — faster than HTTP on the same machine.

- Requires Mojo running as a persistent socket server
- Better for high-frequency requests (100+/second)

### Option C: Local HTTP (Simplest to Debug)

Deno sends `fetch("http://localhost:8001/solve", ...)`. Already scaffolded in
`lib/mojo.ts`.

- ~1ms latency on the same machine (imperceptible to humans)
- Easiest to test with `curl`
- Fine for a math platform where requests happen on button clicks

---

## Serialization Options

### JSON (Current Default)

```json
{ "operation": "integrate", "expression": "x^2", "variable": "x" }
```

- Human-readable, easy to debug
- Slowest of the three options
- Fine for low-to-medium traffic

### MessagePack (Binary JSON)

MessagePack encodes the same key-value structure as JSON but as compact binary.
It is typically **2–4× smaller** and **2–5× faster** to encode/decode.

```
{ "op": "integrate", "expr": "x^2", "var": "x" }
→ binary: [83 A2 6F 70 A9 ...]   (no quotes, no braces in bytes)
```

**Support:**

- **Deno / TypeScript**: `npm:msgpackr` or `npm:@msgpack/msgpack`
- **Mojo / Python**: `pip install msgpack` (available via Pixi)

**Best for**: Phase 2, when you want to reduce overhead without changing your
data model. Drop-in replacement for JSON.

### Protocol Buffers (Protobuf)

Google's binary serialization format. Requires a `.proto` schema file that
defines the exact structure of every message upfront.

```proto
// math.proto
message MathRequest {
  string operation = 1;
  string expression = 2;
  string variable   = 3;
}
message MathResponse {
  string result   = 1;
  string error    = 2;
  int32  duration = 3;
}
```

- **Fastest** serialization of the three
- **Smallest** binary payload
- **Strict schema**: Both Deno and Mojo must agree on the `.proto` file
- **Support**:
  - TypeScript: `npm:protobufjs` or `jsr:@bufbuild/protobuf`
  - Mojo/Python: `pip install protobuf`

**Best for**: Phase 3, when you have finalized your API contract and need
maximum throughput (millions of requests/day).

---

## Comparison Table

| Format      | Size  | Speed   | Debuggable | Schema Required | Best Phase |
| ----------- | ----- | ------- | ---------- | --------------- | ---------- |
| JSON        | Large | Slow    | ✅ Yes     | ❌ No           | Phase 1    |
| MessagePack | Small | Fast    | ⚠️ Binary  | ❌ No           | Phase 2    |
| Protobuf    | Tiny  | Fastest | ❌ Binary  | ✅ Yes          | Phase 3    |

---

## Recommended Roadmap

| Phase | Transport          | Serialization | When to Switch          |
| ----- | ------------------ | ------------- | ----------------------- |
| 1     | stdin/stdout pipe  | JSON          | Now (building features) |
| 2     | Unix Domain Socket | MessagePack   | First 1,000 users       |
| 3     | Unix Domain Socket | Protobuf      | First 10,000 users      |

---

## References

- `lib/mojo.ts` — Deno side of the bridge
- `math_engine/test_sympy.mojo` — Current Mojo smoke test
- `math_engine/server.mojo` — (Future) Mojo process loop
- `types/math.ts` — `MathRequest` / `MathResponse` TypeScript types
