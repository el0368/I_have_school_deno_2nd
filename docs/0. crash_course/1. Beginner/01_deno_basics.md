# ================================================================================ MODULE 1: DENO BASICS

Estimated Time: 30 minutes Learning Objectives:

- Understand what Deno is and why it was created
- Know the key differences between Deno and Node.js
- Read and understand every field in the project's deno.json file
- # Know how to run tasks and what each task does

---

## LESSON 1: WHAT IS DENO AND WHY DOES IT EXIST?

Deno is a modern, secure runtime for JavaScript and TypeScript. A "runtime" is
the engine that actually RUNS your code on the computer.

You may already know Node.js. Deno was created by the SAME person: Ryan Dahl. In
2018, Ryan gave a famous talk called "10 Things I Regret About Node.js" and
announced Deno as his attempt to fix those mistakes. Here are the 3 biggest
ones:

REGRET 1: Node uses a non-standard module system (require / CommonJS). -> Fix:
Deno uses standard ES Modules (`import/export`), just like browsers.

REGRET 2: Node has no security. Any script can read your files and network. ->
Fix: Deno is SECURE BY DEFAULT. Code has ZERO permissions unless you grant them
explicitly with flags like --allow-read, --allow-net, --allow-env.

REGRET 3: Node required npm and a `node_modules` folder for every project. ->
Fix: Deno can import from URLs or use a central cache. No node_modules mess.
(Deno 2.x added full npm compatibility, so you get the best of both worlds.)

KEY FEATURE SUMMARY:

Feature Node.js Deno 2.x

---

Language JavaScript (JS only) TypeScript + JavaScript native Security None by
default Sandboxed by default Module System CommonJS (require) ES Modules
(import/export) Package Manager npm / yarn / pnpm Built-in + npm compatible
Formatter Needs Prettier (install) Built-in: `deno fmt` Linter Needs ESLint
(install) Built-in: `deno lint` Test Runner Needs Jest (install) Built-in:
`deno test` Standard Library npm packages jsr:@std/* (official)

---

## LESSON 2: DENO PERMISSIONS EXPLAINED

This is one of the most important concepts in Deno.

Imagine you download a random npm package. Silently, it could:

- Read files from your hard drive (steal SSH keys, passwords)
- Make network requests (send data to a remote server)
- Run sub-processes (execute other programs)

Deno prevents this. Every permission must be explicitly granted:

Flag What it allows

---

--allow-read Read files from disk --allow-write Write files to disk --allow-net
Make network requests / open a server port --allow-env Read environment
variables --allow-run Run sub-processes --allow-all (-A) Grant ALL permissions
(use for trusted dev tools only)

In this project, we run the dev server with `deno task dev` which internally
uses vite (a trusted build tool). The task runner uses -A for convenience, which
is acceptable for local development tools.

REAL EXAMPLE from this project's deno.json: "dev": "vite"

When you run `deno task dev`, Deno launches Vite which needs network access (to
serve pages on localhost), file read access (to read your source files), and
file write access (to write build artifacts). Vite handles all of this.

---

## LESSON 3: DEEP DIVE INTO deno.json

Open `deno.json` in your project root. Let's go through EVERY section:

## "nodeModulesDir": "manual"

This tells Deno to use a local `node_modules` folder (like Node.js) instead of
Deno's global cache. We need this because Vite (our build tool) is a
Node.js-style tool that expects a local node_modules folder to exist.

## "tasks": { ... }

These are like npm scripts. Run them with `deno task <name>`.

    "dev"   -> "vite"
    Starts the Vite development server. This is the command you use most.
    Vite scans `vite.config.ts`, loads all plugins (MDX, Fresh), and starts
    a local HTTP server at http://127.0.0.1:5173 (or the next available port).
    It also watches your files and Hot-Reloads the browser on save.

    "build" -> "vite build"
    Compiles your entire project into optimised static files in `_fresh/`.
    Run this before deploying to production.

    "start" -> "deno serve -A _fresh/server.js"
    Runs the PRODUCTION server (after you have built). Do NOT use this for
    development because it does not hot-reload.

    "check" -> "deno fmt --check . && deno lint . && deno check"
    Runs the full quality pipeline:
      1. `deno fmt --check`  -> Checks code formatting (does NOT auto-fix)
      2. `deno lint`         -> Checks for code style issues
      3. `deno check`        -> Full TypeScript type-checking
    Run this before committing code.

## "imports": { ... } (the Import Map)

This is the most important section for day-to-day coding. Instead of typing full
package URLs everywhere in your .ts/.tsx files, you define SHORT NAMES here and
use those in your code.

EXAMPLE: Without an import map, you would write: import { h } from
"npm:preact@^10.27.2";

WITH the import map (since "preact": "npm:preact@^10.27.2" is defined), you can
just write: import { h } from "preact";

Key imports in this project and what they are:

    "fresh"             --> The Fresh 2.x web framework
    "preact"            --> The Preact UI library (like React but 3KB)
    "@preact/signals"   --> Preact's state management library
    "@fresh/plugin-vite"--> Connects Fresh with the Vite build tool
    "@mdx-js/rollup"    --> The MDX 3 compiler plugin for Vite/Rollup
    "@mdx-js/preact"    --> Preact JSX runtime adapter for MDX
    "remark-math"       --> Parses $math$ syntax in MDX/Markdown
    "rehype-katex"      --> Renders parsed math into KaTeX HTML
    "vite"              --> The Vite build tool itself

## "compilerOptions": { ... }

Configures the TypeScript compiler that Deno uses internally.

    "lib": ["dom", "dom.asynciterable", "dom.iterable", "deno.ns"]
    Tells TypeScript which type definitions to load. "dom" gives you types for
    browser APIs (document, window, etc.). "deno.ns" gives you Deno-specific
    types (Deno.readFile, etc.).

    "jsx": "precompile"
    This is a special Fresh/Deno mode. Instead of transforming JSX at runtime,
    Deno pre-compiles JSX to optimised function calls at build time.
    This makes server rendering significantly faster.

    "jsxImportSource": "preact"
    Tells the JSX compiler to use Preact's factory functions (h, Fragment)
    instead of React's. This is what makes <div>Hello</div> work with Preact.

---

## LESSON 4: RUNNING DENO COMMANDS IN PRACTICE

Here are the commands you will use most often in this project:

Start development server:

> deno task dev

Add a new package (e.g. adding day.js for date formatting):

> deno install npm:dayjs (This updates deno.json imports and downloads the
> package.)

Check your code before committing:

> deno task check

Format your code automatically:

> deno fmt

Run tests:

> deno test

---

## QUIZ TIME!

Q1: You write a Deno script that reads a file. You run it with
`deno run script.ts`. Does it succeed? A1: NO. It throws a permission error. You
need `deno run --allow-read script.ts`.

Q2: You want to add the `zod` validation library to this project. What do you
type? A2: `deno install npm:zod` Deno will add `"zod": "npm:zod@x.x.x"` to your
deno.json imports.

Q3: `deno fmt` and `deno fmt --check` - what is the difference? A3: `deno fmt`
AUTO-FIXES formatting in your files. `deno fmt --check` only REPORTS issues,
does not change files. The `check` task uses `--check` so CI/CD pipelines don't
modify files.

Next up: Module 2 - Fresh & Islands Architecture!
