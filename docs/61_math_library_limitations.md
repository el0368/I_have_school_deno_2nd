To give you the definitive, unfiltered answer: **No. There is no single software
library in existence that can take a student from Kindergarten addition all the
way to PhD-level formal proofs.**

The reason for this is that "doing math" fundamentally changes its nature across
a human's education, requiring completely different computer science paradigms
at each stage.

Here is why a "Grand Unified Math Library" does not exist, and how you must
build your platform instead:

### The 3 Different Paradigms of Math Software

1. **The "Rule-Based" Phase (Kindergarten to Grade 8)**

- **The Math:** $3(x + 2) = 15$
- **The Logic:** This is purely computational. You apply strict rules
  (distributive property, inverse operations).
- **The Tool:** **Mathsteps** (TypeScript) or a custom Rust AST. It is extremely
  fast and runs entirely in the browser. It cannot do calculus because it
  doesn't understand continuous rates of change.

2. **The "Algorithmic" Phase (High School to College Junior)**

- **The Math:** $\int x \cos(x) dx$
- **The Logic:** This requires massive heuristic algorithms (like the Risch
  Algorithm) to manipulate symbols that don't have concrete numeric values.
- **The Tool:** **SymPy + SymPy Gamma** (Python via Rust/PyO3). It is
  mathematically brilliant but too heavy to run in a web browser, requiring a
  server. It fails at PhD math because it calculates answers rather than proving
  abstract theorems.

3. **The "Axiomatic" Phase (Senior College to PhD)**

- **The Math:** _Prove that every finite integral domain is a field._
- **The Logic:** This is pure formal logic. There are no numbers to calculate;
  there are only logical statements to verify against mathematical axioms.
- **The Tool:** **Lean 4** or **Coq**. These are Interactive Theorem Provers
  (ITPs). They are incredibly difficult to learn and completely useless for a
  3rd grader trying to learn fractions.

---

### The Sovereign Academy Solution: The "Relay Race" Architecture

Because no single library exists, your codebase must act as the orchestrator.
You don't need one library; you need a **Hybrid Architecture** (which aligns
perfectly with the `docs/56_math_engine_performance_and_hybrid_architecture.md`
and `docs/53_cloud_vs_client_boundary.md` files in your repository).

Your Deno backend must act as a **Smart Router** that reads the grade level of
the current curriculum file and hands the math problem to the correct engine:

- **If Grade <= 8:** Route to Client-Side WASM / Mathsteps.
- **If Grade 9 to College Year 3:** Route to Rust Axum Server $\rightarrow$ PyO3
  $\rightarrow$ SymPy Gamma.
- **If PhD / Formal Proof:** Route to a Lean 4 verification container or an LLM
  tutor.

**Would you like me to write the specific TypeScript routing logic for
`routes/api/math/check.ts` that automatically checks the grade level of the
`.mdx` file and decides which of these three math engines to use?**
