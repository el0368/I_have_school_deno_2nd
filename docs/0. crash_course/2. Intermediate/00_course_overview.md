# ================================================================================ THE COMPLETE DENO FRESH BOOTCAMP: INTERMEDIATE LEVEL

# Instructor: GitHub Copilot Level: Intermediate Prerequisites: Complete the Beginner level first (1. Beginner/) Estimated Time: 4-5 hours total Project: A fully working Notes App with a REST API, auth middleware, reactive Islands with advanced Signals, and a real test suite

Welcome back! If you have finished the Beginner level, you already know: ✓ How
Deno works and how deno.json is configured ✓ Fresh 2.x routing and the Islands
Architecture ✓ Basic Preact Signals (signal()) ✓ MDX pages and the mdx-routes.ts
registry ✓ TypeScript basics: types, interfaces, optional props ✓ JSX rules and
how to build components ✓ Vite config and basic styling

This level goes DEEPER. You will move from "I can read and follow code" to "I
can design and build features from scratch".

The theme of this level: EVERYTHING IN THIS PROJECT IS MORE REAL.

- Not just a Counter — build a full mini REST API
- Not just `signal()` — use `computed()` and `effect()`
- Not just basic types — use generics and utility types
- Not just write code — TEST your code with Deno's built-in test runner
- Not just one route — understand middleware and the full request pipeline

---

## COURSE SYLLABUS

MODULE 1: Advanced TypeScript --> 01_advanced_typescript.txt +--> Generics:
write functions that work with ANY type, safely +--> Union types and type
narrowing (type guards) +--> Discriminated unions: model complex state elegantly
+--> Utility types: Partial<T>, Readonly<T>, Pick<T,K>, Record<K,V> +--> Async
functions and proper return types: Promise<T> +--> Real examples taken from this
project's source code

MODULE 2: Advanced Signals & State --> 02_advanced_signals_and_state.txt +-->
Recap: signal() vs useSignal() and WHY they differ +--> computed(): derive
values automatically from other signals +--> effect(): run side-effects when
signals change +--> Batch updates to avoid unnecessary re-renders +--> Sharing
state BETWEEN two Islands on the same page +--> Pattern: signal store (a single
source of truth object) +--> Pattern: form state management with Signals

MODULE 3: API Routes Deep Dive --> 03_api_routes_deep_dive.txt +--> How API
routes differ from page routes in Fresh +--> The define.handlers() pattern from
utils.ts explained +--> Handling all HTTP methods: GET, POST, PUT, DELETE +-->
Parsing the request body (JSON, FormData) +--> Sending typed JSON responses with
proper status codes +--> Error handling: try/catch patterns in handlers +--> The
existing [name].tsx route explained line by line +--> Build a full CRUD notes
API from scratch

MODULE 4: Middleware & The Request Pipeline --> 04_middleware_and_pipeline.txt
+--> What middleware IS and why it exists +--> The ctx.next() chain explained
with ASCII diagram +--> ctx.state: passing data from middleware to
handlers/pages +--> The existing middleware in main.ts explained +--> Writing a
request logger middleware +--> Writing a simple auth-guard middleware +-->
_middleware.ts files: scoped middleware per route folder +--> Execution order:
global vs scoped middleware

MODULE 5: Testing with Deno --> 05_testing_with_deno.txt +--> Deno's built-in
test runner (no Jest, no Mocha needed) +--> The Deno.test() function: structure
and options +--> The @std/assert library: assertEquals, assertThrows, etc. +-->
The existing logic.test.ts file explained +--> Unit testing: testing pure
functions in isolation +--> Integration testing: testing API route handler logic
+--> Test organisation: test files, naming, grouping with steps +--> Running
tests: `deno test`, `--filter`, `--watch`

MODULE 6: Advanced Fresh Patterns --> 06_advanced_fresh_patterns.txt +-->
Layouts: _layout.tsx for shared navigation/wrappers +--> Multiple layouts:
different layouts per route group +--> The define.page() and define.handlers()
pattern in depth +--> Handler + Page in the same file (the "route module"
pattern) +--> Dynamic routes: [name].tsx, [...slug].tsx (catch-all) +-->
Programmatic redirect and error responses +--> Head management: per-page <title>
and <meta> tags

MODULE 7: Hands-On — The Notes App --> 07_hands_on_notes_app.txt +--> Build a
Notes App end-to-end using ALL intermediate concepts +--> Step 1: Data model
(TypeScript interface + in-memory store) +--> Step 2: API routes (GET
/api/notes, POST, DELETE) +--> Step 3: Auth middleware (simple API key check)
+--> Step 4: NotesIsland — reactive Island with computed() + effect() +--> Step
5: Unit tests for the data layer +--> Step 6: Integration test for the API route
+--> Common intermediate errors and how to fix them

---

## WHAT YOU WILL BUILD

By the end of this course you will have added to the project:

routes/ api/ notes.tsx <-- Full CRUD REST API for notes notes.tsx <-- Page route
using handler + page in one file _middleware.ts <-- Auth guard for the /api/
folder

islands/ NotesIsland.tsx <-- Reactive Island: add/delete notes live

logic.test.ts <-- Expanded: real unit + integration tests

Key concepts you will understand deeply:

- How the request travels from browser → middleware → handler → response
- Why computed() is better than manually recalculating in render
- Why generics make your code reusable without sacrificing type safety
- How to test code that talks to "fake" data without a real database

---

## HOW TO USE THIS COURSE

Each module file is self-contained. You can read them in order or jump to the
topic you need most. All code examples are based on the ACTUAL files in this
repository, so you can always find the real version to compare.

RECOMMENDED WORKFLOW:

1. Read the module file completely ONCE (don't write code yet)
2. Open your editor side-by-side with the module file
3. Start `deno task dev` in your terminal
4. Write the code as you re-read the file
5. Save, watch the hot reload, verify it works
6. Run `deno test` after completing Module 5

STARTING THE DEV SERVER: deno task dev Open: http://localhost:5174

RUNNING TESTS: deno test deno test --watch (auto re-runs when files change) deno
test --filter "API" (only run tests whose name contains "API")

================================================================================
