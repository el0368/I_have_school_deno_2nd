# Sovereign Academy

A next-generation, offline-first educational platform built with Deno, Fresh 2.x, and Vite. Students learn at their own pace with server-rendered math lessons, interactive virtual keyboards, and progress stored locally in the browser.

## 📊 Project Status

| Area | Status | Notes |
|---|---|---|
| K-2 Math Curriculum | ✅ Complete | 113 MDX lessons (Grade 1–2 fully authored) |
| Math Rendering (MathJax) | ✅ Complete | LaTeX → MathML at build time |
| Interactive Math Input (MathLive) | ✅ Complete | Virtual keyboard island |
| Answer Checking API (`/api/math/check`) | ✅ Complete | Calls Rust math engine |
| Lesson Navigation | ✅ Complete | Prev/next + grade overview links |
| Local Progress (PGlite) | ✅ Complete | PostgreSQL WASM in browser |
| Math Engine (Rust + Axum) | ✅ Complete | Runs separately on port 8080 |
| Grades 3–8 Curriculum | 🚧 Skeleton | Index pages only, no lesson content yet |
| User Authentication | 🚧 Incomplete | Routes scaffolded, logic not wired |
| Admin Dashboard | 🚧 Incomplete | Directories created, no implementation |
| Subscription / Billing | 🚧 Incomplete | Directories created, no implementation |
| Database Migrations | 🚧 Incomplete | Schema defined, no migration files |

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Fresh | 2.x |
| Bundler | Vite | 7.x |
| UI Library | Preact | 10.x |
| Content Engine | MDX | 3.x |
| Math (SSR) | MathJax (`rehype-mathjax`) | 7.1.0 |
| Math (Client) | MathLive | 0.108.3 |
| Database | PGlite (`@electric-sql/pglite`) | 0.3.15 |
| Math Engine | Rust + Axum | — |
| WASM Bindings | Rust + WebAssembly | — |

## 🚀 Getting Started

```bash
# Copy environment template and fill in values
cp .env.example .env

# Run the development server
deno task dev
```

The math engine (Rust) must be running for answer-checking to work:

```bash
# In a separate terminal
deno task math
```

## 🧪 Tests

```bash
# Run all tests (unit + smoke)
deno task test
```

## 📖 Documentation

- [**Architecture Guide**](./ARCHITECTURE.md) - How the system works end-to-end.
- [**Contribution Guide**](./CONTRIBUTING.md) - How to add new lessons.
- [**Project Context (AI)**](./GEMINI.md) - Guidelines for AI agents working in this repo.

## 📁 Key Directories

```
curriculums/   Lesson content (.mdx) — the source of truth for all subjects
routes/        Fresh page routes (home, curriculum explorer, practice, APIs)
islands/       Interactive client components (MathInput, MarkCompleteButton, …)
components/    Shared static UI components
db/            PGlite schema and seed scripts
math_engine/   Rust + Axum server for symbolic math evaluation
wasm/          WASM bindings compiled from Rust
tests/         Unit, integration, and E2E test suites
```
