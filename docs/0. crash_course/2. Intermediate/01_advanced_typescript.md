# ================================================================================ MODULE 1: ADVANCED TYPESCRIPT

Estimated Time: 45 minutes Prerequisites: Module 5 of the Beginner level (basic
types, interfaces) Learning Objectives:

- Write generic functions that are type-safe for any data type
- Use union types and type guards to handle multiple possible shapes
- Model complex application state with discriminated unions
- Apply utility types to transform existing interfaces
- # Write properly-typed async functions

In the Beginner level you learned the basic types: string, number, boolean, and
how to write an interface for component props. That is enough to READ code. This
module teaches what you need to DESIGN and BUILD new features.

---

## LESSON 1: GENERICS — ONE FUNCTION FOR ALL TYPES

Imagine you want a function that wraps any value in an array.

WITHOUT generics (bad — loses type info): function wrapInArray(value: any):
any[] { return [value]; } const result = wrapInArray("hello"); // result is
any[] — TypeScript is blind! result[0].toUpperCase(); // No autocomplete, no
safety

WITH any you lose all TypeScript benefits. The solution is GENERICS.

A generic is a TYPE PARAMETER — a placeholder for a type that gets filled in
when the function is called:

function wrapInArray<T>(value: T): T[] { return [value]; }

const strings = wrapInArray("hello"); // T is inferred as string -> string[]
const numbers = wrapInArray(42); // T is inferred as number -> number[]

strings[0].toUpperCase(); // ✓ TypeScript knows this is a string!
numbers[0].toFixed(2); // ✓ TypeScript knows this is a number!

The <T> is just a name (T is convention for "Type"). You can use any name:
function firstItem<Item>(arr: Item[]): Item | undefined { return arr[0]; }

GENERICS IN INTERFACES: interface ApiResponse<TData> { data: TData; status:
number; message: string; }

// Specialise it for different response shapes: type UserResponse =
ApiResponse<{ name: string; age: number }>; type NotesResponse = ApiResponse<{
id: string; text: string }[]>;

// Now TypeScript knows the exact shape of .data for each: const user:
UserResponse = { data: { name: "Alice", age: 25 }, status: 200, message: "OK" };
user.data.name; // ✓ TypeScript knows .name exists

PROJECT CONNECTION: The utils.ts file uses a generic internally: export const
define = createDefine<State>(); The <State> here passes your State interface
into Fresh's generic factory. This is why ctx.state.shared is type-safe —
TypeScript knows sharing is a string.

WHEN TO REACH FOR GENERICS: Ask yourself: "Am I writing the same
function/interface for different types?" If yes — generics are the answer.

---

## LESSON 2: UNION TYPES AND TYPE NARROWING

A UNION TYPE says "this value can be ONE of these types":

type Status = "loading" | "success" | "error"; type Id = string | number;

function greet(id: Id) { console.log("Hello user " + id); // Works for both
string and number }

TYPE NARROWING — telling TypeScript which specific type you have:

function formatId(id: Id): string { if (typeof id === "string") { // Here
TypeScript KNOWS id is a string return id.toUpperCase(); } else { // Here
TypeScript KNOWS id is a number return id.toFixed(0); } }

This is called "narrowing" because you narrow the union down to one type.

REAL USE CASE — An API result type: type ApiResult<T> = | { status: "loading" }
| { status: "success"; data: T } | { status: "error"; message: string };

