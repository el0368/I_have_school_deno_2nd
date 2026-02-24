# Math Engine: Rust + PyO3 + Axum (Replacing Mojo)

## Decision: Switch from Mojo to Rust + PyO3

Rust + PyO3 is a better choice than Mojo for this project's math engine.

---

## 1. How it works: Rust + PyO3

[PyO3](https://pyo3.rs) is a battle-tested crate that **embeds the CPython
interpreter directly inside a Rust binary**. You write Rust, call
`sympy.solve(...)` as a native function call — no subprocess, no extra HTTP hop,
no manual serialization between two processes.

```rust
use pyo3::prelude::*;

fn solve_equation(expr: &str) -> PyResult<String> {
    Python::with_gil(|py| {
        let sympy = py.import("sympy")?;
        let result = sympy.call_method1("sympify", (expr,))?;
        Ok(result.to_string())
    })
}
```

---

## 2. Rust + PyO3 vs Mojo — Head to Head

|                         | Rust + PyO3                              | Mojo                              |
| :---------------------- | :--------------------------------------- | :-------------------------------- |
| **Windows support**     | Native (no WSL needed)                   | WSL only                          |
| **Stability**           | Rock solid, v0.23, used in production    | Still experimental                |
| **SymPy interop**       | PyO3 is specifically designed for this   | Mojo's Python interop is unstable |
| **You already know it** | Cargo setup already exists in `wasm/`    | Mojo is a new language            |
| **HTTP server**         | Axum (excellent, well-documented)        | DIY                               |
| **Community**           | Massive (docs, Stack Overflow, examples) | Tiny                              |
| **Performance ceiling** | Identical — SymPy is the bottleneck      | Identical                         |

---

## 3. The Architecture

The Mojo `math_engine/` folder becomes an **Axum HTTP server** in Rust:

```
math_engine/
  Cargo.toml        ← axum + pyo3 + tokio + serde dependencies
  src/
    main.rs         ← Axum server, listens on :8080
    routes/
      solve.rs      ← POST /solve → calls SymPy via PyO3
      simplify.rs   ← POST /simplify
```

`lib/mojo.ts` is renamed `lib/math_engine.ts` and still calls
`http://localhost:8080/solve`. **Deno does not care if the other end is Mojo or
Rust.**

---

## 4. The One Catch

PyO3 still requires **Python + SymPy installed on the server**. The Python
dependency is not eliminated — it is wrapped in Rust instead of Mojo.

On GCP VPS (Ubuntu):

```bash
apt install python3-pip
pip install sympy
```

That is the full setup.

---

## 5. Why Axum for the HTTP layer?

Axum is the standard/obvious HTTP framework for Rust services. It is the Rust
equivalent of `Hono` or `Express` for JavaScript.

### Endpoints are dead simple

```rust
let app = Router::new()
    .route("/solve", post(solve_handler))
    .route("/simplify", post(simplify_handler));
```

### Middleware is one line each

```rust
.layer(CorsLayer::permissive())
.layer(TimeoutLayer::new(Duration::from_secs(30)))
```

### JSON just works

`axum::Json<T>` auto-deserializes request bodies and serializes responses via
Serde. No boilerplate.

### Why not the alternatives?

| Framework     | Why not?                                                                 |
| :------------ | :----------------------------------------------------------------------- |
| **Actix-web** | Faster benchmarks but uses its own actor runtime. Overkill for 2 routes. |
| **Warp**      | Older, less maintained, strange filter-composition API.                  |
| **Hyper**     | Too low-level — you write your own routing from scratch.                 |
| **Rocket**    | Requires nightly Rust compiler, heavier macro system.                    |

---

## 6. Why Axum specifically — The Tokio Connection

Axum is built by the **Tokio team** — the same engineers who maintain the core
of the Rust async ecosystem:

| Library     | Role                                                         |
| :---------- | :----------------------------------------------------------- |
| **Tokio**   | The async engine (like the Node.js event loop, but for Rust) |
| **Hyper**   | The raw HTTP implementation (low-level)                      |
| **Tower**   | The middleware system (CORS, Retries, Timeouts)              |
| **Tracing** | The industry-standard logging/instrumentation library        |
| **Axum**    | The web framework that sits on top of all of them            |

Because the same people write the engine (Tokio), the pipes (Hyper), and the
framework (Axum), everything fits perfectly. There are no "Why won't this
library work with that runtime?" bugs.

**Deno Connection**: Deno's core is built using these same Tokio libraries.
Choosing Axum for the math engine means both ends of the project are built on
the same high-quality foundation.

---

## 7. Summary

- **Decision**: Rust + PyO3 + Axum replaces Mojo.
- **Python**: Still required on the server (`sympy`), but managed by Rust.
- **Interface**: `lib/math_engine.ts` (renamed from `lib/mojo.ts`) calls
  `http://localhost:8080/solve` — the Deno side does not change at all.
- **When to build**: After Grade 1–2 content is complete. Grade 1 arithmetic
  does not need SymPy.
