# ================================================================================ MODULE 6: ADVANCED FRESH PATTERNS

Estimated Time: 35 minutes Prerequisites: All previous modules Learning
Objectives:

- Add shared layouts with _layout.tsx for navigation/headers
- Combine a handler AND a page in the same route file
- Use dynamic routes [param].tsx and catch-all [...slug].tsx
- Redirect programmatically from a handler
- # Manage per-page <title> and <meta> tags with Head

You have been working with the basic building blocks of Fresh routes. This
module teaches the patterns that make real applications work — shared layouts,
server-side redirects, and dynamic URL segments.

---

## LESSON 1: LAYOUTS — _layout.tsx

The Beginner course covered _app.tsx — the ROOT layout that wraps EVERYTHING.
Fresh also supports _layout.tsx files that wrap a SUBSET of routes.

DIFFERENCE: routes/_app.tsx → wraps ALL routes (html, head, body tags)
routes/_layout.tsx → wraps all routes in that FOLDER routes/api/_layout.tsx
would wrap all /api/* routes (rarely needed for APIs)

Example: Add a navigation bar to all user-facing pages EXCEPT the API routes.

Create: routes/_layout.tsx import { define } from "../utils.ts";

export default define.page(function Layout({ Component }) { return (

<div> {/* Navigation bar — appears on every page */} <nav style={{ background:
"#1e293b", padding: "12px 24px", display: "flex", gap: "16px" }}> <a href="/"
style={{ color: "white", textDecoration: "none" }}>Home</a> <a href="/notes"
style={{ color: "white", textDecoration: "none" }}>Notes</a> <a href="/hello"
style={{ color: "white", textDecoration: "none" }}>Hello MDX</a>
</nav>

        {/* The actual page renders here */}
        <main style={{ padding: "24px" }}>
          <Component />
        </main>
      </div>
    );

});

Now every page route (index.tsx, notes.tsx, etc.) will have the nav bar
automatically, without you touching each route file.

The RENDER ORDER: _app.tsx (html/head/body) └── _layout.tsx (nav + main wrapper)
└── routes/index.tsx (the page)

NESTED LAYOUTS: routes/_layout.tsx → wraps all routes routes/admin/_layout.tsx →
wraps only /admin/* routes (inside the outer layout!)

---

## LESSON 2: HANDLER + PAGE IN THE SAME FILE (THE ROUTE MODULE PATTERN)

In the Beginner level, API routes had only a `handler` and page routes had only
a `default export`. But a SINGLE FILE can have BOTH.

This is useful for "form pages" — pages that display a form AND process its
submission in the same route file:

// routes/notes.tsx — full example

import { define } from "../utils.ts"; import { signal } from "@preact/signals";
import NotesIsland from "../islands/NotesIsland.tsx";

interface Note { id: string; text: string; createdAt: string; } const store:
Record<string, Note> = {};

// SERVER-SIDE HANDLER (runs on the server for POST) export const handler =
define.handlers({ // GET — just render the page (let the default export handle
it) GET(_ctx) { return; // Return undefined to "fall through" to the page render
},

    // POST — process a form submission from a <form method="POST">
    async POST(ctx) {
      const form = await ctx.req.formData();
      const text = form.get("text")?.toString().trim() ?? "";

      if (text) {
        store[crypto.randomUUID()] = {
          id: crypto.randomUUID(), text, createdAt: new Date().toISOString(),
        };
      }
      // Redirect back to GET to show the updated list
      return new Response(null, {
        status: 303,   // 303 See Other — standard for POST→redirect
        headers: { Location: "/notes" },
      });
    },

});

// CLIENT-SIDE PAGE (runs on the server to produce the initial HTML, // then
hydrates Islands in the browser) export default define.page(function
NotesPage(ctx) { const initialNotes = Object.values(store); const count =
signal(initialNotes.length);

    return (
      <div>
        <h1>Notes ({count})</h1>
        {/* Static HTML form — works even without JavaScript! */}
        <form method="POST" action="/notes">
          <input name="text" placeholder="Write a note..." />
          <button type="submit">Add (no-JS)</button>
        </form>
        {/* Interactive Island — works WITH JavaScript */}
        <NotesIsland initialNotes={initialNotes} />
      </div>
    );

});

This pattern is called "progressive enhancement":

- Without JavaScript: the `<form>` POST still works (server processes it)
- With JavaScript: the Island handles it interactively (no page reload)

When does GET handler return `undefined`? If `GET()` returns `undefined` or
nothing, Fresh falls through to render the default export component. This is
intentional — you only need the GET handler if you want to do something BEFORE
rendering (like a redirect or fetch data from a DB into ctx.state).

---

## LESSON 3: DYNAMIC ROUTES

You already used [name].tsx. Let's go deeper.

SINGLE DYNAMIC SEGMENT: File: routes/notes/[id].tsx Matches: /notes/abc123,
/notes/xyz789 Access: ctx.params.id → "abc123"

export const handler = define.handlers({ GET(ctx) { const id = ctx.params.id;
const note = store[id]; if (!note) return new Response("Not found", { status:
404 }); return Response.json(note); },

    DELETE(ctx) {
      const id = ctx.params.id;
      if (!store[id]) return new Response("Not found", { status: 404 });
      delete store[id];
      return new Response(null, { status: 204 });
    },

});

