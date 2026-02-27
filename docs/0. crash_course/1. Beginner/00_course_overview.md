# ================================================================================ THE COMPLETE DENO FRESH BOOTCAMP: FROM ZERO TO HERO

# Instructor: GitHub Copilot Level: Beginner Estimated Time: 3-4 hours total Project: A fully working interactive web app with MDX pages & Preact Islands

Welcome to the course! This bootcamp is designed to be your single complete
reference for the exact tech stack running inside this project:

Deno 2.x + Fresh 2.x + Vite + Preact + MDX 3 + KaTeX

We learn by doing. Each module explains the WHAT, the WHY, and the HOW, then
shows you real code from THIS repository so you can immediately see it in
action.

---

## WHY THIS STACK? (THE BIG PICTURE)

Most JavaScript web apps suffer from one problem: JavaScript bloat. A typical
React + Next.js app ships hundreds of kilobytes of JS to the user's browser just
to display a blog post. Users on slow connections suffer the most.

This stack was chosen to solve that problem from the ground up:

1. Deno -> Secure, fast, TypeScript-first runtime. No config needed.
2. Fresh 2.x -> Web framework that ships ZERO JS by default.
3. Preact -> 3KB alternative to React. Same API, much smaller.
4. Vite -> Lightning-fast build tool with instant Hot Reloads.
5. MDX 3 -> Write rich content in Markdown, embed Preact components in it.
6. KaTeX -> Render beautiful math equations (like LaTeX) in the browser.

Result: Pages that load instantly because they are pure HTML until JavaScript is
actually needed (and then only the minimum required is loaded).

---

## COURSE SYLLABUS

The course is divided into 4 modules + a hands-on project:

MODULE 1: Deno Basics --> 01_deno_basics.txt +--> What is Deno and why it was
created +--> Side-by-side comparison with Node.js +--> Deep dive into deno.json
(tasks, imports, compilerOptions) +--> The permission system explained with
examples +--> How Deno handles npm packages via the import map

MODULE 2: Fresh & Islands Architecture --> 02_fresh_and_islands.txt +--> What
Fresh is and how it differs from Next.js / Remix +--> Server-Side Rendering
(SSR) from first principles +--> The Islands Architecture in detail with visual
diagrams (ASCII art) +--> Preact Signals: The state management system used in
this project +--> The lifecycle: request -> server render -> browser hydration

MODULE 3: Routing & MDX Magic --> 03_routing_and_mdx.txt +--> File-system
routing: static, dynamic, catch-all, and API routes +--> How MDX 3 works under
the hood (the compilation pipeline) +--> The MDX registry pattern used in THIS
project (mdx-routes.ts) +--> Embedding Islands inside MDX files with code
examples +--> Math rendering with remark-math + KaTeX

MODULE 4: Hands-On Project --> 04_hands_on_project.txt +--> Step-by-step: build
a static component (WarningBox) +--> Step-by-step: build an interactive Island
(SecretToggle) +--> Step-by-step: compose them in a new MDX page +--> Common
errors and how to fix them +--> Next steps and further learning resources

MODULE 5: TypeScript & JSX for Beginners --> 05_typescript_and_jsx.txt +--> What
TypeScript adds on top of JavaScript +--> Basic types: string, number, boolean,
union types +--> Interfaces: defining the shape of component props +--> JSX vs
HTML: className, self-closing tags, inline styles +--> Embedding expressions {}
in JSX, conditional rendering, lists +--> Reading a real .tsx file from this
project (Counter.tsx walkthrough)

MODULE 6: Vite Config & Styling --> 06_vite_config_and_styling.txt +--> What
Vite does and what Hot Module Replacement (HMR) means +--> vite.config.ts
explained line by line +--> Plugin order and why it matters +--> 3 ways to style
components: global CSS, inline styles, utility classes +--> Full reference of
existing utility classes in assets/styles.css +--> How the KaTeX CSS is loaded
and how to self-host it

---

## PREREQUISITES

Before starting, make sure you have the following installed:

1. Deno 2.x Installation: https://deno.com Verify: Run `deno --version` in your
   terminal. Expected output: deno 2.x.x (release, ...)

2. VS Code (Recommended Editor) Install the official Deno extension:
   denoland.vscode-deno This gives you TypeScript IntelliSense for Deno imports.

3. Basic Knowledge Needed:
   - HTML: You know what <div>, <h1>, <p>, <button> are.
   - CSS: You can write a basic style rule.
   - JavaScript: You understand variables, functions, and arrow functions.
   - TypeScript is a BONUS, not required. We will explain types as we go.

---

## HOW TO FOLLOW THIS COURSE

1. Read each module's .txt file in order.
2. Open the actual source files in VS Code as you read about them.
3. Make small changes, save the file, and watch the browser auto-update! (This
   is the power of `deno task dev` / Vite Hot Module Replacement)
4. Complete the hands-on project in Module 4.

Grab a cup of coffee. Open `deno task dev` in your terminal. Let's go!
