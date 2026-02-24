// ============================================================================
// Route Registration
// ============================================================================

mod solve;

use axum::{Router, routing::post};

pub fn math_routes() -> Router {
    Router::new()
        .route("/solve", post(solve::solve_handler))
        .route("/health", axum::routing::get(health))
}

async fn health() -> &'static str {
    "ok"
}
