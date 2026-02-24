# System Architecture: Sovereign Academy

## Overview

Sovereign Academy is a **local-first educational platform** built on Fresh 2.x,
Deno, and Vite. Its core design principle is **Sovereignty** — the application
can run entirely offline, the student owns their data, and the system is fast
with zero server-side database requirements.

---

## 1. Content Collections

All educational content is separated from application logic.

- **Content Storage**: All lessons (MDX files) live in
  `curriculums/[subject]/[grade]/[unit]/[topic].mdx`.
- **Routing**: The virtual router handles URL mapping (see below). Do **not**
  put lesson files in `routes/`.
- **Separation of Concerns**: Curriculum writers work in `curriculums/`.
  Developers work in `routes/`, `components/`, and `islands/`.

---

## 2. The Virtual MDX Router

Fresh 2.x has serialization limitations that prevent rendering complex MDX
components in standard route handlers. We bypass this with a custom virtual
router.

### How it works:

1. **Auto-Discovery**: `mdx-routes.ts` uses `import.meta.glob` to scan
   `curriculums/` at build time and build a registry of all MDX modules.
2. **Interception**: `main.ts` intercepts all HTTP requests whose path starts
   with `/learn/`.
3. **SSR**: The router finds the matching MDX module, wraps content in
   `CurriculumLayout.tsx`, and renders HTML directly on the server.

### Benefits:

- Unified layout (sidebar, breadcrumbs) applied to every lesson automatically.
- No serialization crashes.
- URL normalization for trailing slashes.

---

## 3. Math Rendering Architecture (Two-Layer)

Math is handled in two separate layers to maximize performance and
interactivity.

### Layer 1: Server-Side Static (MathJax)

- **Tool**: `rehype-mathjax` (`npm:rehype-mathjax@^7.1.0`)
- **Configured in**: `vite.config.ts` → MDX plugin `rehypePlugins`
- **Role**: Reads LaTeX `$...$` and `$$...$$` syntax from MDX files at
  build/render time and outputs native HTML5 `<math>` (MathML) tags.
- **Result**: Beautiful, accessible math with zero runtime JavaScript.

### Layer 2: Client-Side Interactive (MathLive)

- **Tool**: `mathlive` (`npm:mathlive@^0.108.3`)
- **Location**: `islands/MathInput.tsx`
- **Role**: Provides the interactive virtual math keyboard where students type
  their answers.
- **Output**: Emits `math-ml` and `latex` strings that can be validated by the
  Rust WASM engine or stored in PGlite.

---

## 4. Local-First Data Strategy

| Type         | Format | Location              | Purpose                                    |
| ------------ | ------ | --------------------- | ------------------------------------------ |
| **Content**  | MDX    | `curriculums/`        | Lesson text, math equations                |
| **Progress** | SQL    | PGlite (Browser WASM) | Student scores, completion status, mastery |

### PGlite

- **Package**: `@electric-sql/pglite@^0.3.15`
- **What it is**: Full PostgreSQL compiled to WebAssembly, running inside the
  browser.
- **Storage**: Persisted in `IndexedDB` under the key
  `idb://sovereign-progress`.
- **Why**: Enables offline-first progress tracking with real SQL query power.

---

## 5. The Math Engine (Server-Side CAS)

Complex mathematical validation, symbolic algebra, and calculus are handled by a
dedicated backend microservice.

- **Language**: Mojo
- **Engine**: SymPy (via Python interop)
- **Location**: `math_engine/`
- **Integration**: Deno Fresh API routes (`routes/api/math/`) send HTTP requests
  to the Mojo server.
- **Why**: Advanced CAS (Computer Algebra Systems) like SymPy require a full
  Python environment and cannot run efficiently in the browser via WASM. This
  architecture provides PhD-level math capabilities while keeping the frontend
  lightweight.

---

## 6. Rust WASM Engine (Client-Side Utilities)

Lightweight, instant client-side utilities are written in Rust and compiled to
WebAssembly.

- **Source**: `wasm/src/lib.rs`
- **Output**: `static/wasm_bg.wasm`
- **Integration**: Imported by Preact Islands.
- **Rule**: WASM must only be called from `islands/`, never in server-side
  routes. Currently reserved for future high-performance browser tasks (e.g.,
  custom rendering or offline tools).

---

## 6. UI Design Philosophy

- **Frameless Design**: Designed for Tauri's custom frameless window.
- **Vanilla CSS**: Global styles in `assets/styles.css`. CSS custom properties
  (variables) for theming. **No Tailwind CSS**.
- **Preact Signals**: Reactive state management for islands (`@preact/signals`).
- **Island Architecture**: Client-side interactivity is isolated to `islands/`
  to minimize JavaScript bundle size.

---

## 7. Future: Tauri Desktop/Mobile

The application is designed to be packaged with **Tauri 2.0** for native
distribution on Windows, macOS, iOS, and Android. The CSS is "frameless" and
platform-agnostic in preparation for this.
