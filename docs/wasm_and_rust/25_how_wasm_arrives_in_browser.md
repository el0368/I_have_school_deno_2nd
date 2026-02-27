# ================================================================================ HOW WASM ARRIVES IN THE BROWSER

To answer your question: **Yes, the browser must download the `.wasm` file, just
like it downloads an image or a JavaScript file.**

But it doesn't happen all at once. Here is the process:

---

1. THE DOWNLOAD TIMELINE

---

1. THE PAGE (HTML): The user visits your site. Deno sends the HTML. The page
   appears instantly.

2. THE ISLAND (JavaScript): The browser sees an Island and says: "I need the
   JavaScript for this!" It downloads the small `.js` file.

3. THE ENGINE (WASM): The JavaScript runs and says: "I need the Rust engine to
   work!" It then sends a request to the server to download the `.wasm` binary.

---

2. IS IT HEAVY TO DOWNLOAD?

---

Many people worry that `.wasm` files are huge, but they are actually very
compact because they are **Binary**:

- TEXT: `function add(a, b) { return a + b; }` (Many bytes of text characters)
- BINARY: `01101011 00101101` (Only a few bits of data)

A Rust game that would be 5MB in JavaScript might only be 1MB in WASM.

---

3. THE "ONDEMAND" FEATURE

---

One of the best things about Islands is that the WASM is only downloaded **when
it is needed.**

- If the user never scrolls down to where your "Rust Game" island is, the
  browser might never even download the `.wasm` file!
- This keeps the initial page load incredibly fast.

---

# SUMMARY: The `.wasm` file is the "Package" that contains your Rust logic. The browser fetches it in the background while the user is already looking at your beautiful HTML page.
