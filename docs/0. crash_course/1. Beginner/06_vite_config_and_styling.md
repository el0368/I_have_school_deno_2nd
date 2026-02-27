# ================================================================================ MODULE 6: VITE CONFIG & STYLING IN FRESH

Estimated Time: 30 minutes Learning Objectives:

- Understand what vite.config.ts does and how to read it
- Understand what each plugin in the config does
- Know the 3 ways to add CSS/styles in this project
- Know how to use the global stylesheet (assets/styles.css)
- # Add new utility CSS classes and use them in components

---

## LESSON 1: WHAT IS VITE AND WHAT DOES IT DO?

Vite is the BUILD TOOL for this project. Think of it as the factory that:

1. Takes your raw source files (.ts, .tsx, .mdx, .css)
2. Processes them through plugins (MDX compiler, Fresh, etc.)
3. Serves them in development with instant Hot Module Replacement (HMR)
4. Bundles and optimises them for production

You interact with Vite through two commands: `deno task dev` -> Starts Vite in
development mode (uses vite.config.ts) `deno task build` -> Runs Vite's
production build

Vite is configured by `vite.config.ts` in the project root. Without this file,
none of the MDX or Fresh features would work.

HOT MODULE REPLACEMENT (HMR): This is one of Vite's most loved features. When
you save a file:

- Vite detects the change
- It recompiles ONLY the changed file (not the whole project)
- It injects the new code into the browser WITHOUT a full page reload
- Your browser updates in under 100ms while preserving your app's state

Practical example: You are looking at the Counter page with count = 5. You
change a CSS class in Counter.tsx and save.

- WITHOUT HMR: Page reloads, counter resets to 0.
- WITH HMR: Only the CSS updates, counter stays at 5.

---

## LESSON 2: READING vite.config.ts LINE BY LINE

Open vite.config.ts in the project root. Here is what every line means:

import { defineConfig } from "vite"; // defineConfig is a helper that gives you
TypeScript autocomplete // when writing your config. It doesn't change the
config's behaviour.

import { fresh } from "@fresh/plugin-vite"; // The Fresh framework plugin for
Vite. This connects Fresh's routing // system to Vite's development server and
build process. // Without this, Fresh routes would not work.

import mdx from "@mdx-js/rollup"; // The MDX 3 compiler plugin. This tells Vite
how to process .mdx files. // Without this, importing .mdx files would throw an
error.

import remarkMath from "remark-math"; // A "remark" plugin (remark processes
Markdown). // This one specifically adds support for $math$ syntax.

import rehypeKatex from "rehype-katex"; // A "rehype" plugin (rehype processes
HTML). // After remark-math identifies math expressions, rehype-katex converts
// them to proper KaTeX HTML. This is what makes math LOOK good.

export default defineConfig({ plugins: [ mdx({ jsxImportSource: "preact", //
Tells MDX: when you find JSX in a .mdx file, use Preact's factory // functions
(h, Fragment) to create elements. Without this, MDX // would try to use React by
default and fail.

        remarkPlugins: [remarkMath],
        //  Pass remark-math as a plugin to the MDX compiler's remark pipeline.
        //  This enables $...$ and $$...$$ math syntax in .mdx files.
        
        rehypePlugins: [rehypeKatex],
        //  Pass rehype-katex as a plugin to the MDX compiler's rehype pipeline.
        //  This renders the identified math expressions to KaTeX HTML.
      }),
      fresh(),
      //  The Fresh plugin must come AFTER the MDX plugin so that MDX files
      //  are processed into Preact components BEFORE Fresh tries to serve them.
      //  Plugin ORDER matters in Vite!
    ],

});

PLUGIN ORDER RULE: In Vite, plugins run in the order they are listed. Think of
it as an assembly line: [File] -> MDX Plugin -> Fresh Plugin -> [Rendered HTML]
If Fresh ran first, it would not know how to handle .mdx files. Always put
transformation plugins (MDX) BEFORE framework plugins (Fresh).

---

## LESSON 3: THE 3 WAYS TO STYLE IN THIS PROJECT

This project supports three styling approaches. You can mix them freely.

---

## APPROACH 1: GLOBAL CSS STYLESHEET (assets/styles.css)

The file `assets/styles.css` is loaded globally for every page. It contains CSS
reset rules (to normalise browser differences) and some pre-defined utility
classes.

To add a new reusable style, simply add it to this file:

/* Add to assets/styles.css */ .card { border: 1px solid #e5e7eb; border-radius:
8px; padding: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }

Then use it in any component:

<div class="card">Content here</div>

HOW IT IS LOADED: Fresh automatically serves everything in the `static/` and
`assets/` folders. Vite imports `assets/styles.css` as part of the build
pipeline, injects it as an inline `<style>` tag inside the `<head>` of every
page. You do NOT need to manually link it in `_app.tsx` - Vite handles it.

---

## APPROACH 2: INLINE STYLES (Quick & Component-Scoped)

You can write styles directly on any JSX element using the `style` prop. This is
useful for one-off styles that don't need to be reused.

<div style={{
    backgroundColor: "#f0fdf4",
    border: "2px solid #16a34a",
    padding: "16px",
    borderRadius: "8px",
  }}>
    Content
  </div>

INLINE STYLE RULES (important!):

