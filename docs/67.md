The architecture will pivot entirely to a pure, cloud-first web platform. To
build a true Khan Academy clone, the system must be fully online, centralized,
and database-driven so that user progress, streaks, and analytics are synced
instantly across any device via the web browser.

Here is the enterprise-grade, cloud-first blueprint using your Deno and Fresh
stack.

### 1. The Cloud Database (The Source of Truth)

To track mastery and progress like Khan Academy, you cannot rely on local files
or browser state. Every action a student takes must be recorded in a centralized
cloud database.

- **The Technology:** Use a serverless, edge-compatible database like **Supabase
  (PostgreSQL)**, **Neon**, or **Deno KV**.
- **The Schema:** You need three core tables:
- `Users`: Authentication and global points.
- `Topic_Mastery`: Tracks the student's "Streak" (e.g., 5 correct in a row) for
  specific topics like `linear_equations`.
- `Exercise_Logs`: A ledger of every individual question attempted, what they
  inputted, and whether it was correct (crucial for analytics).

### 2. The API-Driven Practice Flow

Instead of loading everything into the browser at once, the practice session
communicates continuously with the server.

1. **The Request:** A student goes to `yourdomain.com/practice/algebra`.
2. **The Server Fetch:** Your Fresh backend (`routes/practice/[topic].tsx`)
   queries the PostgreSQL database to check the student's current mastery level.
3. **The Generation:** The server generates a unique "Seed" and builds the first
   math problem.
4. **The Client Render:** The browser only receives the data for _one_ question.
5. **The Submission:** When the student clicks "Check Answer", the
   `<PracticeIsland />` sends a JSON payload to your backend
   (`/api/math/check`).
6. **The Cloud Update:** The server verifies the math, updates the database
   streak, and returns `{"correct": true, "new_streak": 4}` along with the
   _next_ question.

### 3. Content Management (MDX to Database Bridge)

Khan Academy uses a Headless CMS, but you can keep your MDX files as your
"Authoring Environment" while still acting like a cloud platform.

- **The Build Step:** You write your lesson text and practice blueprints in MDX
  files in your code editor.
- **The Sync:** When you deploy your app to your server (e.g., pushing to
  GitHub), a script parses those MDX files and uploads the "Blueprints" into
  your PostgreSQL database.
- **The Execution:** When users are online, the app pulls the practice rules
  directly from the high-speed database, not from reading the file system. This
  allows you to scale to millions of users without file I/O bottlenecks.

### 4. Edge Deployment

To ensure the math renders instantly for a student anywhere in the world, the
application is deployed to the **Edge** rather than a single local machine.

- Deploy the Deno/Fresh application using **Deno Deploy** or a scalable **VPS**.
- The heavy computing (like the SymPy Python engine) sits behind an API on a
  cloud server.
- When the web frontend needs to generate a complex pedagogical step-by-step
  hint, it makes an HTTP request to your Python math service, which crunches the
  numbers and sends the LaTeX back to the browser.

### The Immediate Next Step

To implement this pure online model, the focus shifts to the backend
infrastructure.

Would you like to design the PostgreSQL database schema for the `Topic_Mastery`
and `Exercise_Logs` tables so your Fresh API routes can start tracking student
streaks?
