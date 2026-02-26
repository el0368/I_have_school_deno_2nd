To generate infinite variations of a single question type, the standard practice
is to move away from writing static math problems and move toward **Procedural
Generation**.

Instead of writing a specific question, you create a "Question Blueprint" that
uses mathematical logic to build the problem at the moment the student clicks
"Practice."

Here is exactly how to implement this within a math curriculum.

### 1. The Blueprint (MDX Template)

Instead of writing "What is $12 + 15$?", you define the "Shape" of the problem
in your MDX topic file. You use placeholders for the numbers that will change.

- **Template:** "Solve for $x$: $[A]x + [B] = [C]$"
- **Rules:**
- $[A]$ must be a random integer between 2 and 10.
- $[B]$ must be a random integer between 1 and 20.
- $[C]$ must be calculated based on a chosen answer to ensure the math stays
  clean.

### 2. The "Answer-First" Generation Strategy

The biggest mistake in generating math questions is picking random numbers for
the problem first. This often results in messy answers (like $x = 3.4219...$).
To keep the math clean for students, you must **work backward**.

To generate a Linear Equation where the answer is always a whole number:

1. **Pick the Answer ($x$):** Randomly choose an integer (e.g., $x = 5$).
2. **Pick the Coefficient ($A$):** Randomly choose an integer (e.g., $A = 3$).
3. **Pick the Constant ($B$):** Randomly choose an integer (e.g., $B = 2$).
4. **Calculate the Result ($C$):** Run the math: $(3 * 5) + 2 = 17$.
5. **Display to Student:** "Solve for $x$: $3x + 2 = 17$".

Because you picked the answer first, the student is guaranteed to find a clean
result, even though the numbers appear completely random to them.

### 3. Using a "Seed" for Infinite Variety

To manage these random questions, you use a **Random Seed**. A seed is a single
number that acts as the "key" to a specific set of random variables.

- When a student starts a practice session, the system generates a random seed
  (e.g., `8821`).
- That seed is sent to the math engine.
- The engine uses that specific seed to "pick" the numbers for $[A]$, $[B]$, and
  $[x]$.
- **The Benefit:** If the student refreshes the page, the same seed `8821` will
  generate the exact same $3x + 2 = 17$. If they want a new question, the system
  just generates a new seed like `8822`, which creates $7x + 4 = 39$.

### 4. Implementation in the Relay Architecture

The generation logic lives in different places depending on the grade level:

- **K-8 (Mathsteps/WASM):** The "Blueprint" is sent to the student's browser. A
  small TypeScript function uses the seed to pick the numbers and display the
  problem instantly.
- **High School - College (Rust/Python):** The Deno frontend sends the "Topic
  ID" and "Seed" to the Rust server. The Rust server calls a Python script that
  uses **SymPy** to generate the equation string, the correct answer, and the
  step-by-step solution. The server sends this data back as JSON for the
  frontend to render.

### 5. Managing Different Interaction Types

You use the same "Answer-First" logic for all six types of exercises:

- **Multiple Choice:** Generate the correct answer, then use the engine to
  generate "Distractors" (wrong answers) by intentionally making common errors
  (e.g., forgetting a negative sign).
- **Ordered Steps:** Use the engine to generate the 5 correct steps for the
  problem, then shuffle them.
- **Symbolic/Scribble:** The engine simply provides the final "Answer Key"
  string that the student's input must match mathematically.

### Summary of the Workflow

1. **MDX File:** Holds the "Topic Blueprint" (the shape and the rules).
2. **Deno Frontend:** Generates a "Seed" and asks the engine for a problem.
3. **Math Engine:** Uses the seed and the rules to build a problem "backward"
   from a clean answer.
4. **Practice Island:** Displays the generated numbers to the student in the
   chosen format (Multiple Choice, Scribble, etc.).

By focusing on the **Logic of the Problem** rather than the **Text of the
Problem**, one single MDX file becomes a source of 10,000 unique, mathematically
perfect exercises.
