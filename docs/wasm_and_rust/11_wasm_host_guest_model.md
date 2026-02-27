# ================================================================================ THE HOST & GUEST MODEL (DENO + WASM)

To understand how you use other languages in this project, it helps to
understand the relationship between Deno and WebAssembly.

---

1. THE HOST: DENO (TYPESCRIPT/JAVASCRIPT)

---

Deno is the "boss" of the project. It provides the environment where everything
lives.

- RESPONSIBILITIES: Networking, File System access, UI rendering (Preact), and
  Security.

- WHY TS/JS?: Because they are the native languages of the web. They are
  flexible and easy to change quickly.

---

2. THE GUEST: WEBASSEMBLY (RUST/ZIG/C/ELIXIR)

---

WASM is like a "Specialist" that Deno hires to do a specific, difficult job.

- LANGUAGES: Rust, Zig, C, C++, Go, Elixir (via Lumen/Firefly).
- COMPILATION: You don't run these languages directly. You compile them into a
  .wasm file first.
- WHY USE THEM?: Because they are much faster than JavaScript for things like
  heavy math, video encoding, or complex simulations.

---

3. THE "GLUE" (HOW THEY CONNECT)

---

Deno act as the "Bridge."

1. Deno (TypeScript) loads the .wasm file.
2. Deno provides a "sandbox" for the WASM to run in.
3. TypeScript calls a function: `const result = myWasm.calculate(data);`
4. Use the result back in your Fresh website.

---

# SUMMARY: Deno handles the "Web" stuff. WASM handles the "Heavy" stuff. You always need Deno (the Host) to run the WASM (the Guest).
