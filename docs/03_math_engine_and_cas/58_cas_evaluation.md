The choice of a Computer Algebra System (CAS) defines the absolute mathematical
ceiling of an educational platform. Evaluating these options requires looking at
empirical limitations rather than just deployment convenience.

Here is the direct breakdown of how these specific engines align with a "Grade 1
to PhD" objective.

### 1. Using TS/JS or WASM (`mathcore`, `math.js`, `nerdamer`)

Relying entirely on a JavaScript or lightweight WASM CAS presents a hard
mathematical ceiling.

- **The Mathematical Limit:** Pure TS/JS libraries like `math.js` or `algebrite`
  are excellent for evaluating basic algebra, polynomials, and simple matrices.
  However, they lack the massive, peer-reviewed algorithmic depth required for
  university-level mathematics. They cannot solve complex differential
  equations, compute tensor calculus, or handle advanced discrete mathematics.
- **The Educational Value:** They are highly useful for instantaneous, offline
  feedback for Grades 1 through 8. If a student types $2x + 4 = 8$, a TS library
  can validate it locally in zero milliseconds.
- **The Verdict:** A TS/JS/WASM CAS is an excellent "Tier 1" tool for a
  frontend, but it completely fails the "PhD-level" requirement.

### 2. Using Symbolica on the Server

Technologically, deploying Symbolica on a Rust/Axum server is incredibly
efficient. It eliminates the Python GIL, requires no PyO3 FFI bridging, and
executes calculations in microseconds. However, it fails the educational and
commercial requirements.

- **The Research vs. Education Divide:** Symbolica was engineered specifically
  for high-energy physics computations at CERN. Its core optimization is
  collapsing massive expressions into a single final answer as fast as possible.
  It is explicitly not designed to record or output the intermediate,
  step-by-step algebraic derivations that a student needs to learn a concept.
- **The License Constraint:** Symbolica uses a "Source Available" license, not a
  permissive open-source license like MIT or BSD. Using it in a commercial,
  subscription-based backend requires purchasing a commercial license, adding
  significant financial overhead.
- **The Verdict:** Symbolica is the wrong tool for an educational academy. A
  fast final answer with no explanation has very little value to a student
  trying to learn the material.

### 3. The SymPy Reality (Your Current Stack)

There is a reason why SymPy remains the standard in open-source educational
technology.

- **Step-by-Step Generation:** Because SymPy builds a highly detailed Abstract
  Syntax Tree (AST) of every equation, developers can write AST walkers (like
  the open-source `sympy-gamma` project) to extract every intermediate step:
  subtracting from both sides, dividing, applying the power rule, etc.
- **Algorithmic Completeness:** It contains decades of contributed,
  peer-reviewed modules for almost every branch of mathematics.

### The Pragmatic Architecture

If the goal is to provide a comprehensive, commercial-grade curriculum, the
current hybrid architecture is the most realistic path:

1. **The Fast Path (Client):** Use simple TS/JS logic to validate basic
   arithmetic and graphing directly in the browser so young students experience
   zero lag.
2. **The Deep Path (Server):** Keep the Rust + PyO3 + SymPy microservice on the
   server. When a student reaches calculus or requires a step-by-step breakdown,
   the request is routed to SymPy.

The computational "slowness" of Python is a server-side scaling issue, not a
mathematical limitation. It is always easier to scale a server to handle Python
traffic than it is to rewrite 15 years of PhD-level mathematics into JavaScript
or Rust.
