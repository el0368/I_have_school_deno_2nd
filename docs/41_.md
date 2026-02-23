To implement this specific architecture, you need a precise stack of tools
divided by their execution environment. Here is the exact toolchain required for
the server and the client.

### Server-Side Tools (The Backend & Renderer)

The server requires tools optimized for heavy compilation, routing, and fast
execution.

1. **Deno (The Runtime):** The core engine running the entire backend. It
   natively executes your TypeScript code without needing external compilers and
   handles secure file system access (like reading your `curriculums/` folder).
2. **Fresh 2.x (The Framework):** The web framework responsible for the "Magic
   Template" dynamic routing. It handles the Server-Side Rendering (SSR),
   ensuring that the final output sent to the browser is pure HTML.
3. **MDX Compiler (e.g., `@mdx-js/preact`):** The engine that parses your `.mdx`
   content files, evaluates any embedded code or math formatting, and transforms
   them into JSX components on the server.
4. **Vite (The Build Tool):** In modern Deno/Fresh setups, Vite is used under
   the hood to bundle assets and manage the server compilation pipeline
   efficiently.
5. **Deno KV or Server PostgreSQL (For Telemetry):** If you implement the
   optional telemetry API route, you need a server-side data store. Deno KV is
   built directly into the Deno runtime for simple, key-value analytics storage.
   Alternatively, a standard managed PostgreSQL database could be used to
   aggregate the anonymized JSON payloads.

### Client-Side Tools (The Browser & Native App)

The client requires lightweight, highly optimized tools capable of offline
storage and targeted interactivity.

1. **Preact (For Interactive Islands):** A fast, 3kB alternative to React. You
   will use Preact exclusively inside the `/islands/` directory to build the
   specific components that need JavaScript in the browser (like the explicit
   consent popup, "Mark Complete" buttons, and interactive quizzes).
2. **PGlite (`@electric-sql/pglite`):** The WebAssembly (WASM) build of
   PostgreSQL. This acts as your local, offline-first database. It runs directly
   inside the browser or native app, saving student progress, test scores, and
   history into the device's local storage (like IndexedDB).
3. **Tauri:** The framework that wraps your entire application. It takes your
   Fresh/Preact frontend and packages it into native, frameless executable files
   for Desktop (Windows, macOS, Linux) and Mobile, granting the application deep
   operating system integrations and full offline capabilities without running a
   heavy Chromium browser in the background.
4. **Standard Web APIs (Fetch API & Navigator):** For the telemetry sync, you
   will rely on built-in browser APIs. The `navigator.onLine` property checks if
   the device has internet access, and the `fetch()` API sends the background,
   anonymized HTTP POST request to your server.

This toolchain ensures that the heavy processing remains strictly on the server,
while the client remains a lightweight, privacy-focused, and offline-capable
interface.
