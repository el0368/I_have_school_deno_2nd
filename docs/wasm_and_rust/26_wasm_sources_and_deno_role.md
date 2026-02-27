# ================================================================================ WASM SOURCES: RUST VS. DENO

To answer your question: You can absolutely have multiple `.wasm` files from
different sources on the same page!

But it's important to understand the relationship between **Rust** and **Deno**.

---

1. RUST IS THE "SOURCE"

---

- WHAT IT IS: Rust is a language that you compile _into_ WASM.
- THE RESULT: A `.wasm` file that contains high-performance logic.
- USE CASE: You write your game engine or math library in Rust.

---

2. DENO IS THE "HOST" (THE PLATFORM)

---

- WHAT IT IS: Deno is the environment that **runs** the code.
- THE ROLE: Deno provides the server that sends the `.wasm` file to the browser.
- Deno itself is actually written in **Rust**, but you don't usually "compile
  Deno into WASM." Instead, Deno is the "boss" that manages your WASM modules.

---

3. CAN YOU HAVE MULTIPLE SOURCES?

---

**YES.** You can have a single page with many different "Islands," each using a
different WASM module:

- ISLAND A (The Physics Game): Uses a `.wasm` file compiled from **Rust**.
- ISLAND B (The Image Filter): Uses a `.wasm` file compiled from **C++**.
- ISLAND C (The PDF Generator): Uses a `.wasm` file you found in a **Deno
  Library**.

---

4. THE "DENO-WASM" CONFUSION

---

Sometimes people say "Deno WASM" when they mean one of two things:

1. A WASM module found on [JSR.io](https://jsr.io) or
   [deno.land/x](https://deno.land/x): Someone else has already written the
   Rust/C++ and provided the `.wasm` along with a Deno-friendly TypeScript
   wrapper.

2. AssemblyScript: A language that looks like TypeScript but compiles directly
   to WASM. This is the closest thing to "TypeScript WASM."

---

# SUMMARY: You use **Deno** to build and serve your website, but you use **Rust** (or other languages) to build the high-performance WASM engines that live **inside** your Islands. You can mix and match as many as you need!
