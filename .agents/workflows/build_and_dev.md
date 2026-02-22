---
description: Build Rust WASM and start the Fresh development server
---

# Start Sovereign Academy Environment

1. Build the Rust WebAssembly module to ensure the latest Rust code is available
   to Fresh. // turbo

```bash
cd wasm && wasm-pack build --target web
```

2. Start the Fresh development server. // turbo

```bash
deno task dev
```
