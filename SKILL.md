---
name: Sovereign Academy Development Skills
description: Instructions for compiling WASM, managing MDX, and handling Islands.
---

# Sovereign Academy Engine Guidelines

## 1. Modifying and Building Rust WASM

When editing `wasm/src/lib.rs`, the WASM module must be recompiled for the
browser to see the changes. **AI Action**: Whenever you write or edit Rust code,
execute the following command:

```bash
cd wasm && wasm-pack build --target web
```

## 2. Managing MDX Routes

- **Standard single-page routes**: Drop `.mdx` files directly into `routes/`.
  The auto-discovery router will pick them up immediately.
- **Large Curriculums**: Place massive content collections in
  `curriculums/[subject]/`. These will be handled by a dynamic `.tsx` template
  routing engine.

## 3. Creating Interactive WebAssembly Islands

WASM must execute on the client-side.

- Ensure the Island file is inside the `islands/` directory.
- Use a `useEffect` or button click event to trigger the WASM functions.
- If importing the WASM `init` function from `wasm/pkg/wasm.js`, ensure it is
  loaded asynchronously on the client before calling Rust math functions.