function handleResult(result: ApiResult<string>) { if (result.status ===
"loading") { return "Loading..."; } else if (result.status === "success") {
return result.data.toUpperCase(); // ✓ .data only exists here } else { return
"Error: " + result.message; // ✓ .message only exists here } }

---

## LESSON 3: DISCRIMINATED UNIONS — MODELLING COMPLEX STATE

A discriminated union is a union where each member has a common LITERAL field
(the "discriminant") that acts as a tag. You saw the pattern above with
"status".

This is the BEST way to model states that cannot occur simultaneously:

// BAD: Vague interface (data? and error? can both be set — nonsense!) interface
BadState { isLoading: boolean; data?: string[]; error?: string; }

// GOOD: Discriminated union — each state is crystal clear type AppState = | {
kind: "idle" } | { kind: "loading" } | { kind: "loaded"; notes: string[] } | {
kind: "failed"; reason: string };

Now when you switch on `kind`, TypeScript gives you exactly the right
properties: function renderState(state: AppState) { switch (state.kind) { case
"idle": return <p>Press Load to start</p>; case "loading": return

<p>Loading...</p>; case "loaded": return <ul>{state.notes.map(n =>
<li>{n}</li>)}</ul>; // ✓ .notes exists case "failed": return <p>Error:
{state.reason}</p>; // ✓ .reason exists } }

PROJECT CONNECTION: You will use this pattern in Module 7 (Notes App) to manage
the Island's loading/loaded/error state cleanly.

---

## LESSON 4: UTILITY TYPES — TRANSFORMING EXISTING TYPES

TypeScript has built-in "utility types" that CREATE new types from existing
ones. This avoids duplicating interfaces.

Suppose you have: interface Note { id: string; text: string; createdAt: string;
}

PARTIAL<T> — Makes ALL properties optional: type NoteUpdate = Partial<Note>; //
Equivalent to: { id?: string; text?: string; createdAt?: string; } // Useful
for: PATCH/PUT endpoints where only some fields are sent

READONLY<T> — Makes ALL properties read-only: type FrozenNote = Readonly<Note>;
const note: FrozenNote = { id: "1", text: "Hello", createdAt: "2026-01-01" };
note.text = "New"; // ERROR: Cannot assign to 'text' because it is read-only //
Useful for: Data that should never change after creation

PICK<T, K> — Keep ONLY specific properties: type NotePreview = Pick<Note, "id" |
"text">; // Equivalent to: { id: string; text: string; } // Useful for: API
responses that should not expose all fields

OMIT<T, K> — Remove specific properties: type NoteWithoutId = Omit<Note, "id">;
// Equivalent to: { text: string; createdAt: string; } // Useful for: "create"
request bodies (the server generates the id)

RECORD<K, V> — A map / dictionary type: type NoteStore = Record<string, Note>;
// Equivalent to: { [key: string]: Note } // Useful for: In-memory "database"
(id -> note mapping)

COMBINING UTILITIES: type CreateNoteRequest = Omit<Note, "id" | "createdAt">; //
Only { text: string } — the user only provides the text type NoteResponse =
Readonly<Note>; // The server sends back a frozen note

---

## LESSON 5: ASYNC FUNCTIONS AND PROMISE<T>

All API calls and file reads in Deno are async. Here is how to type them.

A function that RETURNS a Promise must declare it: async function fetchNote(id:
string): Promise<Note> { const response = await fetch(`/api/notes/${id}`); const
data = await response.json(); return data as Note; }

async function deleteNote(id: string): Promise<void> { await
fetch(`/api/notes/${id}`, { method: "DELETE" }); // Returns nothing — use
Promise<void> }

TYPING FETCH RESPONSES: async function getNotes(): Promise<Note[]> { const res =
await fetch("/api/notes"); if (!res.ok) { throw new
Error(`HTTP error! status: ${res.status}`); } const json: Note[] = await
res.json(); return json; }

The `as Note[]` cast tells TypeScript to trust the server. In a production app
you would use a validation library (like Zod) — but for this project, the cast
is fine.

PROJECT CONNECTION — The [name].tsx handler:

export const handler = define.handlers({ GET(ctx) { const name =
ctx.params.name; return new Response(`Hello, ${name}!`); }, });

The `define.handlers()` wrapper makes `ctx` fully typed. `ctx.params.name` is
typed as string because of the [name] filename. The return type `Response` is
correct for a non-page API route.

---

## LESSON 6: TYPE GUARDS — CUSTOM NARROWING FUNCTIONS

Sometimes `typeof` is not enough. For objects, write a TYPE GUARD function:

function isNote(value: unknown): value is Note { return ( typeof value ===
"object" && value !== null && "id" in value && "text" in value && "createdAt" in
value ); }

The magic is `value is Note` as the return type. When this function returns
true, TypeScript treats `value` as a `Note` in the surrounding scope:

const parsed: unknown = JSON.parse(rawData); if (isNote(parsed)) {
console.log(parsed.text); // ✓ TypeScript knows this is a Note }

WHERE YOU WILL USE THIS: In Module 3 (API Routes) when parsing request bodies.
The client sends JSON that arrives as `unknown`. A type guard validates it
safely before you use it.

---

## QUICK REFERENCE TABLE

CONCEPT SYNTAX WHEN TO USE

---

Generic function function f<T>(x: T): T Same logic, any type Generic interface
interface Res<T> { d: T } Reusable response shapes Union type string | number
Multiple allowed types Literal union "a" | "b" | "c" Enum-like fixed values Type
narrowing if (typeof x === "string") Handle union branches Discriminated union {
kind: "a" } | { kind: "b"} Model exclusive states Partial<T> Partial<Note>
Optional update payloads Readonly<T> Readonly<Note> Immutable data Pick<T, K>
Pick<Note, "id" | "text"> Subset of properties Omit<T, K> Omit<Note, "id">
Remove specific props Record<K, V> Record<string, Note> Dictionary / map
Promise<T> Promise<Note[]> Async return type Type guard value is Note Validate
unknown data

---

## MINI QUIZ

1. What is the difference between `any` and a generic `<T>`? A) There is no
   difference B) `any` discards type info; generics preserve it C) Generics are
   slower at runtime D) `any` is only for arrays

2. Which utility type would you use while building a "create note" form where
   the ID is generated by the server? A) Partial<Note> B) Readonly<Note> C)
   Omit<Note, "id" | "createdAt"> D) Record<string, Note>

3. What does the `value is Note` return type annotation do? A) It makes the
   function return a Note B) It tells TypeScript to narrow `value` to Note when
   the function returns true C) It throws an error if value is not a Note D) It
   is just documentation — no effect

4. A discriminated union has a "discriminant" field. What must it be? A) A
   boolean B) A number C) A UNIQUE LITERAL value in each union member D) An
   interface

Answers: 1-B, 2-C, 3-B, 4-C

================================================================================
