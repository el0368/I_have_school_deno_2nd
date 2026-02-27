Your intuition is completely correct. Having different types of questions and
handling them differently is exactly how you protect your server from crashing.

To answer your question directly: **Yes, `mathsteps` can easily do both.** When
you pass an equation into `mathsteps`, it programmatically generates an array (a
list) of every single mathematical step.

- **If you only need the final answer:** You simply write your code to grab the
  very last item in that array and ignore the rest.
- **If the student clicks "Show Hint":** Your code loops through the entire
  array and displays the step-by-step breakdown on the screen.

Here is how this specifically impacts your server load and architecture:

### 1. The "Final Answer Only" Benefit (Zero Server Load)

For simple questions (like $5x + 10 = 25$), the student just wants to type in
`3` and hit Enter. Because `mathsteps` runs entirely inside the student's
browser via JavaScript/WASM, the browser evaluates the math, checks the answer,
and turns the progress box green.

**Server Cost: 0% CPU.** The Axum backend does not even know the student
answered a question until the browser sends a tiny database update saying, "Add
1 to the streak."

### 2. The "Show Steps" Benefit (Still Zero Server Load for K-8)

If a 6th grader is struggling with that same equation and clicks "Show Steps,"
`mathsteps` will instantly render:

1. $5x = 25 - 10$
2. $5x = 15$
3. $x = 3$

Because `mathsteps` already calculated this in the browser the moment the page
loaded, showing these steps is instant. Again, it never talks to your cloud
server. **Server Cost: 0% CPU.**

### 3. When does it actually hit the server?

The only time you load the server is when you reach questions that `mathsteps`
cannot solve. When a high school student asks for the steps to integrate
$\int (3x^2 + 2x) dx$, `mathsteps` will fail because it does not know calculus.

At that exact moment, your Deno frontend says, _"I don't know this, send it to
the heavy engine."_ It fires an API request to your Rust/Axum server. SymPy
kicks in, computes the calculus steps, and sends the data back to the browser.

### The Question Design Strategy

When you build your MDX files, you will define the `type` of question in the
frontmatter metadata. You will likely have three main types:

1. **`type: "evaluate"`** (Standard K-8 math. Handled entirely by `mathsteps` in
   the browser for just the final answer.)
2. **`type: "multiple_choice"`** (Even faster. The browser just checks if the
   clicked button matches a hardcoded string. Requires no math engine at all.)
3. **`type: "deep_symbolic"`** (Advanced algebra and calculus. Sent to
   Axum/SymPy to validate if the student's typed expression is mathematically
   equivalent to the correct answer.)

By routing the simple "just need the answer" questions to the browser, you
reserve 100% of your cloud server's CPU power exclusively for the high-level
advanced mathematics.
