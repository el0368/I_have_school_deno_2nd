Here is the updated verdict for your application's architecture, clearly
dividing responsibilities between the server and the client to maximize
performance while prioritizing user data sovereignty.

### Server-Side Responsibilities

The bulk of your application’s heavy lifting and routing logic belongs on the
server.

- **MDX Compilation:** Deno compiles your MDX content into JSX and runs it on
  the server. Once the HTML is produced, the complex JavaScript logic is
  discarded. The browser only receives lightweight, static HTML.
- **Regular Components:** Standard UI elements that do not require user
  interaction run entirely on the server. They do not ship any JavaScript to the
  browser.
- **Dynamic Routing (The "Magic" Template):** Instead of creating individual
  routes for every lesson, a single dynamic template like
  `routes/learn/[subject]/[lesson].tsx` handles the logic. This server-side code
  intercepts the URL request, retrieves the appropriate `.mdx` file from the
  `curriculums/` folder, and wraps it in your unified layout.
- **Content Separation:** Keeping pure code in the `routes/` folder and pure
  content in the `curriculums/` folder allows you to control the layout
  centrally. You can design a sidebar once on the server, and it applies
  instantly to all lessons.
- **Telemetry Aggregation (Optional):** If users explicitly opt-in to data
  sharing, the server hosts an isolated API route to receive and aggregate
  strictly anonymized statistical data, ensuring curriculum improvements can be
  tracked without storing personal user profiles.

### Client-Side Responsibilities

The client side should be strictly reserved for features requiring immediate
interactivity, offline data persistence, and privacy controls.

- **Preact Islands:** Any highly interactive elements, such as quizzes or
  counters, must be isolated within the `/islands/` directory. These are the
  only UI components that ship JavaScript to the user's browser.
- **Offline Data Storage:** To support a robust desktop and mobile experience
  via Tauri, user data is managed locally. Information such as student progress,
  mastery levels, and history is stored on the client side using the PGlite
  (WASM PostgreSQL) database, enabling the application to function perfectly
  without an internet connection.
- **Explicit Consent & Telemetry Sync:** The client application acts as the
  strict gatekeeper for user privacy. It presents the user with a clear prompt
  asking if they wish to share "anonymous usage statistics to help improve the
  academy." If they decline, the background sync never activates, and their
  PGlite database remains entirely isolated on their device. If they consent,
  the client is responsible for packaging and sending only anonymized events
  back to the server.
