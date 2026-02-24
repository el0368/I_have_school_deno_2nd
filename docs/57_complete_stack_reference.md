# Complete Stack Reference — Sovereign Academy

> **Source of Truth** for every library, tool, version, configuration choice,
> and performance decision used across the entire project. Updated: 2026-02-24.

---

## Table of Contents

1. [Stack Overview (One Page)](#1-stack-overview-one-page)
2. [Runtime — Deno 2.x](#2-runtime--deno-2x)
3. [Web Framework — Fresh 2.x](#3-web-framework--fresh-2x)
4. [UI Layer — Preact + Signals](#4-ui-layer--preact--signals)
5. [Build Pipeline — Vite 7.x](#5-build-pipeline--vite-7x)
6. [Content Engine — MDX 3.x Pipeline](#6-content-engine--mdx-3x-pipeline)
7. [Math Rendering — MathJax (rehype-mathjax)](#7-math-rendering--mathjax-rehype-mathjax)
8. [Math Input — MathLive](#8-math-input--mathlive)
9. [Math Visualization — Mafs.js](#9-math-visualization--mafsjs)
10. [Database — PGlite (Postgres in WASM)](#10-database--pglite-postgres-in-wasm)
11. [Math Engine Microservice — Rust + Axum + PyO3](#11-math-engine-microservice--rust--axum--pyo3)
12. [CAS Brain — Python + SymPy](#12-cas-brain--python--sympy)
13. [WASM Module — Rust + wasm-bindgen](#13-wasm-module--rust--wasm-bindgen)
14. [Islands Architecture (Interactive UI)](#14-islands-architecture-interactive-ui)
15. [Testing Stack](#15-testing-stack)
16. [Quality Tooling (fmt / lint / hooks)](#16-quality-tooling-fmt--lint--hooks)
17. [Security Middleware](#17-security-middleware)
18. [Environment & Configuration](#18-environment--configuration)
19. [Performance Optimizations](#19-performance-optimizations)
20. [PWA Support](#20-pwa-support)
21. [Logging](#21-logging)
22. [Dependency Map (Who Calls What)](#22-dependency-map-who-calls-what)

---

## 1. Stack Overview (One Page)

| Layer                | Technology                   | Version   | Where Used                     |
| :------------------- | :--------------------------- | :-------- | :----------------------------- |
| Runtime              | Deno                         | 2.x       | Everything server-side         |
| Web Framework        | Fresh                        | 2.2.0     | `main.ts`, `routes/`           |
| UI                   | Preact                       | 10.27.2   | All `.tsx` files               |
| Reactivity           | @preact/signals              | 2.5.0     | Islands                        |
| Build Tool           | Vite                         | 7.1.3     | Dev server + prod bundle       |
| Content Format       | MDX                          | 3.1.1     | `routes/*.mdx`, `curriculums/` |
| Math (rendering)     | rehype-mathjax               | 7.1.0     | Vite pipeline (server render)  |
| Math (input UX)      | MathLive                     | 0.108.3   | `islands/MathInput.tsx`        |
| Math (graphs)        | Mafs                         | 0.21.0    | `islands/MathAnimation.tsx`    |
| Database             | PGlite                       | 0.3.15    | Client-side Postgres in WASM   |
| Math Engine (server) | Rust + Axum                  | 0.8       | `math_engine/` microservice    |
| Math Engine (async)  | Tokio                        | 1         | `math_engine/` async runtime   |
| Math Engine (bridge) | PyO3                         | 0.23      | Rust ↔ Python handshake        |
| Math Engine (CAS)    | Python + SymPy               | latest    | Symbolic algebra solver        |
| Math Engine (serial) | serde + serde_json           | 1         | JSON parsing in Rust           |
| Math Engine (HTTP)   | tower-http                   | 0.6       | CORS + timeouts in Rust        |
| Math Engine (log)    | tracing + tracing-subscriber | 0.1 / 0.3 | Structured logs in Rust        |
| Interactive WASM     | Rust + wasm-bindgen          | 0.2       | `wasm/` game/logic module      |
| Testing              | deno test + playwright       | —         | `tests/`                       |
| Lint / Format        | deno fmt, deno lint          | built-in  | CLI + git hooks                |

---

## 2. Runtime — Deno 2.x

- **What**: Secure-by-default JavaScript/TypeScript runtime built on V8 + Rust.
- **Why chosen over Node.js**: Native TypeScript support (no `ts-node`),
  built-in formatter/linter/test runner, and first-class `jsr:` package
  registry.
- **Key permissions used**: `-A` (all permissions) in development; in production
  `deno serve` is used with explicit flags.
- **`deno.json` key fields**:
  - `nodeModulesDir: "manual"` — Deno manages `node_modules` explicitly; avoids
    phantom hoisting bugs.
  - `compilerOptions.jsx: "precompile"` — Converts JSX to optimised static
    function calls at build time instead of at runtime. This is faster than
    React's classic transform and specific to Fresh 2.
  - `compilerOptions.jsxPrecompileSkipElements` — List of HTML primitives (`a`,
    `img`, `head`, etc.) that do NOT need Preact's virtual DOM diffing. They are
    emitted as raw strings by the server. This directly reduces JS bundle size
    sent to the browser.
  - `compilerOptions.types: ["vite/client"]` — Gives Deno type-awareness of
    Vite's `import.meta.env` and `import.meta.hot`.

---

## 3. Web Framework — Fresh 2.x

- **Package**: `jsr:@fresh/core@^2.2.0`
- **Pattern**: Server-side rendering first, islands for interactivity.
- **Routing**: File-based under `routes/`. A file at `routes/learn/math.tsx`
  maps to the URL `/learn/math`.
- **Special routes**:
  - `routes/_app.tsx` — Root layout (HTML shell, meta tags, global CSS).
  - `routes/api/[name].tsx` — Dynamic API route under `/api/:name`.
- **MDX integration**: A separate "Bulletproof MDX Router" is layered on top of
  `app.fsRoutes()` in `main.ts` to serve `.mdx` files that live outside the
  `routes/` directory (e.g., inside `curriculums/`). It is registered as a
  catch-all `app.get("*", ...)` AFTER `app.fsRoutes()` to avoid overriding
  standard routes.
- **Vite plugin**: `@fresh/plugin-vite@^1.0.8` bridges Fresh's SSR system with
  the Vite dev server, enabling HMR (Hot Module Replacement) during development.

---

## 4. UI Layer — Preact + Signals

### Preact

- **Package**: `npm:preact@^10.27.2`
- **Why not React**: Preact is ~3KB vs React's ~45KB. Functionally identical
  API. Fresh is built specifically for Preact.
- **JSX Pragma**: `jsxImportSource: "preact"` in `deno.json` and in
  `vite.config.ts` (for MDX files) means all JSX compiles to
  `preact.createElement` calls automatically.

### @preact/signals

- **Package**: `npm:@preact/signals@^2.5.0`
- **What**: Fine-grained reactivity. A `signal` is a single value that
  re-renders **only the DOM node that reads it**, not the whole component tree.
- **Where used**: Inside islands (e.g., `Counter.tsx`, `MathInput.tsx`) to avoid
  unnecessary re-renders when the user is typing a math answer.

---

## 5. Build Pipeline — Vite 7.x

- **Package**: `npm:vite@^7.1.3`
- **Role**: Dev server (HMR) + production bundler. Fresh delegates all asset
  compilation to Vite.
- **Key plugins registered in `vite.config.ts`**:
  1. `@mdx-js/rollup` — Converts `.mdx` files into Preact components at build
     time.
  2. `@fresh/plugin-vite` — Connects Fresh's SSR with Vite's module graph.

### Path Alias

```ts
resolve: { alias: { "@": path.resolve(import.meta.dirname, ".") } }
```

This allows imports like `import { foo } from "@/lib/foo.ts"` from anywhere in
the project, equivalent to the workspace root.

---

## 6. Content Engine — MDX 3.x Pipeline

MDX is the primary format for all lesson content. It is **Markdown that can
embed JSX components**.

### Packages

| Package                 | Version        | Job                                                         |
| :---------------------- | :------------- | :---------------------------------------------------------- |
| `@mdx-js/rollup`        | 3.1.1          | Vite Rollup plugin: converts `.mdx` → JS at build time      |
| `@mdx-js/preact`        | 3.1.1          | Preact-specific MDX provider (component overrides)          |
| `remark-gfm`            | 4.0.0          | Adds GitHub Flavored Markdown (tables, strikethrough, etc.) |
| `remark-math`           | 6.0.0          | Recognizes `$...$` and `$$...$$` as math nodes in the AST   |
| `rehype-mathjax`        | 7.1.0          | Converts math nodes to MathJax HTML at build/render time    |
| `hast-util-from-parse5` | 8.0.2 (pinned) | Internal AST util; pinned to fix a version conflict         |

### Pipeline Flow

```
.mdx file
  → remark-gfm    (Markdown AST: adds tables, etc.)
  → remark-math   (Markdown AST: marks $...$ as math)
  → rehype-mathjax (HTML AST: renders math to SVG/HTML)
  → @mdx-js/rollup (turns the whole file into a Preact component JS module)
  → Vite bundles it into the final assets
```

### MDX Route Discovery

`mdx-routes.ts` is an auto-generated registry of every `.mdx` file path →
dynamic `import()` function. It is consumed by the Bulletproof MDX Router in
`main.ts`. This allows MDX files to live anywhere in the project without adding
them manually to `routes/`.

---

## 7. Math Rendering — MathJax (rehype-mathjax)

- **Package**: `npm:rehype-mathjax@^7.1.0` (also in `package.json`)
- **Render mode**: **Server-side** — MathJax SVGs are generated at build time by
  `rehype-mathjax` running inside Vite. The browser receives pre-rendered SVG,
  not LaTeX strings. This is called "zero-JS math rendering."
- **Why not KaTeX**: KaTeX requires a CDN or client-side JS. KaTeX was removed
  from this project to achieve offline-first capability. MathJax via
  `rehype-mathjax` produces standalone SVGs with no runtime JS dependency.
- **Input syntax**: Standard LaTeX inside `$...$` (inline) and `$$...$$`
  (block), made possible by `remark-math` upstream in the pipeline.

---

## 8. Math Input — MathLive

- **Package**: `npm:mathlive@^0.108.3` (in `package.json`)
- **What**: A Web Component (`<math-field>`) that renders a professional LaTeX
  math editor in any HTML page. Supports touch, keyboard, virtual keyboard.
- **Where used**: `islands/MathInput.tsx` — wraps the Web Component in a Preact
  island so it activates on the client only (not during SSR).
- **Data flow**: Student types an answer → MathLive captures the LaTeX string
  (`\frac{1}{2}`, `x^2 + 5`) → island POSTs it to `/api/math/solve` on the Rust
  math engine → receives `{ correct: true/false, steps: [...] }`.

---

## 9. Math Visualization — Mafs.js

- **Package**: `npm:mafs@^0.21.0` (in `package.json`)
- **What**: A React/Preact-compatible library for rendering interactive,
  animated mathematical figures (coordinate planes, function curves, vectors,
  geometry).
- **Where used**: `islands/MathAnimation.tsx` — wraps Mafs components in a
  Preact island for client-side rendering.
- **Why an island**: Mafs uses canvas/SVG animations driven by JS. It cannot run
  on the server (it needs `window`, `requestAnimationFrame`). Islands are the
  correct Fresh pattern for this.

---

## 10. Database — PGlite (Postgres in WASM)

- **Package**: `npm:@electric-sql/pglite@^0.3.15` (in `package.json`)
- **What**: A full Postgres database engine compiled to WebAssembly that runs
  **inside the browser** (or in Deno). No database server is required.
- **Use case**: Storing student progress, completed problems, and session data
  locally in the browser (using `IndexedDB` for persistence). This makes the app
  work fully offline after the first load.
- **Why not SQLite**: PGlite lets us use real Postgres SQL syntax, which means
  the same schemas/migrations can be used on a cloud Postgres instance if we
  ever need server-side persistence.
- **Why not a REST API for every action**: Eliminates a round-trip to the server
  for read-heavy student progress queries. Progress is local-first.

---

## 11. Math Engine Microservice — Rust + Axum + PyO3

This is a separate Rust binary in `math_engine/`. It runs alongside the Deno
server as an independent process.

### Full Cargo.toml Dependency Breakdown

```toml
[dependencies]
# HTTP server + async runtime
axum = "0.8"
tokio = { version = "1", features = ["full"] }

# CORS + request timeouts
tower-http = { version = "0.6", features = ["cors", "timeout"] }

# Python bridge to SymPy
pyo3 = { version = "0.23", features = ["auto-initialize"] }

# JSON serialization/deserialization
serde = { version = "1", features = ["derive"] }
serde_json = "1"

# Structured async logging
tracing = "0.1"
tracing-subscriber = "0.3"
```

### Axum (0.8): The HTTP Server

- Lightweight, composable HTTP framework built on top of `hyper` and `tokio`.
- Routes are defined as Rust `async fn` handlers.
- Handles thousands of concurrent requests through non-blocking I/O.
- The math engine exposes these endpoints:
  - `POST /api/math/solve` — Solve an equation symbolically.
  - `POST /api/math/factor` — Factor a polynomial.
  - `POST /api/math/simplify` — Simplify an expression.
  - `POST /api/math/check` — Check if a student's answer equals the correct
    answer (returns `{ correct: bool }`).
  - `GET /health` — Health check for the process monitor.

### Tokio (1): The Async Runtime

- Rust's de-facto async runtime. Axum requires it.
- Provides `tokio::task::spawn_blocking` — **critical for the GIL**. The Python
  interpreter has a Global Interpreter Lock (GIL), meaning only one Python
  thread can run at a time. If SymPy is running on the same thread as Axum's
  async executor, it would pause the entire server while solving.
  `spawn_blocking` moves the SymPy call to a **dedicated blocking thread pool**,
  freeing the async executor to continue accepting requests.

```rust
// This is the key pattern for every math handler:
pub async fn solve_handler(Json(req): Json<MathRequest>) -> Json<MathResponse> {
    tokio::task::spawn_blocking(move || {
        call_sympy(&req) // Python/SymPy runs here, in a blocking thread
    }).await.unwrap()
}
```

### PyO3 (0.23): The Rust ↔ Python Bridge

- Embeds a full CPython interpreter **inside** the Rust binary memory space.
- `features = ["auto-initialize"]` — PyO3 starts the Python interpreter
  automatically when the Rust binary starts. No manual `Py_Initialize()` call
  needed.
- **NOT a subprocess**: The Python engine is loaded once at startup and stays
  warm. Calling SymPy has **zero process-spawn overhead**.
- **Memory**: Rust and Python share the same process memory. Passing a string
  from Rust to Python is a pointer assignment, not a
  serialization/deserialization round-trip.
- **GIL usage**: PyO3 requires acquiring the GIL (`Python::with_gil(...)`) for
  every call. `spawn_blocking` ensures this does not stall Axum.

### serde + serde_json (1): Serialization

- `serde` provides the `#[derive(Serialize, Deserialize)]` macros for Rust
  structs.
- `serde_json` parses the incoming JSON request body and serializes the
  response.
- Performance: `serde_json` is one of the fastest JSON parsers in existence,
  benchmarked at **600-800 MB/s** for parsing.

### tower-http (0.6): HTTP Middleware for Rust

- Provides `CorsLayer` — configures which origins may call the math engine API.
  In development, `localhost:5173` is the only allowed origin.
- Provides `TimeoutLayer` — automatically returns a `408 Request Timeout` if
  SymPy takes longer than a configured limit (e.g., 30 seconds for complex
  integrals). Protects the server from hanging on pathological inputs.

### tracing + tracing-subscriber (0.1 / 0.3): Structured Logging

- `tracing` provides macros (`info!`, `debug!`, `error!`) for structured, async-
  aware logging with key-value fields.
- `tracing-subscriber` formatter outputs those logs to `stdout` in a readable
  format (or JSON format if deployed to a cloud log aggregator).

---

## 12. CAS Brain — Python + SymPy

- **What**: SymPy is a full Computer Algebra System (CAS) written in pure
  Python. It has been in development for **15+ years** and covers:
  - Symbolic algebra (expand, factor, simplify, solve, substitute)
  - Calculus (derivatives, integrals, limits, series)
  - Linear algebra (matrices, eigenvalues, determinants)
  - Discrete math (combinatorics, graph theory)
  - Number theory (primes, GCD, factorization)
  - Equation solving (real/complex, systems of equations)
  - LaTeX output (`sympy.latex(expr)` → LaTeX string for display)
- **Install**: `pip install sympy`. Lives in the system Python that PyO3 links
  against (set via `PYO3_PYTHON` environment variable, or auto-detected).
- **Performance reality**: A typical Grade 1–6 problem (e.g.,
  `factor(x^2+5x+6)`) solves in **< 5ms**. A calculus problem may take 20–100ms.
  Both are imperceptible to a student.

---

## 13. WASM Module — Rust + wasm-bindgen

This is a **separate** Rust project in `wasm/` (different from `math_engine/`).
Its purpose is interactive browser-side logic (games, simulations).

### Cargo.toml

```toml
[lib]
crate-type = ["cdylib"]  # Compile to a shared library suitable for WASM

[dependencies]
wasm-bindgen = "0.2"
```

- `cdylib` — Required crate type for building `.wasm` files intended to be
  loaded in a browser.
- `wasm-bindgen` — Bridge library that generates JavaScript "glue code" so that
  the browser can call Rust functions as if they were regular JS functions.

### Build Command

```bash
deno task wasm  # runs scripts/build_wasm.sh
# Which runs: wasm-pack build wasm/ --target web
```

This produces `wasm/pkg/` containing:

- `wasm_bg.wasm` — The compiled WASM binary.
- `wasm.js` — Auto-generated JS glue code (type definitions + memory bridge).
- `package.json` — So the `wasm/pkg/` directory can be imported like an npm
  package.

### Islands using WASM

`islands/RustCounter.tsx` — Imports the WASM module and uses a Rust function
from the browser. Template for any future game or simulation.

---

## 14. Islands Architecture (Interactive UI)

Fresh's "Islands" pattern means: **the server sends HTML only, and only the
explicitly marked Island components ship JavaScript to the browser.**

### The Islands

| File                             | Purpose                 | Dependencies             |
| :------------------------------- | :---------------------- | :----------------------- |
| `islands/Counter.tsx`            | Basic Preact state demo | @preact/signals          |
| `islands/RustCounter.tsx`        | WASM integration demo   | wasm-bindgen `wasm/pkg/` |
| `islands/MathInput.tsx`          | Student answer input    | MathLive, fetch API      |
| `islands/MathAnimation.tsx`      | Animated math graphs    | Mafs.js                  |
| `islands/LoginSync.tsx`          | Auth state sync         | Preact, fetch API        |
| `islands/MarkCompleteButton.tsx` | Progress button         | Preact, PGlite           |

### Why Islands over full SPA

- A full SPA (e.g., Create React App / Next.js) sends ALL component JS to the
  browser. In a large curriculum app, this could be **10+ MB**.
- With Islands, a student reading a lesson page downloads **zero JS** for the
  page content. Only the interactive components (`MathInput`, `MathAnimation`)
  ship JS, and only when they appear in the page.

---

## 15. Testing Stack

| Tool                      | Version  | Role                                                |
| :------------------------ | :------- | :-------------------------------------------------- |
| `deno test`               | built-in | Unit test runner                                    |
| `@testing-library/preact` | 3.2.4    | Render components in tests                          |
| `happy-dom`               | 20.7.0   | Lightweight DOM implementation for test environment |
| `playwright`              | 1.58.2   | End-to-end (E2E) browser tests                      |

- Tests live in `tests/` and `logic.test.ts`.
- Run with `deno task test`.
- Deno's `--unstable-kv` flag is passed since some tests may touch Deno KV
  (key-value store).

---

## 16. Quality Tooling (fmt / lint / hooks)

### Deno fmt

- Built into Deno. Equivalent to `prettier`. No config file needed.
- Run: `deno fmt` (auto-fix) or `deno fmt --check .` (CI mode).
- Covers TypeScript, JavaScript, JSON, and Markdown.

### Deno lint

- Built into Deno. Equivalent to `eslint`.
- Rules are configured in `deno.json`:
  ```json
  "lint": { "rules": { "tags": ["fresh", "recommended"] } }
  ```
  - `fresh` tag: rules specific to Fresh framework patterns (e.g., no bare JSX
    outside island files).
  - `recommended` tag: standard best-practice rules.

### Git Pre-Commit Hook

- Location: `.githooks/pre-commit`
- Install: `git config core.hooksPath .githooks`
- On every `git commit`, the hook runs `deno fmt && deno lint` across all files.
  If either fails, the commit is aborted.
- This guarantees that **no unformatted or linting-error code ever enters the
  repository**.

### `deno task check`

```bash
deno fmt --check . && deno lint . && deno check
```

Full validation pipeline: format check + lint + TypeScript type-check. Use
before PRs or deployments.

---

## 17. Security Middleware

All security headers are applied globally in `main.ts` via a `app.use()`
middleware:

```ts
res.headers.set("X-Content-Type-Options", "nosniff");
res.headers.set("X-Frame-Options", "DENY");
res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
```

| Header                        | Value                             | What it prevents                      |
| :---------------------------- | :-------------------------------- | :------------------------------------ |
| `X-Content-Type-Options`      | `nosniff`                         | MIME sniffing attacks                 |
| `X-Frame-Options`             | `DENY`                            | Clickjacking / iframe embedding       |
| `Referrer-Policy`             | `strict-origin-when-cross-origin` | Leaking full URLs in referrer headers |
| `Access-Control-Allow-Origin` | Own origin only                   | Cross-origin API theft                |

**CORS Logic**: Only requests from `APP_URL` (env var, defaults to
`http://localhost:5173`) are allowed to cross-origin. All others have no CORS
header set (browser blocks them by default).

---

## 18. Environment & Configuration

- **File**: `config/env.ts`, exports `loadEnv()`.
- **Called at**: the very first line of `main.ts` (before any route or
  middleware registration).
- **Behaviour**: Reads required environment variables (e.g., `SESSION_SECRET`,
  `APP_URL`) and **throws immediately at startup** if any are missing. This
  prevents the server from starting in a broken half-configured state.
- **Development**: Variables come from a `.env` file (gitignored).
- **Production**: Variables come from the host's environment (Deno Deploy,
  Docker `--env`, etc.).

---

## 19. Performance Optimizations

### Problem: 26+ second Vite cold-start

Vite's file watcher (`chokidar`) does not respect `.gitignore`. On startup, it
was scanning `wasm/target/` which contains **tens of thousands** of Rust
compile-artifact files, causing a 26-second startup delay.

### Fix in `vite.config.ts`

```ts
server: {
  watch: {
    ignored: [
      "**/wasm/target/**",  // Rust artifacts — the main offender
      "**/node_modules/**",
      "**/.git/**",
      "**/docs/**",         // Static markdown
      "**/subjects/**",     // Research text files
    ],
  },
},
```

### `optimizeDeps` exclusion

```ts
optimizeDeps: {
  exclude: ["rehype-mathjax", "remark-math", "remark-gfm"],
},
```

These are **build-time** remark/rehype plugins that run inside Vite's Rollup
pipeline, not in the browser. Pre-bundling them (Vite's default) adds startup
time without any benefit because they are never requested by the browser.

### JSX Precompile (`jsxPrecompileSkipElements`)

In `deno.json`, HTML primitive elements (`a`, `img`, `head`, `title`, etc.) are
listed in `jsxPrecompileSkipElements`. The Fresh JSX precompiler skips virtual-
DOM wrapping for these elements, emitting them as raw HTML strings on the
server. This reduces per-request CPU cost for every rendered page.

---

## 20. PWA Support

- **File**: `static/manifest.json`
- **What it does**: Tells the browser that this is an installable Progressive
  Web App.
- **Key fields**:
  - `name` / `short_name`: App name shown in install prompt.
  - `start_url`: The URL to open when the installed PWA launches.
  - `display: "standalone"`: Hides the browser chrome (address bar, etc.) when
    installed as an app.
  - `theme_color` / `background_color`: OS-level color theming.
  - `icons`: Array of icon sizes for the home screen shortcut.
- **Offline capability**: Provided by PGlite (local Postgres) for data, and by
  pre-rendered MDX pages (no JS needed to read content).

---

## 21. Logging

- **File**: `lib/logger.ts`
- **Interface**: `log.debug(message, meta?)`, `log.info(...)`, `log.error(...)`
- **Used in**: `main.ts` (request middleware), all route handlers.
- **Format**: Human-readable in development. Can be switched to JSON for
  structured log aggregation (e.g., Datadog, Loki) in production.

---

## 22. Dependency Map (Who Calls What)

```
Student Browser
  │
  ├── Preact Islands (MathInput.tsx)
  │     ├── MathLive (Latin editor UI)
  │     └── fetch POST /api/math/solve
  │                 │
  │                 │ HTTP (JSON)
  │                 ▼
  │           [math_engine binary — port 8001]
  │                 ├── Axum    (receives request)
  │                 ├── serde   (parses JSON)
  │                 ├── Tokio   (spawn_blocking)
  │                 └── PyO3 → CPython → SymPy (solves math)
  │                                        └── returns result
  │                 ├── serde   (serializes response)
  │                 └── Axum    (returns JSON)
  │
  ├── Preact Islands (MathAnimation.tsx)
  │     └── Mafs.js (renders SVG graph)
  │
  ├── Preact Islands (RustCounter.tsx)
  │     └── wasm/pkg/wasm.js → wasm_bg.wasm (Rust logic)
  │
  ├── Preact Islands (MarkCompleteButton.tsx)
  │     └── PGlite (IndexedDB — local Postgres)
  │
  └── Static HTML + Pre-rendered MDX
        ├── MathJax SVGs (embedded in HTML, no JS)
        └── CSS (assets/styles.css)

Deno Server (Fresh 2)
  ├── main.ts
  │     ├── loadEnv()          config/env.ts
  │     ├── Security Middleware
  │     ├── Request Logger     lib/logger.ts
  │     ├── app.fsRoutes()     routes/*.tsx
  │     └── MDX Router         mdx-routes.ts → curriculums/*.mdx
  │
  └── Build (Vite 7)
        ├── @fresh/plugin-vite
        ├── @mdx-js/rollup
        │     ├── remark-gfm
        │     ├── remark-math
        │     └── rehype-mathjax
        └── Alias: "@" → workspace root
```
