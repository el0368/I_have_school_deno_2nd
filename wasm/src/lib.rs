use wasm_bindgen::prelude::*;

// WASM utilities — math computation is handled server-side by Mojo + SymPy.
// This module is reserved for future browser-side utilities
// (e.g. Typst rendering, graph helpers, offline tools).

/// Basic smoke-test to verify the WASM module is loaded correctly.
#[wasm_bindgen]
pub fn ping() -> String {
    String::from("pong")
}
