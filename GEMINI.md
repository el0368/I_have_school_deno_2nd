# Project Context: Sovereign Academy

This file provides core context for Google Antigravity (Gemini) regarding the
project's architecture, technologies, and design philosophies.

## Tech Stack

- **Framework**: Deno + Fresh 2.x + Vite
- **UI Library**: Preact
- **Core Engine**: Rust + WebAssembly (WASM)
- **Content Engine**: MDX3 (Markdown with inline JSX syntax)

## Architectural Data Flow

1. **Virtual MDX Router**: The project utilizes a "Bulletproof" virtual router
   inside `main.ts` and `mdx-routes.ts`. It auto-discovers `.mdx` files via
   Vite's `import.meta.glob`. It intercepts requests starting with `/learn/`,
   handles URL normalization, and renders components directly on the server to
   bypass Fresh serialization limitations. **Rule:** Do NOT use physical
   `routes/learn/` files; keep all content in `curriculums/`.
2. **Content Collections (The Active Architecture)**: Educational content is
   strictly separated from application logic. Large sets of MDX content are
   stored in the `curriculums/` folder. This acts as a headless data source,
   serving nested units and topics (e.g.,
   `curriculums/math/grade_1/unit_1/topic.mdx`) via the virtual `/learn/`
   prefix.
3. **Data Management & Progress**: Student progress (answers, mastery) is
   treated as structured data. While lessons are **MDX**, student interactions
   are recorded as **JSON** or stored in **PGlite (WASM PostgreSQL)** to allow
   for offline-first, high-performance tracking.
4. **Rust WASM Integration**: Rust logic lives in `/wasm/src/lib.rs` and
   compiles to `/wasm/pkg/`. The WASM interacts with the DOM exclusively through
   Fresh `islands/` utilizing client-side hydration.
5. **Tauri-Ready Desktop/Mobile**: The application logic and CSS are designed to
   be "frameless" and platform-agnostic, preparing for the Tauri 2.0 wrapper
   (Native Windows, Mac, iOS, Android).

## Style & Location Guidelines

- **System Layouts & UI**: Use `.tsx` in `/routes/`.
- **Text-Heavy Content**: Use `.mdx`.
- **Interactivity**: Use Preact Signals (`@preact/signals`) inside `islands/`.
- **CSS**: Place global styles in `/assets/styles.css` (processed by Vite).
