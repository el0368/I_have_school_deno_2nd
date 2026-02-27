# Math Engine: Rust Dependency Breakdown

This document explains the role of each library (crate) in the `math_engine/`
Cargo project. Axum is a modular framework, meaning it requires these companion
libraries to perform basic tasks like async execution, JSON parsing, and
security.

---

## 1. `tokio` — The Async Engine

**Job**: The underlying asynchronous runtime.

Axum is built on top of Tokio and cannot run without it. When your server
defines an `async fn`, Tokio is the "engine" that actually executes that code
concurrently.

- **Role**: Like the Node.js event loop, but for Rust.
- **Why**: Handles thousands of simultaneous network connections efficiently.

---

## 2. `tower-http` — The Middleware Layer

**Job**: Pre-built security and reliability tools.

Axum itself focuses only on routing. Standard web features like CORS (browser
security) and Timeouts come from `tower-http`.

- **Role**: Adds "layers" of functionality to your routes.
- **Why**:
  - `CorsLayer`: Allows the Deno frontend to call the math engine from the
    browser.
  - `TimeoutLayer`: Ensures that if SymPy gets stuck on a complex integral, the
    request is killed after 30 seconds rather than hanging the server forever.

---

## 3. `serde` — The Serialization Framework

**Job**: Translates Rust structs into data formats (and back).

Rust does not have built-in "objects" that automatically turn into JSON. `serde`
is the universal framework for translating typed data.

- **Role**: Provides the `#[derive(Serialize, Deserialize)]` macros used in
  `routes/solve.rs`.
- **Why**: Ensures that every request/response is strictly typed and validated.

---

## 4. `serde_json` — The JSON Support Plugin

**Job**: Teaches `serde` how to speak the JSON language specifically.

`serde` is the general engine; `serde_json` is the specific format. Axum's
`Json<T>` extractor uses this internally to bridge the gap between HTTP bytes
and Rust structs.

- **Role**: Encodes and decodes the actual JSON text strings.
- **Why**: Essential for the `POST /solve` endpoint to understand the payload
  sent by Deno.

---

## Summary Table

| Library        | Role          | Without it...                                              |
| :------------- | :------------ | :--------------------------------------------------------- |
| **tokio**      | Async Runtime | The server cannot start/run.                               |
| **tower-http** | Middleware    | No CORS (browser blocks app) or Timeouts (hanging).        |
| **serde**      | Typing        | You cannot turn your math data into a serializable format. |
| **serde_json** | Data Format   | You cannot parse or produce JSON strings.                  |
