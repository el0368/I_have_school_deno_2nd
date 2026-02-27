# ================================================================================ MDX3: UNDER THE HOOD

To answer your question: No, MDX3 is not "just" HTML under the hood. It is
actually **JavaScript (JSX)** that _produces_ HTML.

---

1. THE THREE LAYERS OF MDX3

---

Think of MDX3 as a cake with three layers:

- LAYER 1: THE SOURCE (.mdx) You write Markdown text and JSX components
  (Islands).

- LAYER 2: THE MACHINE CODE (JavaScript/Preact) Under the hood, Deno "compiles"
  your MDX file into a **JavaScript Component**. This component is logic that
  knows how to create HTML.

- LAYER 3: THE RESULT (HTML) When someone visits your site, that JavaScript
  logic runs and produces the final **HTML** that the browser displays.

---

2. MUST IT ALWAYS CONVERT TO HTML?

---

**Yes**, because HTML is the only language that a web browser can actually
"draw" on a screen.

However, the _way_ it converts can change:

- STATIC CONTENT: Converts to "Dead" HTML on the server.
- ISLAND CONTENT: Converts to "Alive" HTML that carries JavaScript logic with
  it.

---

3. THE "JSX" ENGINE

---

MDX3 "under the hood" is powered by **JSX** (JavaScript XML).

In your `vite.config.ts`, we tell the system: "Take any .mdx file, turn it into
a Preact component, and treat it exactly like a .tsx file."

# SUMMARY: MDX3 is a **TypeScript/JavaScript program** that has been optimized for writing text. It doesn't become HTML until the very last second when Deno sends the response to the browser.
