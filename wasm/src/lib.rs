use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add_in_rust(a: i32, b: i32) -> i32 {
    a + b
}