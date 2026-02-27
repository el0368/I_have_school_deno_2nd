# ================================================================================ MDX3 VS. ISLANDS: WHICH ONE TO USE?

This project uses MDX3 as the primary way to create pages because it allows for
a "Content-First" architecture. Here is the detailed technical difference:

---

1. MDX3 (THE SERVER-RENDERED PAGE)

---

- WHAT IT IS: A mix of Markdown and Preact that lives in the `/routes/` folder.
- BEHAVIOR: It is Server-Rendered (SSR). Fresh turns the MDX into pure, static
  HTML on the server and sends only that HTML to the browser.
- WHY NOT MAKE MDX AN ISLAND?:
  - PERFORMANCE: Sending pure HTML is much faster than sending JavaScript.
  - SEO: Search engines can easily read static HTML.
  - BUNDLE SIZE: If the whole MDX was an island, the user would have to download
    all the text and layout as a JavaScript bundle.

---

2. ISLANDS (THE CLIENT-SIDE INTERACTIVITY)

---

- WHAT IT IS: A Preact component in `/islands/` that "hydrates" in the browser.
- BEHAVIOR: It ships JavaScript to the client. It handles things like
  `useState`, `useEffect`, and event listeners (`onClick`).
- BEST FOR:
  - Interactive widgets (Buttons, Forms).
  - Real-time data (Charts, Dashboards).
  - WASM-powered simulations and heavy logic.

---

3. THE TRUE POWER: ISLANDS INSIDE MDX

---

The best pattern is to use MDX as the "Book" and Islands as the "Pop-up
illustrations." You import the Island _into_ the MDX file:

```mdx
# My Awesome Lesson

This text is static HTML. It loads instantly!

import MyCounter from "../islands/Counter.tsx";

<MyCounter start={5} />

Only the Counter above ships JavaScript to the browser.
```

# SUMMARY: `routes/*.mdx` acts as the web page (Static/SSR). `islands/*.tsx` acts as the interactive widget (Dynamic/Hydrated). Import Islands into MDX to get the best of both worlds: Speed + Power.
