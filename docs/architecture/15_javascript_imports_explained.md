# ================================================================================ JAVASCRIPT IMPORTS: THE BRACKETS {} EXPLAINED

In JavaScript and TypeScript, the way you use the `import` statement depends on
how the other file "exports" its code.

---

1. NAMED IMPORTS (USING THE BRACKETS { ... })

---

When a file has multiple different functions, variables, or types that it wants
to share, it uses "Named Exports."

- WHY THE BRACKETS?: They tell JavaScript: "Go into that file and grab only
  these specific things by their exact name."

- EXAMPLES IN YOUR PROJECT: `import { signal, Signal } from "@preact/signals";`
  (The "signals" library has many features; here we are grabbing the `signal`
  function and the `Signal` type.)

  `import { Button } from "../components/Button.tsx";` (The Button file
  specifically named its export "Button".)

---

2. DEFAULT IMPORTS (NO BRACKETS)

---

When a file has one "main" thing it wants to share, it uses a "Default Export."

- WHY NO BRACKETS?: It tells JavaScript: "Just grab the main thing from this
  file and call it whatever I want."

- EXAMPLES IN YOUR PROJECT: `import Counter from "../islands/Counter.tsx";`
  (Inside `Counter.tsx`, it says `export default function Counter`. Since it is
  the _default_, you don't need brackets.)

  `import mdxRoutes from "./mdx-routes.ts";` (The routes registry is the primary
  export of that file.)

---

3. SUMMARY TABLE

---

| Code Style                   | Type of Export | Meaning                               |
| ---------------------------- | -------------- | ------------------------------------- |
| `import { X } from "./file"` | Named Export   | Grab the specific item named "X".     |
| `import X from "./file"`     | Default Export | Grab the one main thing in the file.  |
| `import type { X }`          | Type Import    | Grab only the "definition" (no code). |

---

# PRO TIP: If you try to use brackets on a default export (or vice-versa), the code will crash! Deno's compiler is very good at telling you exactly which one to use if you make a mistake.
