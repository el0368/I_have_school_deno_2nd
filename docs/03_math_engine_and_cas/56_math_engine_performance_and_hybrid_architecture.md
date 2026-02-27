# Math Engine: Performance & Hybrid Architecture

This document explains the performance characteristics and architectural
reasoning behind the **Rust + PyO3 + SymPy** hybrid model used in Sovereign
Academy.

---

## 1. The "Hybrid" Performance Model

The math engine uses a "High-Speed Manager / Deep-Thinking Specialist" pattern.
It combines the low-level performance of compiled Rust with the massive symbolic
math library of Python's SymPy.

### A. The "High-Speed Manager" (Rust + Axum)

**Speed: Extremely Fast (Compiled)**

- **Job**: Handling the "Outside World."
- **Networking**: Axum and Tokio (the foundation of Deno) receive HTTP requests
  at native speed.
- **Parsing**: Using `serde`, the fastest JSON library in the world, to process
  user input at **600MB/s+**.
- **Concurrency**: Rust can handle thousands of students simultaneously without
  the Python Global Interpreter Lock (GIL) slowing down the network layer.

### B. The "Deep-Thinking Specialist" (Python + SymPy)

**Speed: Calculated Speed (Interpreted)**

- **Job**: Solving the actual Math.
- **Math Brain**: SymPy handles symbolic algebra, factoring, calculus, and proof
  verification.
- **The Reality**: While Python is 10x–50x slower than C++, most "PhD-level"
  math solvers in C++ are incomplete. SymPy has 15 years of refinement.
- **Human Perception**: A math problem taking 20ms in Python vs. 1ms in C++
  feels **instant** to a human student.

---

## 2. The Internal Bridge (PyO3)

**PyO3** is the secret that makes this work with zero friction.

- **Embedded Interpreter**: PyO3 embeds the CPython engine **directly inside**
  the Rust binary.
- **Zero Process Overhead**: It is NOT like calling a Python script via
  `subprocess`. There is no "startup" time. The Python engine stays "warm" and
  lives inside the Rust memory space.
- **Direct Hand-off**: Rust passes the LaTeX equation to Python as a simple
  in-memory pointer. This is as close to hardware-speed communication as two
  different languages can get.

---

## 3. The Request Lifecycle (Step-by-Step)

1. **Deno (Fresh)**: Sends a JSON request (`{ "expression": "x^2 + 5x + 6" }`).
2. **Rust (Axum)**: Receives and validates the request at **Rust speed**.
3. **Rust (PyO3)**: Hands the math problem to the internal Python engine
   (Instant).
4. **Python (SymPy)**: Solves the algebra (Python speed).
5. **Rust (Axum)**: Packages the answer and returns it to Deno at **Rust
   speed**.

---

## 4. Why this "Hybrid" wins

This is the exact same industry-standard pattern used by high-performance data
tools like **Polars** and **Pydantic V2**.

| Feature         | Pure Python  | Pure Rust  | **Rust + PyO3 (Ours)** |
| :-------------- | :----------- | :--------- | :--------------------- |
| **I/O & Async** | Slow (GIL)   | Fast       | **Fast**               |
| **Math Scope**  | Huge (SymPy) | Limited    | **Huge (SymPy)**       |
| **Reliability** | OK           | High       | **High**               |
| **Deployment**  | Many files   | One binary | **One binary**         |

### Summary Verdict

You have **hardened** the exterior of your math engine with Rust architecture,
ensuring it is fast and scalable, while keeping the **intelligence** of SymPy to
ensure it can handle math from Grade 1 to a PhD.
