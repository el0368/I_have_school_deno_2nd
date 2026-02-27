# Sovereign Academy: Architecture & Tech Stack

This document outlines the complete, professional-grade technology stack used to
build Sovereign Academy. The architecture is designed to handle everything from
basic Grade 1 arithmetic to PhD-level symbolic calculus, while maintaining
instant page loads and a seamless developer experience.

---

## 1. The Core Infrastructure (Full-Stack Framework)

**Technology:** [Deno](https://deno.com/) + [Fresh](https://fresh.deno.dev/)

- **Role:** The backbone of the entire application. It serves the HTML, handles
  API requests, and manages the server-side logic.
- **Why:** Fresh sends zero JavaScript to the client by default, making the site
  incredibly fast. It uses Preact for interactive "Islands" only where
  necessary.
- **Language:** TypeScript (Strictly typed, secure by default).
- **Styling:** Pure CSS (No Tailwind, keeping the build step simple and the
  output minimal).

## 2. The Math Presentation Layer (Client-Side)

This layer handles how math looks and how students interact with it in the
browser.

- **Static Rendering:** [MathJax](https://www.mathjax.org/) (via
  `rehype-mathjax`)
  - **Role:** Converts standard LaTeX (e.g., `$\frac{1}{2}$`) written in
    Markdown/MDX files into beautiful, accessible MathML on the server before
    the page loads.
- **Interactive Input:** [MathLive](https://cortexjs.io/mathlive/)
  - **Role:** Provides the `<math-field>` web component. This acts as a "virtual
    math keyboard," allowing students to type complex formulas intuitively. It
    outputs clean LaTeX to send to the backend.
- **Visualizations:** [Mafs.js](https://mafs.dev/)
  - **Role:** Renders interactive, high-performance coordinate planes, geometry,
    and calculus plots (similar to Desmos).

## 3. The Math Engine (Server-Side Deep CAS)

This is the "Heavy Brain" of the platform, capable of solving advanced
mathematics.

**Technology:** [Rust](https://www.rust-lang.org/) + [PyO3](https://pyo3.rs/) +
[Axum](https://github.com/tokio-rs/axum) + [SymPy](https://www.sympy.org/)
(Python)

- **Role:** A dedicated microservice running on the backend that acts as a
  Computer Algebra System (CAS).
- **How it works:**
  1. The Deno Fresh API receives a LaTeX string from the student's MathLive
     input.
  2. Deno sends an HTTP request to the Rust/Axum server (port 8080).
  3. Rust uses PyO3 to embed CPython and call SymPy directly.
  4. SymPy performs the symbolic math (factoring, integration, solving ODEs).
  5. Axum returns the simplified LaTeX back to Deno, which sends it to the
     browser.
- **Why Rust + PyO3 instead of WASM?** SymPy is the gold standard for
  open-source math, but it requires a full Python environment. It cannot be
  compiled into a lightweight WebAssembly module for the browser. Rust + PyO3
  embeds the Python interpreter directly inside a single compiled binary, giving
  native performance with full access to Python's ecosystem.

## 4. The High-Performance Browser Layer (WASM)

**Technology:** Rust + WebAssembly (`wasm32-unknown-unknown`)

- **Role:** Reserved for future, highly intensive client-side tasks that need to
  run instantly without a server round-trip (e.g., custom rendering engines,
  offline tools, or complex physics simulations).
- **Status:** Currently stripped down to a basic boilerplate (`ping()`). The
  previous `mathcore` CAS was removed because the Rust/SymPy server handles all
  math logic more comprehensively.

## 5. Data & Persistence (Planned)

- **Primary Database:** PostgreSQL
  - **Role:** The single source of truth for users, subscriptions, and global
    progress.
- **Local Cache:** [PGlite](https://pglite.dev/) (WASM PostgreSQL)
  - **Role:** Runs a full PostgreSQL database _inside the student's browser_.
    This allows for "offline mode" where progress is saved locally and synced to
    the cloud when the connection is restored.
- **Key-Value Store:** Deno KV
  - **Role:** Fast, built-in storage for session management and temporary state.

---

## Summary Visualization

| Layer                | Technology          | Job                            | Execution Environment            |
| :------------------- | :------------------ | :----------------------------- | :------------------------------- |
| **UI & Routing**     | Deno Fresh + Preact | Pages, Layouts, API Endpoints  | Server (SSR) + Browser (Islands) |
| **Math Display**     | MathJax             | Renders LaTeX beautifully      | Server (SSR)                     |
| **Math Input**       | MathLive            | Virtual math keyboard          | Browser                          |
| **Math Graphs**      | Mafs.js             | Interactive plots              | Browser                          |
| **Math Brain (CAS)** | Mojo + SymPy        | Solves Calculus, Algebra, etc. | Server (Linux/WSL Microservice)  |
| **Database**         | PostgreSQL / PGlite | Stores users and progress      | Server + Browser (Offline sync)  |
