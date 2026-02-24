// ============================================================================
// Math Engine — Axum + PyO3 Server
// ============================================================================
// Starts an HTTP server on :8080 that accepts math requests from Deno Fresh
// and solves them using SymPy via the embedded Python interpreter.

mod routes;

use axum::Router;
use std::time::Duration;
use tower_http::cors::CorsLayer;
use tower_http::timeout::TimeoutLayer;

#[tokio::main]
async fn main() {
    // Initialize structured logging
    tracing_subscriber::fmt::init();

    // Build the Axum router
    let app = Router::new()
        .merge(routes::math_routes())
        .layer(CorsLayer::permissive())
        .layer(TimeoutLayer::new(Duration::from_secs(30)));

    let addr = "0.0.0.0:8080";
    tracing::info!("Math engine listening on {addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
