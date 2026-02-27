# ================================================================================ MODULE 3: ROUTING & MDX MAGIC

Estimated Time: 40 minutes Learning Objectives:

- Master all 4 types of Fresh routes (static, dynamic, API, catch-all)
- Understand how MDX 3 is compiled and rendered in this project
- Understand the MDX registry pattern (mdx-routes.ts) used here
- Add math equations to MDX pages using KaTeX
- # Confidently embed Islands into MDX files

---

## LESSON 1: FILE-SYSTEM ROUTING — ALL ROUTE TYPES

Fresh maps files in the `routes/` folder directly to URL paths. No configuration
file needed. The file name = the URL.

TYPE 1: STATIC ROUTES File: routes/index.tsx -> URL: / File: routes/about.tsx ->
URL: /about File: routes/docs/intro.tsx -> URL: /docs/intro

To create a static route, create a .tsx file and export a default function:

    // routes/about.tsx
    export default function AboutPage() {
      return (
        <div>
          <h1>About Us</h1>
          <p>We are building with Fresh!</p>
        </div>
      );
    }

TYPE 2: DYNAMIC ROUTES (URL Parameters) File: routes/[name].tsx -> URL:
/anything (name = "anything") File: routes/api/[name].tsx -> URL: /api/john
(name = "john") File: routes/blog/[slug].tsx -> URL: /blog/my-post

How to READ the parameter inside the component:

    // routes/api/[name].tsx (actual file in this project!)
    import { define } from "../../utils.ts";

    export const handler = define.handlers({
      GET(ctx) {
        const name = ctx.params.name;  // reads from the URL!
        return new Response(`Hello, ${name}!`);
      }
    });

Try it: Visit /api/mario in your browser -> Response: "Hello, mario!"

TYPE 3: API ROUTES (No UI, just data) Any route can return a raw Response
instead of rendering HTML. API routes typically live in routes/api/ and return
JSON.

    // routes/api/status.ts
    export const handler = define.handlers({
      GET(_ctx) {
        return new Response(
          JSON.stringify({ status: "ok", time: Date.now() }),
          { headers: { "Content-Type": "application/json" } }
        );
      }
    });

Visit /api/status to get: {"status":"ok","time":1234567890}

TYPE 4: THE _app.tsx LAYOUT (Special File) The file `routes/_app.tsx` is a
SPECIAL file. It wraps EVERY page in the app. It is the perfect place for your

<html>, <head>, global CSS links, and <body>.

Look at your actual `routes/_app.tsx`: export default define.page(function App({
Component }) { return (

<html>
<head>
<meta charset="utf-8" />
<title>I_have_school_deno_2nd</title>
<link rel="stylesheet" href="https://cdn.../katex.min.css" />
</head>
<body>
<Component /> {/* <-- This is where your page renders */}
</body>
</html> ); });

The `<Component />` slot is replaced with the content of whatever page the user
is visiting. This is how ALL pages share the same <head> setup.

---

## LESSON 2: MDX 3 — HOW IT WORKS UNDER THE HOOD

MDX stands for Markdown + JSX. It is a file format that lets you write Markdown
but also import and use Preact/React components inside it.

HOW MDX IS COMPILED (the pipeline):

1. You write `routes/hello.mdx` in standard Markdown syntax + JSX.
2. Vite picks it up because of the `@mdx-js/rollup` plugin in `vite.config.ts`.
3. The MDX compiler reads the file and does two things: a. Parses Markdown text
   (headings, paragraphs, lists) via `remark`. b. Parses math expressions like
   $E=mc^2$ via `remark-math`.
4. The parsed Markdown becomes Preact function calls (JSX under the hood).
   `# Hello` becomes `h('h1', null, 'Hello')` in the compiled output.
5. Math expressions are passed to KaTeX (via `rehype-katex`) which converts them
   to HTML with proper math rendering tags.
6. The final output is a normal Preact component that Fresh can render to HTML.

MATH SYNTAX: Inline math: Wrap in single dollar signs. $E = mc^2$ renders as the
famous Einstein equation inline in text.

