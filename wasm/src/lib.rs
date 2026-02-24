use mathcore::MathCore;
use wasm_bindgen::prelude::*;

/// Adds two integers. Basic smoke-test for WASM bindings.
#[wasm_bindgen]
pub fn add_in_rust(a: i32, b: i32) -> i32 {
    a + b
}

/// Parses an infix expression string, simplifies it via MathCore,
/// and returns the canonical string form.
///
/// # Example (JS side)
/// ```js
/// simplify_expr("x^2 + 2*x + 1") // => "(x+1)^2"  (or similar simplified form)
/// ```
#[wasm_bindgen]
pub fn simplify_expr(input: &str) -> String {
    match MathCore::simplify(input) {
        Ok(expr) => expr.to_string(),
        Err(e) => format!("Error: {e}"),
    }
}
