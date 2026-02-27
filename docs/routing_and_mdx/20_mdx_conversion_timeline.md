# ================================================================================ MDX3 CONVERSION: WHEN & WHERE?

To answer your question: **No, it is converted BEFORE it reaches the browser.**

If the browser had to convert MDX3 itself, it would be slow because it would
have to download the MDX compiler first. Instead, Deno handles all the work.

---

1. THE TIMELINE

---

1. THE SOURCE (On your computer): You write the `testmdx.mdx` file.

2. THE COMPILATION (On the Deno Server): When a user requests the page, the Deno
   server "translates" the MDX into high-performance HTML.

3. THE DELIVERY (Over the Internet): Deno sends that **pure HTML** over the
   network to the user.

4. THE ARRIVAL (In the Browser): The browser receives the HTML and displays it
   immediately.

---

2. THE ONLY EXCEPTION: ISLANDS

---

While the **Text and Layout** arrive as finished HTML, the **Islands** arrive
as:

- Initial HTML (so the user sees the button instantly).
- A small bit of JavaScript (which "wakes up" the button a split-second later).

---

3. WHY THIS MATTERS

---

- SPEED: The browser doesn't have to "think" or "compile." It just draws the
  HTML it was given.
- SEO: Because the server sends finished HTML, search engines (like Google) can
  read your content perfectly.

# SUMMARY: The "Conversion" happens on the **Server** (Deno). The "Display" happens in the **Browser**. By the time the browser sees it, the MDX is already gone—it is just HTML.
