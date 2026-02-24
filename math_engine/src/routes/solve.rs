// ============================================================================
// POST /solve — Calls SymPy via PyO3
// ============================================================================
// Accepts: { "expression": "x**2 + 5*x + 6", "operation": "solve" }
// Returns: { "result": "[-3, -2]", "operation": "solve", "durationMs": 12 }

use axum::Json;
use pyo3::prelude::*;
use serde::{Deserialize, Serialize};
use std::time::Instant;

#[derive(Debug, Deserialize)]
pub struct MathRequest {
    pub expression: String,
    pub operation: String,
    #[serde(default)]
    pub variable: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct MathResponse {
    pub result: String,
    pub operation: String,
    #[serde(rename = "durationMs")]
    pub duration_ms: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

pub async fn solve_handler(Json(req): Json<MathRequest>) -> Json<MathResponse> {
    let start = Instant::now();
    let op = req.operation.clone();

    // Run the Python/SymPy call on a blocking thread so we don't block Tokio
    let result = tokio::task::spawn_blocking(move || call_sympy(&req)).await;

    let duration_ms = start.elapsed().as_millis() as u64;

    match result {
        Ok(Ok(answer)) => Json(MathResponse {
            result: answer,
            operation: op,
            duration_ms,
            error: None,
        }),
        Ok(Err(e)) => Json(MathResponse {
            result: String::new(),
            operation: op,
            duration_ms,
            error: Some(e.to_string()),
        }),
        Err(e) => Json(MathResponse {
            result: String::new(),
            operation: op,
            duration_ms,
            error: Some(format!("Task error: {e}")),
        }),
    }
}

/// Calls SymPy inside the embedded Python interpreter.
fn call_sympy(req: &MathRequest) -> PyResult<String> {
    Python::with_gil(|py| {
        let sympy = py.import("sympy")?;
        let var = req.variable.as_deref().unwrap_or("x");

        // Parse the expression and the variable symbol
        let expr = sympy.call_method1("sympify", (&req.expression,))?;
        let x = sympy.call_method1("Symbol", (var,))?;

        let result = match req.operation.as_str() {
            "solve" => sympy.call_method1("solve", (expr, x))?,
            "simplify" => sympy.call_method1("simplify", (expr,))?,
            "factor" => sympy.call_method1("factor", (expr,))?,
            "expand" => sympy.call_method1("expand", (expr,))?,
            "differentiate" => sympy.call_method1("diff", (expr, x))?,
            "integrate" => sympy.call_method1("integrate", (expr, x))?,
            "latex" => sympy.call_method1("latex", (expr,))?,
            _ => return Ok(format!("Unknown operation: {}", req.operation)),
        };

        Ok(result.to_string())
    })
}
