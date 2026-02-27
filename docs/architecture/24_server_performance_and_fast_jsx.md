# ================================================================================ SERVER PERFORMANCE: IS JSX "HEAVY" FOR DENO?

You are thinking like a systems engineer! You've spotted exactly where the work
is happening. But here is why Deno doesn't find it "heavy":

---

1. THE "BUILD TIME" SECRET

---

The server doesn't actually convert MDX to JSX on every request.

- WHEN YOU SAVE: Deno and Vite convert your `.mdx` file into a optimized
  JavaScript function **once**.
- WHEN A USER VISITS: Deno just runs that existing function. It's like pressing
  "Play" on a recorded song rather than writing the song from scratch every
  time.

---

2. JSX IS JUST MATH (FOR THE SERVER)

---

Underneath the hood, a JSX tag like `<h1>Hello</h1>` is actually a tiny
JavaScript function call: `h("h1", null, "Hello")`.

Deno is built on the **V8 engine** (the same one in Chrome) and is written in
**Rust**. It can run millions of these small function calls per second. For
Deno, turning a whole MDX page into HTML is about as easy as doing a simple math
problem.

---

3. THE "AUSTERE" ENVIRONMENT

---

Unlike older frameworks (like WordPress or large React apps), Fresh is "Austere"
(meaning it has zero waste):

- NO STATE SYNCING: The server doesn't have to keep track of what the user is
  doing. It just produces a string of text (HTML) and sends it.
- STRING PIPELINING: Once the HTML is generated, Deno "streams" it to the user
  immediately. It doesn't even wait for the whole page to be finished before
  starting the download.

---

4. COMPARISON

---

| Task                    | Complexity for Server |
| ----------------------- | --------------------- |
| Database Query          | Medium/High           |
| Image Processing        | High                  |
| **MDX to HTML (Fresh)** | **Very Low**          |

---

# CONCLUSION: While Deno _is_ doing work, it's the kind of work Deno was born to do. Running these optimized JSX functions is hundreds of times lighter than running a database or a complex backend API. Your server will stay cool and fast!
