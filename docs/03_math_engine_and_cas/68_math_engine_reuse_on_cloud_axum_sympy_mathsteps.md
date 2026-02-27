The good news is that pivoting to a Khan Academy-style cloud platform means
**you do not have to throw away your math engines.** Axum, SymPy, and Mathsteps
are still the perfect tools for the job.

What changes is **how you deploy them** so your servers don't crash.

When I mentioned that a complex differential equation can spike CPU usage to
100%, that was a warning against trying to run Python/SymPy on a student's cheap
smartphone. However, in a cloud environment, if 500 students ask your server to
solve an integral at the exact same second, it will also spike your server's CPU
to 100% and crash it.

Here is exactly how you adjust your current stack to handle cloud-scale traffic
without changing the core math logic.

### 1. Axum + SymPy + PyO3 (The Heavy Lifters)

In the offline/local model, Axum was going to be a small binary running quietly
in the background. In the cloud model, Axum becomes a **Scalable Math
Microservice**.

- **The Adjustment (Docker & Auto-Scaling):** You wrap your Axum/Rust backend in
  a Docker container and host it on a service like Google Cloud Run or AWS App
  Runner.
- **How it prevents CPU crashing:** These cloud services monitor your CPU. If
  your Axum server hits 80% CPU because too many students are asking for
  SymPy-Gamma step-by-step solutions, the cloud automatically spins up a second,
  third, or tenth Axum server in seconds to handle the load. When the students
  go to sleep, it scales back down to one server to save you money.
- **The Caching Layer (Crucial for Cloud):** In a global school, thousands of
  students will get the same random seed. You put a fast cache (like Redis) in
  front of Axum. If SymPy calculates the 10-step solution for $x^2 + 5x + 6$,
  you save that result. The next 999 students who get that problem receive the
  cached answer instantly, requiring **0% CPU**.

### 2. Mathsteps (The K-8 Engine)

You actually **keep Mathsteps in the browser**, even for a cloud-first app.

- **The Adjustment (The "Optimistic UI" Pattern):** Khan Academy does not send
  $5 + 7$ to a cloud server to see if it equals $12$. The round-trip network
  delay would make the app feel slow and glitchy.
- **How it works now:** Mathsteps checks the 1st grader's answer instantly in
  the browser. If they are right, the browser immediately plays the "Correct!"
  animation (zero latency). _Simultaneously_, the browser sends a silent API
  request to your Deno/PostgreSQL backend saying, _"Student X got this right,
  update their database streak."_ ### 3. Regarding "Mathcore" To clarify the
  landscape: **Mathcore** (often associated with Wolfram's proprietary MathCore
  or older JS libraries) is generally not needed if you have Mathsteps and
  SymPy.
- **Mathsteps** is perfectly tuned for generating pedagogical steps for
  arithmetic and basic algebra.
- **SymPy/SymEngine** handles everything from advanced high school algebra up
  through university calculus. Adding another engine would only bloat your
  architecture.

### The Cloud Architecture Summary

Your code stays the same, but the "Relay" shifts into the cloud:

1. **The Web Layer (Deno/Fresh):** Handles user logins, serves the MDX webpages,
   and talks to the PostgreSQL database to track progress.
2. **The Client (Mathsteps):** Runs in the student's browser for instant,
   zero-latency feedback on easy math.
3. **The Math Microservice (Axum + SymPy):** Runs on a scalable cloud container.
   Deno asks Axum to solve the hard math. Axum uses PyO3 to run SymPy, caches
   the result, and hands the LaTeX back to Deno.

By separating Deno (which handles the web traffic) from Axum (which does the
heavy CPU math), your platform can scale to millions of users exactly like the
billion-dollar enterprise companies do.
