In your specific Sovereign Academy architecture, **your primary Computer Algebra
System (CAS) lives on the Server.** Here is exactly how the computation boundary
is drawn in your stack:

### 1. The Server (The Heavy CAS)

Your main CAS is **SymPy** (running via Python, accessed through PyO3 inside
your Rust/Axum backend).

- **Why it lives on the server:** A full CAS like SymPy is a massive piece of
  software designed to handle algebraic manipulation, complex calculus,
  differential equations, and step-by-step mathematical proofs. It requires a
  full Python interpreter to run. Trying to download a full Python environment
  and SymPy into a student's browser every time they load the webpage would be
  incredibly slow and bloated.
- **What it does:** When a high school student asks for a step-by-step solution
  to a complex integral, your server handles the heavy CPU lifting, crunches the
  numbers via SymPy, and sends the lightweight LaTeX text back down to the
  client.

### 2. The Client (The "Bouncer" Engine)

While your heavy CAS is on the server, you still have a highly optimized
mathematical engine living on the **Client (in the browser via
WASM/JavaScript)**.

- **The Tool:** You are using lighter tools like **Mathsteps** (or custom Rust
  WASM logic).
- **What it does:** It acts as a gatekeeper. It is smart enough to handle basic
  arithmetic, fraction simplification, and standard K-8 algebra instantly inside
  the browser. It gives the student zero-latency feedback ("Correct! 🎉")
  without needing to bother the cloud server.

### The Summary of Your "Relay Architecture"

You have effectively built a hybrid model:

1. **The Client (WASM/JS):** Handles the "Fast Math" locally. It is not a full
   CAS, but a lightweight rule-evaluator.
2. **The Server (Rust/SymPy):** Houses the "Deep Math." It is the true, heavy
   CAS that executes the advanced computations and protects your proprietary
   algorithm logic from being stolen.

This exact division is the enterprise standard. Platforms like Wolfram Alpha and
Symbolab operate the same way—the browser provides the UI and basic parsing,
while a massive server cluster does the heavy algebraic lifting.
