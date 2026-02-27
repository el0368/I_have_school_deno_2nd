# ================================================================================ ISLANDS: MORE THAN JUST JAVASCRIPT

To answer your question: The "islands" folder is for components that NEED to run
code in the browser. While that code is written in TypeScript, it is the primary
place where you integrate WASM for the user.

---

1. THE RUNTIME PERSPECTIVE

---

- JAVASCRIPT/TYPESCRIPT: Yes, the "glue" code that handles the UI (the buttons,
  the sliders, the inputs) is always JavaScript or TypeScript. This is because
  the browser's Document Object Model (DOM) only talks to JS/TS.

- WEBASSEMBLY (WASM): The "islands" folder is the perfect home for WASM. You use
  the TypeScript inside the island to "fetch" and "run" your WASM logic.

---

2. HOW WASM LIVES IN AN ISLAND

---

Imagine you have a complex physics simulation written in Zig.

1. THE ZIG CODE: Compiled to `physics.wasm`.
2. THE ISLAND: `islands/PhysicsSim.tsx`.
3. THE INTEGRATION: The Island uses `useEffect` to load the WASM file when the
   user visits the page. The Island then uses the fast WASM functions to update
   the UI at 60 frames per second.

---

3. WHY NOT RUN WASM IN "ROUTES" OR "COMPONENTS"?

---

- ROUTES/COMPONENTS: These run only on the server (Deno). If you load WASM here,
  the user can't interact with it after the page loads. It's "dead" content.

- ISLANDS: These run in the user's browser. WASM here is "alive"—it can react to
  the user's mouse movements, keyboard presses, or data entries instantly.

# SUMMARY: The "islands" folder is the "entry point" for any browser-side code. Use it to coordinate between your Preact UI and your high-performance WASM logic.
