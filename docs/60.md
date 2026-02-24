Yes. If you are truly committing to the **"5 years old to PhD"** curriculum
roadmap visible in your files, a Computer Algebra System (CAS) is
non-negotiable.

Here is the empirical reality of your specific project and exactly where the CAS
becomes mandatory.

### Where You Do NOT Need a CAS (Grades K-8)

Look at your `curriculums/math/by_grade/` folder, specifically `grade_1` through
`grade_8`.

These curriculums focus on arithmetic, fractions, decimals, and introductory
algebra (like $2x = 10$). Standard programming languages evaluate these
perfectly using native floating-point math or simple Abstract Syntax Trees.

- Sending a problem from your `grade_4.mdx` file to a server to be processed by
  SymPy is an architectural mistake. It adds network latency and wastes server
  CPU on deterministic arithmetic that the user's browser could solve in one
  millisecond.

### Where You ABSOLUTELY Need a CAS (Grade 10 to PhD)

Look at your `subjects/math/by grade/` lists for `ap_calculus_ab_exercises.txt`,
`differential_equations_exercises.txt`, and `linear_algebra_exercises.txt`.

This is where standard programming languages completely fail.

- If a student inputs `\int x \cos(x) dx`, standard JavaScript or Rust cannot
  natively compute that. The answer isn't a number; it's a symbolic expression:
  $\cos(x) + x \sin(x) + C$.
- To solve symbolic equations, factor polynomials, or generate step-by-step
  calculus derivations, a computer requires massive heuristic algorithms (like
  the Risch Algorithm for integration). That is exactly what a CAS provides.

### The Verdict for Your Codebase

Your current architecture—using Deno/Fresh for the frontend and the **Rust +
Axum + PyO3 (SymPy)** backend in your `math_engine/` folder—is already perfectly
positioned for this.

You need the CAS (SymPy), but you should implement a strict **"Routing
Gateway"** in your Deno server (`routes/api/math/check.ts`):

1. **The Fast Path:** If the MDX file metadata says the problem is Grade 8 or
   lower, validate the math directly in Deno or using your `wasm/` Rust module.
2. **The Deep Path:** If the MDX file is Calculus, Linear Algebra, or explicitly
   requests a step-by-step algebraic breakdown, forward the request to your
   Axum/SymPy engine.

This hybrid approach gives you the instantaneous UI response necessary for
younger students while preserving the PhD-level power of the CAS for advanced
users, keeping your server costs highly optimized.
