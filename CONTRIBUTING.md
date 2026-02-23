# Contributing to Sovereign Academy

Welcome! This guide covers the standards for writing curriculum content and
developing new application features.

> **AI Agents**: Please read `GEMINI.md` and `SKILL.md` before making any
> changes to this project.

---

## Part 1: Writing Curriculum Content

All lessons are written in **MDX3** (Markdown + JSX).

### File Organization

Content lives in `curriculums/`. Structure it by subject, grade, and unit:

```
curriculums/
  math/
    grade_1/
      unit_1_place_value/
        introduction.mdx   ← Unit overview
        1_numbers.mdx
        2_counting.mdx
        quiz.mdx           ← Placed last (non-numbered)
```

### File Naming Rules

- Use lowercase with underscores: `1_numbers_from_1_to_9.mdx`.
- Number lessons to control sidebar order: `1_`, `2_`, `3_`.
- `introduction.mdx` is always shown first.
- `quiz.mdx` / `test.mdx` are always shown last.

### Writing Math (CRITICAL RULES)

Math is written in LaTeX and converted to MathML automatically by MathJax at
render time.

- **Inline math**: `$x + y = z$`
- **Block math**: `$$ax^2 + bx + c = 0$$`

**Forbidden Patterns (cause 500 server errors):**

| ❌ Do NOT write                       | ✅ Write instead                  |
| ------------------------------------- | --------------------------------- |
| `$\boxed{?}$`                         | `$\square$`                       |
| `$\text{answer!}$` with special chars | Plain text outside the `$$` block |
| `$a<b$` (unpadded `<`)                | `$a < b$`                         |
| `$25¢$` (Unicode cent)                | `$25 \text{ cents}$`              |
| `$1\;—\;2$` (em-dash)                 | `$1 \;-\; 2$`                     |

### Adding Interactive Practice

To add a student input box (virtual math keyboard), import the MathLive Island:

```mdx
import MathInput from "../../islands/MathInput.tsx";

## Practice

Solve: $x + 3 = 7$

<MathInput />
```

---

## Part 2: Developing New Features

### Tech Stack

| Layer         | Tool                       |
| ------------- | -------------------------- |
| Framework     | Fresh 2.x + Deno           |
| Bundler       | Vite 7.x                   |
| UI            | Preact 10.x                |
| Styling       | Vanilla CSS (no Tailwind)  |
| Math (SSR)    | MathJax (`rehype-mathjax`) |
| Math (Client) | MathLive (Islands only)    |
| Database      | PGlite WASM (Islands only) |
| WASM Logic    | Rust (`wasm-pack`)         |

### Where to Put Code

| What you're building             | Where it goes           |
| -------------------------------- | ----------------------- |
| Static page or layout            | `routes/*.tsx`          |
| Shared non-interactive component | `components/*.tsx`      |
| Interactive component (needs JS) | `islands/*.tsx`         |
| Database / WASM logic            | Inside `islands/*.tsx`  |
| Lesson content                   | `curriculums/.../*.mdx` |

### Creating a New Island

1. Create `islands/MyFeature.tsx`.
2. Export a single default Preact component.
3. Use `useEffect` for side effects (DB reads, WASM calls).
4. Import and use in an `.mdx` file or a route template.

### Rebuilding Rust WASM

After editing `wasm/src/lib.rs`, run:

```bash
cd wasm && wasm-pack build --target web
```

---

## Part 3: Documentation Standards

- Keep all documentation in `docs/` (numbered, e.g., `01_intro.md`).
- Architecture decisions go in `ARCHITECTURE.md`.
- Skill instructions for AI go in `SKILL.md`.
- AI context and rules go in `GEMINI.md`.
