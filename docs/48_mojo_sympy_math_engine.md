# Mojo + SymPy Math Engine

## What It Is
The `math_engine/` folder is a server-side math microservice powered by **Mojo** (calling **SymPy** via Python interop). It handles PhD-level symbolic math that cannot run in the browser via WebAssembly.

## Why This Stack
- **Mojo**: Compiled, fast, modern language that can import Python libraries directly
- **SymPy**: The gold standard open-source CAS, covering Grade 1 through PhD-level math
- **Why not WASM?**: SymPy depends on Python. Mojo/Python cannot compile to `wasm32-unknown-unknown`
- **Why not Rust/mathcore for this?**: `mathcore` covers basic algebra but lacks calculus, equation solving, limits, series, matrices, and step-by-step heuristics

## Platform Constraint
Mojo's compiler only has a **Linux build**. It does NOT run on Windows natively.

| Task | Where to run |
|---|---|
| Edit `.mojo` files | VS Code on Windows (normal) |
| Run `mojo` / `pixi run` | **WSL (Linux) only** |
| Deno web server | Windows or WSL |
| Build WASM (`wasm-pack`) | Windows or WSL |

## Project Structure
```
math_engine/
├── pixi.toml          ← Committed to Git (the recipe: channels, dependencies)
├── pixi.lock          ← Committed to Git (exact pinned versions)
├── test_sympy.mojo    ← Smoke test verifying Mojo + SymPy work
├── server.mojo        ← (future) HTTP server called by Deno
└── .pixi/             ← NOT in Git (2GB installed packages, in .gitignore)
```

## First-Time Setup (WSL)
Run these commands inside your WSL terminal. The Pixi environment MUST live in the Linux home directory (`~`), NOT on the mounted Windows drive (`/mnt/c/`), because NTFS does not support Linux file permissions.

```bash
# In WSL terminal
cd ~
mkdir math_engine && cd math_engine
cp /mnt/c/GitHub/I_have_school_deno_2nd/math_engine/test_sympy.mojo .
~/.pixi/bin/pixi install    # reads pixi.toml, installs mojo + sympy + python
```

## Running (WSL terminal)
```bash
cd ~/math_engine
~/.pixi/bin/pixi run mojo test_sympy.mojo
```

## Running from Windows / VS Code Terminal (Without Entering WSL)
You can invoke WSL directly from any terminal (Git Bash, PowerShell, Deno task):
```bash
wsl -e bash -c "source ~/.bashrc && cd ~/math_engine && ~/.pixi/bin/pixi run mojo test_sympy.mojo"
```
The `source ~/.bashrc` is required because non-interactive WSL sessions do not load the PATH automatically.

## Expected Output
```
Initializing Mojo Math Engine...
Successfully imported SymPy version: 1.14.0
Original Equation: x**2 + 2*x + 1
Factored Result: (x + 1)**2
Integrated Result: x**3/3 + x**2 + x
LaTeX Output for Deno: \frac{x^{3}}{3} + x^{2} + x

Success! Mojo and SymPy are communicating perfectly.
```

## Adding a New Package
Inside WSL, in `~/math_engine`:
```bash
~/.pixi/bin/pixi add numpy          # example
cp ~/math_engine/pixi.toml /mnt/c/GitHub/I_have_school_deno_2nd/math_engine/
cp ~/math_engine/pixi.lock /mnt/c/GitHub/I_have_school_deno_2nd/math_engine/
```
Always copy `pixi.toml` and `pixi.lock` back to Windows so they are committed to Git.

## Future: Connecting Deno to the Math Engine
When a student submits a math problem, Deno will call the Mojo server like this:

```typescript
// routes/api/solve.ts
const process = new Deno.Command("wsl", {
  args: ["-e", "bash", "-c",
    "source ~/.bashrc && cd ~/math_engine && ~/.pixi/bin/pixi run mojo server.mojo"
  ],
  stdin: "piped",
  stdout: "piped",
});
```

The Mojo server will receive the equation, pass it to SymPy, and return LaTeX back to Deno.

## Production Deployment
On a Linux VPS or Docker container, WSL is not needed. The full project runs natively:
```bash
git clone your-repo
cd math_engine
pixi install
pixi run server
```
