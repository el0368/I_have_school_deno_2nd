# Architectural Boundary: Cloud vs. Client

This document defines the "Source of Truth" for where application logic and data
should reside. Adhering to these boundaries ensures security, performance, and
"Professional/PhD-level" math capabilities.

---

## 1. The "Heavy" Cloud (Mojo + Deno Server)

The Cloud is responsible for operations that are too computationally expensive,
too sensitive, or too complex for the browser.

### A. Math Engine (CAS)

- **What**: Symbolic algebra, calculus, differential equations, and formal
  proofs.
- **Tools**: Mojo, Python/SymPy.
- **Why**: These require a 500MB+ environment and high CPU power. Shipping this
  to the browser would be slow and brittle.

### B. Financials & Subscriptions

- **What**: Payment processing (Stripe/PayPal), plan verification, and invoices.
- **Tools**: Stripe API, `lib/session.ts`, `services/subscription/`.
- **Why**: Security. All money-related secrets must stay on the server.
  Client-side payment logic is easily bypassed by malicious users.

### C. Identity & Persistence

- **What**: Password hashing, session storage, and global student backups.
- **Tools**: `lib/hash.ts` (PBKDF2), Deno KV (`lib/db.ts`).
- **Why**: Single source of truth for "Who is this student?" and ensuring their
  data survives if they lose their laptop.

---

## 2. The "Fluid" Client (Browser + PGlite)

The Client is responsible for the user's immediate interactive experience. It
must feel "instant" even when offline.

### A. Visual Rendering

- **What**: Math equations (KaTeX), interactive graphs (Mafs.js), and lessons
  (MDX).
- **Why**: High-frame-rate interactions (like dragging a point on a parabola)
  require zero network latency.

### B. Input & Feedback

- **What**: Math input (MathLive) and basic arithmetic validation (1+1=2).
- **Tools**: Preact Islands (`islands/`), WASM (`wasm/src/lib.rs`).
- **Why**: Students need immediate feedback without waiting for a server
  round-trip.

### C. Offline Progress

- **What**: Storing the "Last 10 lessons completed" and current quiz answers.
- **Tools**: PGlite (Browser WASM SQL).
- **Why**: If the Wi-Fi drops, the student shouldn't lose their work. PGlite
  syncs with the Cloud once the connection returns.

---

## 3. The Boundary Matrix

| Feature            | Logic Location      | Data Location   | Network Requirement |
| :----------------- | :------------------ | :-------------- | :------------------ |
| **PhD Algebra**    | Cloud (Mojo)        | Server          | Must be Online      |
| **Arithmetic**     | Client (TS/WASM)    | Browser         | Works Offline       |
| **Payments**       | Cloud (Deno/Stripe) | Server          | Must be Online      |
| **Lesson Text**    | Client (MDX)        | Browser (Cache) | Works Offline       |
| **Password Check** | Cloud (Deno)        | Server          | Must be Online      |
| **Local Scores**   | Client (PGlite)     | Browser         | Works Offline       |

---

## 4. Developer Rule of Thumb

1. **Is it about money?** Put it in `routes/api/` or `services/` (Server).
2. **Is it about higher math (Calc/Algebra)?** Put it in `math_engine/`
   (Server).
3. **Is it about the UI moving?** Put it in `islands/` (Client).
4. **Is it about "Saving" something?** Start in `utils/db.ts` (Client) and sync
   to `lib/db.ts` (Server).