Block math: Wrap in double dollar signs. $$
    \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
    $$

This renders as a full-width centered equation.

The KaTeX CSS is loaded globally in `routes/_app.tsx` via a CDN link, so all MDX
pages automatically get styled math without any extra setup.

---

## LESSON 3: THE MDX REGISTRY PATTERN (mdx-routes.ts)

Fresh's built-in file-system router handles `.tsx` files automatically. However,
`.mdx` files are NOT handled by Fresh's default router.

This project solves this with a CUSTOM MDX REGISTRY pattern. Look at
`mdx-routes.ts` in the project root:

const mdxRoutes: Record<string, () => Promise<{ default: ComponentType }>> = {
"/hello": () => import("./routes/hello.mdx"), "/test": () =>
import("./routes/test.mdx"), "/testmdx": () => import("./routes/testmdx.mdx"),
};

And in `main.ts`, a wildcard route checks this registry:

app.get("*", async (ctx) => { const path = new URL(ctx.req.url).pathname; const
mdxLoader = mdxRoutes[path]; // 1. Is this path in the registry? if (!mdxLoader)
return ctx.next(); // 2. No? Pass to next handler. const { default: MDXContent }
= await mdxLoader(); // 3. Import the MDX return
ctx.render(<div class="..."><MDXContent /></div>); // 4. Render it });

IMPORTANT: When you create a NEW .mdx file in routes/, you MUST ADD IT to
`mdx-routes.ts` for it to be accessible as a URL. This is by design - it gives
you explicit control over which MDX files become routes.

EXAMPLE: Adding a new MDX page:

1. Create: routes/notes.mdx
2. Register: Open mdx-routes.ts and add: "/notes": () =>
   import("./routes/notes.mdx"),
3. Visit: http://localhost:5174/notes

---

## LESSON 4: ADDING ISLANDS TO MDX — THE FULL PATTERN

Here is the EXACT pattern used in this project (`routes/testmdx.mdx`):

STEP 1: At the top of the .mdx file, use import statements. STEP 2: For state,
use `signal()` (NOT `useSignal()` - see Module 2, Lesson 5). STEP 3: Use the
Island as a JSX tag anywhere in the Markdown.

FULL WORKING EXAMPLE (from routes/testmdx.mdx):

import { signal } from "@preact/signals"; import Counter from
"../islands/Counter.tsx";

export const count = signal(3);

## Interactive Island Example

Here is an interactive counter island embedded directly into the MDX file:

<Counter count={count} />

WHAT HAPPENS WHEN THIS PAGE LOADS:

1. Server compiles testmdx.mdx to a Preact component.
2. Server renders the component: all Markdown becomes static HTML. The Counter
   component renders its INITIAL STATE (3) as static HTML too.
3. Server sends the complete HTML page to the browser (including the Counter
   showing "3" as static text).
4. The browser displays the page INSTANTLY (no JS needed for this step).
5. The browser downloads Counter's JavaScript (a few KB).
6. Counter's JS "hydrates" - the -1 and +1 buttons become clickable.
7. Now the counter is fully interactive.

The user sees the content at step 4. Interactivity arrives at step 6. The gap
between 4 and 6 is usually less than 100ms on a fast connection.

---

## QUIZ TIME!

Q1: You create `routes/products/[id].tsx`. What URL does it match? A1: Any URL
like /products/1, /products/42, /products/laptop. The value after /products/ is
available as `ctx.params.id` inside the component.

Q2: You create a new file `routes/contact.mdx`. You go to /contact in the
browser and get a 404. Why? A2: You forgot to add it to `mdx-routes.ts`! MDX
files must be manually registered there. Add:
`"/contact": () => import("./routes/contact.mdx")`

Q3: In an MDX file, you write `export const show = useSignal(false)` at the top
level. What happens? A3: It CRASHES with "Hook can only be invoked from render
methods". Use `signal(false)` instead. `useSignal` is a hook and can only be
called inside a component function body.

Q4: How do you render the equation `a² + b² = c²` inline in MDX? A4:
$a^2 + b^2 = c^2$

Next up: Module 4 - Hands-On Project!
