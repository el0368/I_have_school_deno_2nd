# Project Context: Sovereign Academy

This file provides core context for **Google Antigravity (Gemini)** regarding
the project's architecture, current tech stack, and design rules. Always read
this file in full before making any changes.

## Tech Stack

| Layer              | Technology                      | Version | Purpose                                         |
| ------------------ | ------------------------------- | ------- | ----------------------------------------------- |
| **Framework**      | Fresh                           | 2.x     | Server-side rendering + routing                 |
| **Bundler**        | Vite                            | 7.x     | MDX compilation, HMR, asset bundling            |
| **UI Library**     | Preact                          | 10.x    | Component rendering                             |
| **Core Engine**    | Rust + WebAssembly              | -       | High-performance math logic                     |
| **Content Engine** | MDX                             | 3.x     | Lesson files with inline JSX                    |
| **Math (SSR)**     | MathJax (`rehype-mathjax`)      | 7.1.0   | Converts LaTeX `$` blocks → native MathML       |
| **Math (Client)**  | MathLive                        | 0.108.3 | Interactive virtual math keyboard (Island)      |
| **Database**       | PGlite (`@electric-sql/pglite`) | 0.3.15  | WASM PostgreSQL; offline-first student progress |
| **Desktop**        | Tauri 2.0 _(future)_            | -       | Native Windows/Mac/iOS/Android wrapper          |

## Architectural Data Flow

1. **Virtual MDX Router**: The project uses a "Bulletproof" virtual router
   inside `main.ts` and `mdx-routes.ts`. It auto-discovers `.mdx` files via
   Vite's `import.meta.glob`. It intercepts requests starting with `/learn/`,
   handles URL normalization, and renders components directly on the server.
   - **Rule:** Do NOT use physical `routes/learn/` files. Keep all lesson
     content in `curriculums/`.

2. **Content Collections**: Educational content is strictly separated from
   application logic.
   - Lessons are stored in `curriculums/[subject]/[grade]/[unit]/[topic].mdx`.
   - The virtual router serves them under the `/learn/` URL prefix.

3. **Math Rendering (Two-Layer)**:
   - **Server-Side (MathJax)**: `rehype-mathjax` in the Vite/MDX pipeline
     intercepts `$...$` and `$$...$$` LaTeX blocks and compiles them to native
     browser MathML at build/render time. Zero client-side JS needed.
   - **Client-Side (MathLive)**: The `islands/MathInput.tsx` Island wraps the
     `<math-field>` custom web component. This is the interactive keyboard for
     student quiz input.

4. **Local Database (PGlite)**: Student progress (quiz answers, mastery, lesson
   completion) is stored in `@electric-sql/pglite` running as WASM inside the
   browser. No backend server required for data storage.

5. **Rust WASM Integration**: Logic lives in `/wasm/src/lib.rs`, compiled to
   `/wasm/pkg/`. Interacts exclusively through `islands/` on the client side.

## Key File Map

| File                    | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `GEMINI.md`             | This file. AI agent context and rules.                |
| `SKILL.md`              | Step-by-step skill instructions for AI agents.        |
| `ARCHITECTURE.md`       | Deep-dive system design documentation.                |
| `CONTRIBUTING.md`       | Rules for humans and AI adding content or features.   |
| `workflow.md`           | Quick-start guide for curriculum authors.             |
| `vite.config.ts`        | MDX pipeline config: MathJax, GFM, remark-math.       |
| `deno.json`             | All dependency imports and Deno tasks.                |
| `mdx-routes.ts`         | Auto-discovery of `.mdx` files via Vite glob.         |
| `main.ts`               | Virtual `/learn/` route interception logic.           |
| `islands/MathInput.tsx` | Interactive MathLive keyboard island.                 |
| `curriculums/`          | All lesson content (MDX). Never put logic here.       |
| `routes/`               | Application shell pages (grade overview, home, etc.). |
| `components/`           | Shared static UI components (no interactivity).       |
| `assets/styles.css`     | Global CSS. Processed by Vite.                        |
| `wasm/src/lib.rs`       | Rust source for the WASM engine.                      |

## MDX v3 Syntax Rules (CRITICAL — Violations Cause 500 Errors)

The MDX v3 parser treats `{` and `}` as JavaScript expression delimiters.
Violating these rules will crash the server with an "Unexpected end of file in
expression" error.

| ❌ Incorrect             | ✅ Correct                                                                 |
| ------------------------ | -------------------------------------------------------------------------- |
| `$\text{Yes!}$`          | `$\text{Yes!}$` — only crashes if nested `{}`. Rephrase text outside math. |
| `$\boxed{?}$`            | `$? $` or `$\square$` — never put `{?}` in math.                           |
| `$\underbrace{x}_{}$`    | Break into text: `20 + 5` (use markdown instead).                          |
| `$<$` or `$>$` (inline)  | `$ < $` or `$ > $` — pad with spaces to prevent JSX tag misparse.          |
| Unicode `¢`, `—` in math | Spell out: `\text{cents}`, or use `-` instead of em-dash.                  |

## Style & Location Guidelines

- **System Layouts & UI**: `.tsx` in `/routes/`.
- **Interactive Components**: `.tsx` in `/islands/` only.
- **Text-Heavy Content**: `.mdx` in `/curriculums/`.
- **CSS**: Global styles in `/assets/styles.css` (processed by Vite).
- **Do NOT use Tailwind CSS** — project uses Vanilla CSS with CSS custom
  properties (variables).
