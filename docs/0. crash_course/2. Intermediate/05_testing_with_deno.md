# ================================================================================ MODULE 5: TESTING WITH DENO

Estimated Time: 40 minutes Prerequisites: Module 3 Beginner (routing), Module 3
Intermediate (API routes) Learning Objectives:

- Use Deno's built-in test runner (no Jest, no Mocha, no config)
- Write unit tests for pure functions
- Write integration tests for API handler logic
- Use the @std/assert library assertions
- Organise tests with sub-steps and groups
- # Run tests with useful CLI flags

One of Deno's best features is its BUILT-IN test runner. No installing Jest, no
tsconfig/jest.config.js, no Babel transforms. You just write `Deno.test(...)`
and run `deno test`.

Look at the existing logic.test.ts in this project: import { assertEquals } from
"jsr:@std/assert"; Deno.test("basic math validation", () => { assertEquals(2 +
2, 4); });

That is the ENTIRE test setup. Run it: deno test

You will see: running 1 test from ./logic.test.ts basic math validation ... ok
(2ms) ok | 1 passed | 0 failed (8ms)

---

## LESSON 1: Deno.test() — THE STRUCTURE

BASIC FORM: Deno.test("test description", () => { // test body — throw to fail,
nothing to pass });

ASYNC TESTS: Deno.test("fetch something", async () => { const result = await
someAsyncFunction(); assertEquals(result, expectedValue); });

OPTIONS OBJECT (for more control): Deno.test({ name: "my test", // required fn:
() => { ... }, // required ignore: false, // set true to skip this test only:
false, // set true to run ONLY this test (debug mode) sanitizeOps: true, //
default: warn if async ops leak sanitizeResources: true, // default: warn if
resources leak (files, etc.) });

THE IGNORE FLAG: Deno.test({ name: "todo: implement later", ignore: true, fn: ()
=> {} }); // Shows as "ignored" in output, not "failed"

---

## LESSON 2: THE @std/assert LIBRARY

Import from jsr (Deno's package registry, no npm needed): import { assertEquals,
assertNotEquals, assertStrictEquals, assertThrows, assertRejects, assert,
assertExists, } from "jsr:@std/assert";

FUNCTION EXAMPLE WHAT IT CHECKS

---

assertEquals(a, b) assertEquals(2+2, 4) Deep equality (==) assertNotEquals(a, b)
assertNotEquals("a", "b") NOT equal assertStrictEquals(a,b)
assertStrictEquals(obj, sameRef) Reference equality (===) assert(expr)
assert(arr.length > 0) expr is truthy assertExists(v) assertExists(result) v is
not null/undefined assertThrows(fn) assertThrows(() => badFn()) fn throws
synchronously assertRejects(fn) await assertRejects(async () => ...) async fn
rejects

ASSERTEQUALS IS DEEP: assertEquals({ a: 1 }, { a: 1 }); // ✓ passes — deep equal
assertStrictEquals({ a: 1 }, { a: 1 }); // ✗ fails — different objects

ASSERTTHROWS: assertThrows( () => JSON.parse("not valid json"), SyntaxError, //
Optionally assert the error CLASS "Unexpected token" // Optionally assert the
error MESSAGE contains this );

ASSERTREJECTS (async version): await assertRejects( async () => { await
fetch("http://localhost:9999/does-not-exist"); }, Error, "connection refused" //
The message must contain this string );

---

## LESSON 3: UNIT TESTING — TESTING PURE FUNCTIONS

A PURE FUNCTION has no side effects and returns the same output for the same
input. These are the EASIEST to test. No database, no server, no network.

Suppose you have a utility function in a new file utils/notes.ts: export
function capitalizeFirst(text: string): string { return
text.charAt(0).toUpperCase() + text.slice(1); }

export function formatNote(note: { text: string; createdAt: string }): string {
return `[${note.createdAt.substring(0, 10)}] ${note.text}`; }

Test file logic.test.ts: import { assertEquals } from "jsr:@std/assert"; import
{ capitalizeFirst, formatNote } from "./utils/notes.ts";

