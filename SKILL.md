---
name: Sovereign Academy Development Skills
description: Step-by-step skills for AI agents working on Sovereign Academy. Covers Rust WASM, MDX authoring, MathLive islands, and PGlite database integration.
---

# Sovereign Academy: AI Agent Skills

Always read `GEMINI.md` before applying any skill in this file.

---

## Skill 1: Building and Reloading Rust WASM

When editing `wasm/src/lib.rs`, the WASM module must be recompiled before the
browser can see the changes.

**Action**: Immediately after writing or editing any Rust code, run:

```bash
cd wasm && wasm-pack build --target web
```

The compiled output lands in `wasm/pkg/`. Import the `init` function from
`wasm/pkg/wasm.js` inside a Preact Island.

---

## Skill 2: Managing MDX Routes

- **Standard routes**: Drop `.mdx` files into `routes/`. They are discovered
  automatically.
- **Curriculum lessons**: Place content in
  `curriculums/[subject]/[grade]/[unit]/[topic].mdx`. The virtual `/learn/`
  router handles URL mapping.
- **Never** create physical files inside `routes/learn/`. This will conflict
  with the virtual router.

---

## Skill 3: Writing MDX Lessons (Critical Safety Rules)

The MDX v3 parser is strict. Follow these rules to prevent 500 server errors:

1. **Curly braces `{}` are JSX expressions.** Never put raw `{` or `}` inside a
   LaTeX math block:
   - ❌ `$\boxed{?}$` → ✅ `$\square$` or `$?$`
   - ❌ `$\underbrace{x}_{}$` → ✅ Rewrite as plain text outside the math block.

2. **Comparison operators need space padding** in inline math to avoid MDX
   treating `<` as an HTML tag:
   - ❌ `$a<b$` → ✅ `$a < b$`

3. **Avoid Unicode symbols** inside math blocks:
   - ❌ `25¢`, `—` (em-dash) → ✅ `\text{cents}`, `-` (hyphen)

4. **Avoid LaTeX `\text{...}` with complex content** that contains special
   chars; rephrase as plain Markdown outside the `$$` block instead.

---

## Skill 4: Adding Interactive Math Input (MathLive Island)

To embed an interactive math keyboard for students to type answers:

1. Import `MathInput` at the top of the `.mdx` file:
   ```mdx
   import MathInput from "../../islands/MathInput.tsx";
   ```
2. Drop the Island into the lesson where the student should type:
   ```mdx
   <MathInput />
   ```
3. **Do not** add MathLive directly to a `.tsx` component file — it must stay in
   `islands/` because it requires client-side JS hydration.

The Island emits both `math-ml` and `latex` string values from its event
listeners. These can be wired to the WASM validation engine or PGlite.

---

## Skill 5: Integrating PGlite (Local Offline Database)

PGlite is WASM PostgreSQL. It runs inside the browser with no server required.

- **Package**: `@electric-sql/pglite` (installed in `deno.json`)
- **Use in Islands only**: PGlite must run in a Preact Island (client-side),
  never in server-rendered routes.
- **Storage**: By default uses in-memory storage. For persistence, configure
  with `indexeddb://` target.

Basic usage inside an Island:

```typescript
import { PGlite } from "@electric-sql/pglite";
const db = new PGlite("idb://sovereign-progress");
await db.exec(`
  CREATE TABLE IF NOT EXISTS progress (
    lesson TEXT PRIMARY KEY,
    completed BOOLEAN,
    score INTEGER
  );
`);
```

---

## Skill 6: Creating a Preact Island

Islands live in `islands/`. They hydrate on the client side only.

- Use `useEffect` for side effects and WASM/DB initialization.
- Use `@preact/signals` for reactive shared state between islands.
- Export a single default component from each island file.
- The file name becomes the island identifier (e.g., `islands/MathInput.tsx` →
  `<MathInput />`).