export default define.page(function NotePage(ctx) { const note =
store[ctx.params.id]; if (!note) return <h1>Note not found</h1>; return (

<div>
<h1>{note.text}</h1>
<p>Created: {note.createdAt}</p>
</div> ); });

CATCH-ALL ROUTES: File: routes/docs/[...slug].tsx Matches:
/docs/getting-started, /docs/api/reference, /docs/a/b/c Access: ctx.params.slug
→ "getting-started" or "api/reference" or "a/b/c" Split it:
ctx.params.slug.split("/") → ["api", "reference"]

export default define.page(function DocsPage(ctx) { const parts =
ctx.params.slug.split("/"); return <h1>Docs: {parts.join(" > ")}</h1>; });

ROUTE PRIORITY (which matches when multiple routes could match?):

1. Exact routes → /notes/new (most specific)
2. Dynamic routes → /notes/[id]
3. Catch-all → /notes/[...slug] (least specific)

So /notes/new matches the file `routes/notes/new.tsx` first (if it exists), NOT
`routes/notes/[id].tsx`.

---

## LESSON 4: PROGRAMMATIC REDIRECTS AND ERRORS

From any handler, you can redirect the user to another page:

REDIRECT (temporary — 302): return new Response(null, { status: 302, headers: {
Location: "/login" }, });

REDIRECT (permanent — 301, for moved pages): return new Response(null, { status:
301, headers: { Location: "/new-path" }, });

POST → REDIRECT → GET (303, prevents form resubmission on refresh): // After
processing a form POST: return new Response(null, { status: 303, headers: {
Location: "/notes" }, });

RETURNING AN ERROR PAGE: From a page's GET handler, to show a custom error:
GET(ctx) { const note = store[ctx.params.id]; if (!note) { ctx.renderNotFound();
// Fresh shows the 404 page } // Or redirect to an error page: return new
Response(null, { status: 302, headers: { Location: "/error?code=404" } }); }

COMMON REDIRECT CODES:

CODE NAME WHEN TO USE 301 Moved Permanently Resource has a new permanent URL 302
Found (Temp Redirect) Redirect for now, may change 303 See Other After POST —
redirect to a GET 307 Temporary Redirect Same as 302 but preserves method 308
Permanent Redirect Same as 301 but preserves method

---

## LESSON 5: HEAD MANAGEMENT — PER-PAGE TITLE AND META TAGS

In _app.tsx, the static `<title>I_have_school_deno_2nd</title>` appears on every
page. For a real app, each page needs its own title.

Use `Head` from "fresh/runtime":

import { Head } from "fresh/runtime"; import { define } from "../utils.ts";

export default define.page(function NotesPage() { return (

<div> {/* Head renders into <head> — even though it's inside the component! */}
<Head>
<title>My Notes — Fresh App</title>
<meta name="description" content="Manage your personal notes" />
<meta property="og:title" content="My Notes" />
</Head>

        <h1>My Notes</h1>
        {/* ... rest of page ... */}
      </div>
    );

});

Fresh automatically moves content from `<Head>` into the actual `<head>` tag at
render time. This means you can set the title from deep inside a component tree.

DYNAMIC TITLES: export default define.page(function NotePage(ctx) { const note =
store[ctx.params.id]; return (

<div>
<Head>
<title>{note ? note.text : "Note not found"} — Fresh App</title>
</Head> {note ? <h1>{note.text}</h1> : <h1>Not found</h1>}
</div> ); });

The title changes based on which note is being viewed — each URL gets its own
title.

---

## QUICK REFERENCE

FEATURE FILE/SYNTAX SCOPE

---

Root layout routes/_app.tsx ALL routes Section layout routes/folder/_layout.tsx
That folder Page component export default define.page(fn) Page rendering Route
handler export const handler = define.handlers API / form processing Dynamic
segment [param].tsx / ctx.params.param Single segment Catch-all segment
[...slug].tsx / ctx.params.slug Multiple segments Redirect new Response(null,
{status, headers}) From any handler POST→GET redirect status: 303 After form
submit Per-page head import { Head } from "fresh/runtime" Any component

ROUTE PRIORITY: exact > dynamic > catch-all

---

## MINI QUIZ

1. You have routes/blog/_layout.tsx. Which routes does it affect? A) All routes
   in the entire app B) Only /blog and /blog/* routes C) Only routes that import
   the layout D) The root / route only

2. A route file has both `export const handler` and a `default export` page.
   When does the page component render? A) Only when handler returns `undefined`
   or falls through B) Always — they both always render C) Only on POST requests
   D) Never — you can't combine them

3. You want /docs/a/b/c to all match one file. Which filename is correct? A)
   routes/docs/[id].tsx B) routes/docs/*all.tsx C) routes/docs/[...slug].tsx D)
   routes/docs/catch.tsx

4. After a user submits a POST form, which redirect status code prevents the
   browser from resubmitting the form when the user presses F5 (Refresh)? A) 301
   B) 302 C) 303 D) 307

Answers: 1-B, 2-A, 3-C, 4-C

================================================================================