Deno.test("capitalizeFirst: uppercases first letter", () => {
assertEquals(capitalizeFirst("hello"), "Hello");
assertEquals(capitalizeFirst("world"), "World"); });

Deno.test("capitalizeFirst: handles empty string", () => {
assertEquals(capitalizeFirst(""), ""); });

Deno.test("formatNote: formats correctly", () => { const note = { text: "Buy
milk", createdAt: "2026-02-21T08:00:00.000Z" }; assertEquals(formatNote(note),
"[2026-02-21] Buy milk"); });

GOOD UNIT TEST PRINCIPLES:

1. One assertion idea per test (split into multiple tests if needed)
2. Test EDGE CASES: empty string, zero, null, very long input
3. Test names should read like specifications: "function: what it does"
4. Tests should be FAST — if it needs a server, it's an integration test

---

## LESSON 4: INTEGRATION TESTING — TESTING HANDLER LOGIC

An integration test tests multiple pieces working together. For API routes, we
test the LOGIC (createNote, deleteNote functions) directly by importing them
from the same file, without spinning up a full HTTP server.

This works because your route file contains both the data logic AND the handler.
You import and test the data functions directly:

// In logic.test.ts: import { assertEquals, assertExists } from
"jsr:@std/assert";

// Import the data functions you want to test: // (To enable this, export them
from your notes.tsx or a separate notes-store.ts) import { createNote,
getAllNotes, deleteNoteById } from "./routes/api/notes.tsx";

Deno.test("createNote: creates a note with id and createdAt", () => { const note
= createNote("Test note");

    assertExists(note.id);
    assertEquals(note.text, "Test note");
    assertExists(note.createdAt);
    assert(note.id.length > 0);

});

Deno.test("getAllNotes: returns all created notes", () => { const before =
getAllNotes().length; createNote("Another note");
assertEquals(getAllNotes().length, before + 1); });

Deno.test("deleteNoteById: returns true when note exists", () => { const note =
createNote("Note to delete"); assertEquals(deleteNoteById(note.id), true); });

Deno.test("deleteNoteById: returns false for unknown id", () => {
assertEquals(deleteNoteById("fake-id-that-does-not-exist"), false); });

TEST ISOLATION ISSUE: In-memory data persists between tests within the same run!
The `createNote` in test 1 is still in the store when test 3 runs.

SOLUTION: Add a cleanup function and use it in each test: export function
clearAllNotes() { Object.keys(store).forEach(k => delete store[k]); }

Then in tests: import { clearAllNotes } from "./routes/api/notes.tsx";

    // Run before each test that needs a clean store:
    Deno.test("createNote: creates correctly", () => {
      clearAllNotes(); // ← reset state
      const note = createNote("Hello");
      assertEquals(getAllNotes().length, 1);
    });

---

## LESSON 5: TEST SUB-STEPS — GROUPING RELATED ASSERTIONS

For complex tests, use `t.step()` to group assertions with named sub-tests:

Deno.test("Notes CRUD flow", async (t) => { clearAllNotes();

    await t.step("create a note", () => {
      const note = createNote("Step test note");
      assertExists(note.id);
    });

    await t.step("it appears in getAllNotes", () => {
      assertEquals(getAllNotes().length, 1);
    });

    await t.step("it can be deleted", () => {
      const id = getAllNotes()[0].id;
      assertEquals(deleteNoteById(id), true);
      assertEquals(getAllNotes().length, 0);
    });

});

If the create step fails, Deno stops and marks subsequent steps as "failed" too.
Output: Notes CRUD flow create a note ... ok (1ms) it appears in getAllNotes ...
ok (0ms) it can be deleted ... ok (0ms)

This reads like a specification document — very useful for complex features.

---

## LESSON 6: RUNNING TESTS — CLI FLAGS

BASIC RUN: deno test

This finds all files matching: *_test.ts / *_test.tsx _.test.ts / _.test.tsx
test.ts / test.tsx test/_.ts / test/_.tsx

WATCH MODE (auto-rerun on file changes): deno test --watch

FILTER — run only tests whose names contain a string: deno test --filter
"createNote" deno test --filter "CRUD"

SPECIFIC FILE: deno test logic.test.ts

