# ================================================================================ UNDERSTANDING DENO.JSON

The "deno.json" file is the configuration file for your Deno project. It
functions similarly to "package.json" in Node.js projects but is more
streamlined and integrated directly into the runtime.

---

1. PRIMARY USES

---

- IMPORT MAPS: Defines aliases for modules. Instead of using long URLs, you can
  use shorthand (e.g., "fresh" instead of "jsr:@fresh/core@^2.2.0").

- TASKS: Defines custom commands you can run. Example: "deno task dev" runs the
  development server.

- LINTING & FORMATTING: Configures rules for how your code should be styled and
  checked for potential errors.

- COMPILER OPTIONS: Tells Deno how to handle TypeScript and JSX (e.g., which
  library to use for rendering HTML elements).

---

2. KEY SECTIONS IN THIS PROJECT

---

- "tasks": Contains common workflows like "dev", "build", and "start".

- "imports": Lists all dependencies (Preact, Fresh, Vite, etc.) and their
  versions.

- "compilerOptions": Configures Preact for JSX pre-compilation, which makes the
  app faster.

---

3. MODES

---

Deno typically runs in a "secure by default" mode. Settings in "deno.json" can
help automate permission flags or exclude certain folders (like "_fresh/") from
being processed.

================================================================================
