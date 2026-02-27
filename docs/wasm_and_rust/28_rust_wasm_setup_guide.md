# ================================================================================ GUDE: SETTING UP RUST & WASM (WINDOWS)

This guide will walk you through installing the tools needed to build high-
performance Rust engines for your Deno Islands.

---

## STEP 1: INSTALL RUST (RUSTUP)

First, you need the Rust compiler itself.

1. Go to [https://rustup.rs/](https://rustup.rs/) and download
   `rustup-init.exe`.
2. Run the file.
3. When prompted, choose the **default installation** (Option 1).

> [!IMPORTANT]
> If it asks you to install "Visual Studio C++ Build Tools," say YES. Rust needs
> these to compile code on Windows.

---

## STEP 2: INSTALL WASM-PACK

`wasm-pack` is the "magic tool" that takes your Rust code and turns it into a
`.wasm` file and a JavaScript "glue" loader.

1. Open your terminal (PowerShell or Command Prompt).
2. Run this command:
   ```powershell
   cargo install wasm-pack
   ```
   (Wait for it to finish; this might take a few minutes!)

---

## STEP 3: INITIALIZE A RUST PROJECT

Now, let's create a folder specifically for your Rust logic.

1. In your `I_have_school_deno_2nd` folder, create a new folder called `wasm`.
2. Inside `wasm`, open a terminal and run:
   ```powershell
   cargo init --lib
   ```
3. Open the new `wasm/Cargo.toml` file and add these lines at the bottom:
   ```toml
   [lib]
   crate-type = ["cdylib"]

   [dependencies]
   wasm-bindgen = "0.2"
   ```

---

## STEP 4: WRITE YOUR FIRST RUST FUNCTION

Open `wasm/src/lib.rs` and replace everything with this:

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add_in_rust(a: i32, b: i32) -> i32 {
    a + b
}
```

---

## STEP 5: COMPILE TO WASM

Inside your `wasm` folder, run this command:

```powershell
wasm-pack build --target web
```

This will create a `pkg/` folder that contains your finished `.wasm` file and
the JavaScript glue code!

---

## STEP 6: USE IT IN AN ISLAND

Now you can just import the logic from that `pkg/` folder into any Island in
your `/islands/` directory!

```typescript
import init, { add_in_rust } from "../wasm/pkg/my_wasm_project.js";

// ... inside your component
await init();
const result = add_in_rust(5, 10);
```

---

SUMMARY:

1. **Rustup**: The Compiler
2. **Wasm-pack**: The Builder
3. # **Cargo**: The Manager