VERBOSE OUTPUT (see all test names, not just failures): deno test
--reporter=verbose deno test -v

PERMISSIONS: If your tests read files or make network requests, add permissions:
deno test --allow-net --allow-read

DENO.JSON TASK (add this so you can run `deno task test`): In deno.json, add
under "tasks": "test": "deno test --allow-net --allow-read --reporter=verbose"

Then run: deno task test deno task test --watch

---

## LESSON 7: WHAT TO TEST vs WHAT NOT TO TEST

TEST (High value): ✓ Pure utility functions (string formatting, calculations) ✓
Data layer functions (createNote, deleteNote, filtering) ✓ TypeScript type guard
functions (isNote, isValidEmail) ✓ Business logic (is the user allowed to delete
this note?) ✓ Edge cases (empty input, invalid IDs, null values)

DON'T TEST (Low value or untestable without a browser): ✗ JSX render output
(complex to set up in Deno without a test renderer) ✗ Third-party library
internals (trust them) ✗ Simple getters that just return a value unchanged ✗
Every possible input combination (test representative cases)

THE 80/20 RULE FOR TESTING: Write tests for code that: 1. Has LOGIC (if/else,
switch, calculations) 2. Could silently BREAK (data transformations) 3. Has EDGE
CASES that are hard to spot Skip tests for code that: 1. Just wires things
together (configuration) 2. Is already covered by the framework you are using

---

## EXPANDED logic.test.ts FOR THIS PROJECT

Here is a complete example to add to your logic.test.ts:

import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";

// Test the existing [name].tsx capitalisation logic directly: function
capitaliseName(name: string): string { return name.charAt(0).toUpperCase() +
name.slice(1); }

Deno.test("capitaliseName: single word", () => {
assertEquals(capitaliseName("john"), "John");
assertEquals(capitaliseName("alice"), "Alice"); });

Deno.test("capitaliseName: already capitalised", () => {
assertEquals(capitaliseName("John"), "John"); });

Deno.test("capitaliseName: empty string", () => {
assertEquals(capitaliseName(""), ""); });

Deno.test("basic math validation", () => { assertEquals(2 + 2, 4); // (the
existing test — keep it!) });

Run: deno test --reporter=verbose

Expected output: running 4 tests from ./logic.test.ts capitaliseName: single
word ... ok (1ms) capitaliseName: already capitalised ... ok (0ms)
capitaliseName: empty string ... ok (0ms) basic math validation ... ok (0ms) ok
| 4 passed | 0 failed (5ms)

---

## QUICK REFERENCE

ASSERTION WHAT IT CHECKS

---

assertEquals(a, b) Deep equality assertNotEquals(a, b) Not equal assert(expr)
Truthy assertExists(v) Not null or undefined assertThrows(fn) Sync function
throws assertRejects(fn) Async function rejects

CLI FLAGS

---

deno test Run all tests deno test --watch Re-run on file change deno test
--filter X Only tests whose name contains X deno test -v Verbose (show all test
names) deno test myfile.ts Only that file

FILE NAMING CONVENTIONS (automatically discovered): logic.test.ts notes_test.ts
test/notes.ts

TASK (add to deno.json): "test": "deno test --allow-net --allow-read -v"

---

## MINI QUIZ

1. You want to run ONLY the test named "deleteNote: removes from store". Which
   command works? A) deno test deleteNote B) deno test --filter "deleteNote" C)
   deno test --only "deleteNote" D) deno test --name "deleteNote"

2. Your test file is creating notes but the store from test 1 persists into
   test 2. What is the correct fix? A) Use assertStrictEquals instead of
   assertEquals B) Export and call a clearAllNotes() function at the start of
   each test C) Run `deno test --isolate` D) Move tests to separate files

3. Which assertion should you use to check that createNote() returns an object
   that is not null? A) assertEquals(note, {}) B) assertStrictEquals(note, null)
   C) assertExists(note) D) assert(typeof note === "string")

4. You add `only: true` to one test. What happens when you run `deno test`? A)
   Only that test runs; others are skipped B) That test is skipped; others run
   C) All tests run in parallel D) An error is thrown

Answers: 1-B, 2-B, 3-C, 4-A

================================================================================
