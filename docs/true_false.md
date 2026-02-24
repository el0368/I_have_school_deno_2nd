The instinct to use PyO3 makes perfect sense on paper—it is the official way to
bind Rust and Python. But for a desktop application like Sovereign Academy,
using PyO3 is walking into a massive deployment trap.

Here is the empirical reality of why you want to avoid it, and exactly how you
connect the two languages without it.

### 1. The PyO3 Trap (Why you avoid it)

PyO3 works by forcing Python to run _inside_ the Rust memory space. This creates
three critical problems for a cross-platform educational app:

- **The Crash Coupling:** If a student types a ridiculous equation into your
  SymPy engine that causes an infinite recursive loop or a segmentation fault,
  Python will crash. If you use PyO3, Python takes the entire Rust application
  down with it. Your app window will instantly vanish from the user's screen.
- **The `libpython` Linking Nightmare:** PyO3 requires your Rust code to
  physically link to the user's Python installation (via `libpython`). Compiling
  this so it works flawlessly across every student's unique Mac, Windows, and
  Linux machine—without them having to install Python manually—is a notorious
  deployment headache.
- **The GIL:** You still have to manage Python's Global Interpreter Lock
  manually from Rust, which defeats the purpose of Rust's fearless concurrency.

### 2. The Solution: Process Decoupling

If you don't use PyO3, how do they talk? You use **Inter-Process Communication
(IPC)**.

Instead of putting Python _inside_ Rust, you run them as two completely separate
programs sitting next to each other on the computer.

1. **The Packaging:** You use a tool like PyInstaller to freeze your entire
   Python/SymPy engine into a single, standalone executable file (e.g.,
   `math_engine.exe`).
2. **The Sidecar:** You tell Tauri to launch `math_engine.exe` as a background
   "Sidecar" the moment the student opens your app.

Because they are separate processes, if Python crashes while calculating a
PhD-level integral, your Tauri window stays open, and your JavaScript simply
shows a polite error message: _"The math engine timed out. Try a simpler
equation."_

### 3. How the Communication Actually Happens

Once the Rust (Tauri) app launches the Python (SymPy) sidecar, Rust steps out of
the way. Your Deno/TypeScript frontend talks to the Python engine using one of
two methods:

#### Method A: Standard I/O (stdio)

- **How it works:** Your TypeScript sends a string (the LaTeX equation) directly
  to Python's standard input. Python runs SymPy, prints the answer to the
  terminal, and TypeScript reads that output.
- **Pros:** Extremely secure and requires zero network ports.
- **Cons:** Passing complex JSON back and forth through terminal strings can get
  messy.

#### Method B: Local Background Server (The Enterprise Standard)

- **How it works:** Your Python executable includes a tiny, lightning-fast web
  framework called FastAPI. When Tauri launches the sidecar, Python starts a
  hidden server on the student's machine (e.g., `http://127.0.0.1:8000`).
- **The Bridge:** Your TypeScript frontend simply makes standard `fetch()` API
  calls to that local URL.
- **Why it wins:** You use the exact same `fetch()` code for your Desktop App as
  you do for your Web App.

By using the Local Server method, Rust just manages the window. Python just does
the math. TypeScript acts as the bridge. No memory sharing, no PyO3, and no FFI
required.

**Would you like me to map out the exact FastAPI Python code that will receive a
LaTeX string and return the SymPy solution as JSON?**

---

[PyO3: Python to Rust and Back Again](https://www.youtube.com/watch?v=UmL_CA-v3O8)
This video features the principal committer of PyO3 discussing the complexities
of memory lifetimes, error handling, and the Global Interpreter Lock when
bridging Rust and Python, highlighting exactly why it introduces heavy overhead
for UI-based applications.