1. The value of `style` is a JAVASCRIPT OBJECT (hence the double {{ }}).
2. CSS property names are camelCase: `background-color` -> `backgroundColor`
3. Pixel values can be numbers OR strings: `padding: 16` OR `padding: "16px"`
4. Non-pixel values must be strings: `opacity: 0.5` (number is fine for opacity)
5. Colors are strings: `color: "red"` or `color: "#dc2626"`

Common traps: WRONG: style="color: red" (this is HTML syntax, not JSX) WRONG:
style={{ "color": "red" }} (works but unusual) RIGHT: style={{ color: "red" }}

---

## APPROACH 3: UTILITY CLASSES FROM assets/styles.css

The project includes handwritten utility classes in `assets/styles.css`. These
are small, single-purpose class names (inspired by Tailwind CSS).

EXISTING CLASSES IN THIS PROJECT: Layout: .mx-auto -> margin-left: auto;
margin-right: auto; (centres element) .mx-2 -> margin: 0 0.5rem .my-4 -> margin:
1rem 0 .my-6 -> margin: 1.5rem 0 .px-4 -> padding: 0 1rem .py-1 -> padding:
0.25rem 0 .py-6 -> padding: 1.5rem 0 .py-8 -> padding: 2rem 0 .max-w-screen-md
-> max-width: 768px

Flexbox: .flex -> display: flex .flex-col -> flex-direction: column
.items-center -> align-items: center .justify-center -> justify-content: center
.gap-8 -> gap: 2rem

Typography: .text-3xl -> font-size: 1.875rem .text-4xl -> font-size: 2.25rem
.font-bold -> font-weight: 700 .tabular-nums -> font-variant-numeric:
tabular-nums

Appearance: .bg-white -> background-color: white .bg-[#86efac] ->
background-color: #86efac (green) .border-2 -> border-width: 2px
.border-gray-500 -> border-color: #6b7280 .rounded-sm -> border-radius: 0.25rem
.min-h-screen -> min-height: 100vh

Interaction: .hover\:bg-gray-200:hover -> background-color: #e5e7eb on hover
.transition-colors -> smooth color transition on hover

Special: .fresh-gradient -> A green-to-yellow gradient background (used on
homepage)

USAGE EXAMPLE - styling the existing page layout: Open routes/index.tsx and look
at the main container div:

<div class="px-4 py-8 mx-auto max-w-screen-md"> // px-4: adds horizontal padding
// py-8: adds vertical padding // mx-auto: centres the div horizontally //
max-w-screen-md: caps the width at 768px so long lines aren't too wide

---

## LESSON 4: ADDING NEW STYLES — STEP BY STEP

Want to add a new style? Here is the decision process:

SCENARIO A: You want a quick one-off style that won't be reused. -> Use inline
styles on the element directly. Example: A specific margin only on one element.

<p style={{ marginTop: "24px" }}>Only this paragraph needs extra space.</p>

SCENARIO B: You want a reusable style used in many components. -> Add a CSS
class to `assets/styles.css` and use it with `class=`. Example: Adding a
`.highlight` class: /* In assets/styles.css _/ .highlight { background-color:
#fef9c3; border-left: 4px solid #eab308; padding: 8px 12px; } /_ Then in your
component: */

<p class="highlight">This text is highlighted!</p>

SCENARIO C: You are on a page/component and just want Vite's existing classes.
-> Use the existing utility classes from the list in Lesson 3. Example: Centre a
block of content.

<div class="flex flex-col items-center py-8">...</div>

---

## LESSON 5: THE KaTeX CSS — SPECIAL CASE

Math rendering requires a special CSS file from the KaTeX library. Unlike the
project's own CSS, this is loaded via a CDN link in `_app.tsx`:

<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
  />

This link is placed in the `<head>` of `_app.tsx` so it loads for EVERY page.
The KaTeX CSS defines the visual appearance of rendered math equations. Without
it, your math would render as unstyled, ugly text.

If you ever need to work offline or self-host the CSS, you can:

1. Download katex.min.css from the KaTeX releases.
2. Place it in the `static/` folder.
3. Change the href to "/katex.min.css".

---

## QUIZ TIME!

Q1: You have this CSS property: `border-bottom-color`. How do you write it in a
JSX inline style object? A1: borderBottomColor: "value" (Remove hyphens,
capitalise each word after the first - camelCase)

Q2: You add a new class `.badge` to assets/styles.css. You use it in a
component: <span className="badge">New!</span> But the style does not appear.
What is wrong? A2: In Fresh/Preact components, use `class` not `className` for
applying styles from your stylesheet. (`className` works too but `class` is the
Fresh/Vite convention in this project.) Change: <span class="badge">New!</span>

Q3: What is the KaTeX CSS for and where is it loaded? A3: The KaTeX CSS makes
math equations look correct (proper symbols, sizing, spacing). It is loaded in
`routes/_app.tsx` via a CDN <link> tag so it applies to every page in the
project.

Q4: You move the `fresh()` plugin BEFORE the `mdx()` plugin in vite.config.ts.
What breaks? A4: MDX files stop working. Fresh would try to handle .mdx files
before the MDX compiler processes them. Since Fresh doesn't know how to deal
with raw MDX, it would either throw an error or return a 404.

COURSE COMPLETE! You have now finished all 6 modules. Go build something great!
