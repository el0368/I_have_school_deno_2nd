# Math Engine — Rust + Axum + PyO3

A standalone HTTP microservice that exposes SymPy's CAS (Computer Algebra
System) to the Deno Fresh frontend.

## Prerequisites

1. **Rust toolchain**:
   `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. **Python 3 + SymPy**:
   ```bash
   pip install sympy
   # or on Ubuntu/Debian:
   apt install python3-pip && pip install sympy
   ```

## Running

```bash
# From the project root:
deno task math:dev    # dev mode (recompiles, no optimizations)
deno task math        # release mode (optimized, for production)

# Or directly from this folder:
cargo run             # dev
cargo run --release   # production
```

Server starts on `http://0.0.0.0:8080`.

## Endpoints

| Method | Path      | Description                         |
| ------ | --------- | ----------------------------------- |
| `GET`  | `/health` | Readiness check — returns `"ok"`    |
| `POST` | `/solve`  | Solve a math expression using SymPy |

### POST /solve

**Request body:**

```json
{
  "expression": "x**2 + 5*x + 6",
  "operation": "solve",
  "variable": "x"
}
```

**Supported operations:**

| Operation       | SymPy call                 | Example                          |
| --------------- | -------------------------- | -------------------------------- |
| `solve`         | `sympy.solve(expr, x)`     | `x**2 - 4` → `[-2, 2]`           |
| `simplify`      | `sympy.simplify(expr)`     | `sin(x)**2 + cos(x)**2` → `1`    |
| `factor`        | `sympy.factor(expr)`       | `x**2 + 5*x + 6` → `(x+2)(x+3)`  |
| `expand`        | `sympy.expand(expr)`       | `(x+2)*(x+3)` → `x**2 + 5*x + 6` |
| `differentiate` | `sympy.diff(expr, x)`      | `x**3` → `3*x**2`                |
| `integrate`     | `sympy.integrate(expr, x)` | `x**2` → `x**3/3`                |
| `latex`         | `sympy.latex(expr)`        | `x**2/2` → `\frac{x^{2}}{2}`     |

**Response body:**

```json
{
  "result": "[-3, -2]",
  "operation": "solve",
  "durationMs": 14
}
```

## Architecture Note

This server runs as a **separate process** from the Deno web server. If this
server crashes, Deno keeps running and shows the student a graceful error
message. `systemd` or Docker will restart this server automatically on a VPS.

This is intentionally different from the **Tauri desktop** pattern (future),
where the Python engine would be launched as a PyInstaller sidecar to avoid
`libpython` linking issues on student machines.
