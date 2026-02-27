# ================================================================================ MODULE 5: TYPESCRIPT & JSX FOR BEGINNERS

Estimated Time: 35 minutes Learning Objectives:

- Understand what TypeScript adds on top of JavaScript
- Read and write basic TypeScript: types, interfaces, optional props
- Understand JSX/TSX syntax compared to plain HTML
- Know the rules of JSX that trip up every beginner
- # Read the existing .tsx files in this project with confidence

If you have only ever written JavaScript and HTML, this module is for you. Every
file in this project ends in `.ts` or `.tsx`. This module explains BOTH.

---

## LESSON 1: WHAT IS TYPESCRIPT?

TypeScript is JavaScript with one superpower: TYPES.

In regular JavaScript, you can accidentally do this and only find out at
runtime: function add(a, b) { return a + b; } add("5", 10); // Returns "510"
instead of 15! A nasty bug.

In TypeScript, you declare what TYPE of value each variable should be: function
add(a: number, b: number): number { return a + b; } add("5", 10); // ERROR
caught immediately before you even run the code! // Argument of type 'string' is
not assignable to type 'number'

TypeScript is compiled AWAY at build time. The browser only ever runs
JavaScript. TypeScript is purely a development-time safety net.

DENO + TYPESCRIPT: In Node.js, you need extra tools (ts-node, Babel, Webpack) to
run TypeScript. In Deno, TypeScript is a FIRST-CLASS citizen.
`deno run myfile.ts` just works. No configuration. No extra steps.

---

## LESSON 2: THE BASIC TYPES YOU WILL USE EVERY DAY

Here are the TypeScript types you will encounter in this project:

TYPE EXAMPLE VALUE ANNOTATION SYNTAX

---

string "hello", "world" name: string number 42, 3.14, -5 age: number boolean
true, false isActive: boolean null null value: null undefined undefined data:
undefined any anything (avoid this!) x: any void (function returns nothing) ():
void

ANNOTATING VARIABLES: const name: string = "Alice"; const age: number = 25;
const isLoggedIn: boolean = false;

In practice, TypeScript can INFER the type and you don't need to write it: const
name = "Alice"; // TypeScript knows this is a string automatically const age =
25; // TypeScript knows this is a number automatically

You only need to write the type annotation when TypeScript can't infer it, or
when you want to be explicit for clarity.

ANNOTATING FUNCTION PARAMETERS (you MUST be explicit here): function greet(name:
string): string { return "Hello, " + name; } ^^^^^^^ ^^^^^^ param type return
type

ARRAYS: const numbers: number[] = [1, 2, 3]; const names: string[] = ["Alice",
"Bob"];

UNION TYPES (one of several possible values): let status: "active" | "inactive"
| "pending"; status = "active"; // OK status = "deleted"; // ERROR! "deleted" is
not in the union.

This pattern is used in WarningBox in Module 4: type?: "warning" | "error" |
"info" It means the `type` prop can ONLY be one of those three strings.

---

## LESSON 3: INTERFACES — DEFINING THE SHAPE OF AN OBJECT

An interface describes the SHAPE (property names and types) of an object. It is
the primary tool for defining what props a component accepts.

interface User { name: string; age: number; email: string; }

const alice: User = { name: "Alice", age: 25, email: "a@example.com" }; const
broken: User = { name: "Bob" }; // ERROR: age and email are missing!

OPTIONAL PROPERTIES (use `?`): interface ButtonProps { label: string; //
Required - must always be provided color?: string; // Optional - ok to leave
out, will be undefined disabled?: boolean; // Optional }

// Both of these are valid:
<Button label="Click me" />
<Button label="Click me" color="blue" disabled={true} />

REAL EXAMPLE from this project — Counter island: interface CounterProps { count:
Signal<number>; // `count` is a Signal object containing a number }

export default function Counter(props: CounterProps) { // props.count is
guaranteed to be a Signal<number> // TypeScript would complain if you tried to
pass a plain number }

INTERFACE vs TYPE: You will see both `interface` and `type` used in TypeScript.
For component props, both work. `interface` is generally preferred for objects.

interface MyProps { name: string; } // interface keyword type MyProps = { name:
string; }; // type keyword // Both accomplish the same thing here. Use interface
for objects.

---

## LESSON 4: JSX / TSX SYNTAX — HTML FOR JAVASCRIPT DEVELOPERS

JSX (JavaScript XML) is a syntax extension that lets you write HTML-like code
directly inside your JavaScript/TypeScript files.

Files with JSX use the `.jsx` or `.tsx` extension. (`.tsx` = TypeScript + JSX —
used for all components in this project)

HOW JSX DIFFERS FROM HTML:

HTML JSX / TSX

---

class="my-class" className="my-class" (class is reserved) for="input-id"
htmlFor="input-id" (for is reserved)
<br> <br /> (must self-close)
<img src="photo.jpg"> <img src="photo.jpg" /> (must self-close) style="color:
red" style={{ color: "red" }} (object, not string) onclick="doSomething()"
onClick={doSomething} (camelCase, no quotes)

<!-- Comment -->                  {/* Comment */}         (JS comment syntax)

EMBEDDING JAVASCRIPT EXPRESSIONS: Use curly braces `{}` to embed any JavaScript
expression inside JSX:

const name = "Alice"; const age = 25;

return (

<div>
<h1>Hello, {name}!</h1> // Outputs: Hello, Alice!
<p>You are {age} years old.</p> // Outputs: You are 25 years old.
<p>Next year: {age + 1}</p> // Outputs: Next year: 26
<p>{age >= 18 ? "Adult" : "Minor"}</p> // Conditional text
</div> );

CONDITIONAL RENDERING: // METHOD 1: Ternary operator (if/else) {isLoggedIn ?
<UserMenu /> : <LoginButton />}

// METHOD 2: && short-circuit (show only if true) {hasError &&
<ErrorMessage text="Something went wrong" />}

// METHOD 3: if statement (outside JSX) let content; if (isLoading) { content =
<Spinner />; } else { content = <MainContent />; } return <div>{content}</div>;

RENDERING LISTS: The most common way to render a list of items:

const fruits = ["Apple", "Banana", "Cherry"];

return (

<ul> {fruits.map((fruit) => (
<li key={fruit}>{fruit}</li> // ^^^^^^^^^^^ // key prop is REQUIRED when
rendering lists! // It helps Preact/React track which items changed. ))}
</ul> );

Output:

<ul>
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
  </ul>

THE `key` PROP: When you render a `.map()`, each element MUST have a `key` prop.
The key must uniquely identify that item in the list. Missing keys cause a
console warning and can cause rendering bugs. Bad: <li>{fruit}</li> Good:

<li key={fruit}>{fruit}</li> Good: <li key={user.id}>{user.name}</li>

PASSING PROPS: Props are like HTML attributes but can pass ANY JavaScript value:

// Passing strings (both ways are fine):
<Button label="Click me" /> <Button label={"Click me"} />

// Passing numbers (curly braces required):
<Counter start={5} />

// Passing booleans:
<Input disabled={true} />
<Input disabled /> // shorthand - just the name means true

// Passing functions (event handlers): <Button onClick={() =>
console.log("clicked!")} />
<Button onClick={handleClick} /> // where handleClick is defined elsewhere

// Passing objects: <Box style={{ color: "red", padding: "10px" }} />

INLINE STYLES IN JSX: In HTML: style="color: red; font-size: 16px;" In JSX:
style={{ color: "red", fontSize: "16px" }}

RULES:

- The outer `{}` embeds a JavaScript expression
- The inner `{}` is a JavaScript object literal
- CSS property names are camelCase: font-size -> fontSize, background-color ->
  backgroundColor
- Values are strings: "16px", "red", "#3b82f6"
- Pixel numbers can be written without "px": fontSize: 16 (same as "16px")

---

## LESSON 5: READING A REAL .TSX FILE FROM THIS PROJECT

Let's read `islands/Counter.tsx` together, line by line:

import type { Signal } from "@preact/signals"; // ^^^^^^ // Signal is a generic
TYPE from Preact Signals. // `import type` means we only import it for
type-checking, not runtime.

import { Button } from "../components/Button.tsx"; // We import the Button
component (which is in components/).

interface CounterProps { // We define the SHAPE of the props this component
accepts. count: Signal<number>; // ^^^^^^^^^^^^^^ // count must be a Signal
holding a number (not just a number!) }

export default function Counter(props: CounterProps) { // `export default` makes
this the Island (Fresh looks for the default export) // `props: CounterProps`
ensures only valid props are passed return (

<div class="flex gap-8 py-6"> // Note: Fresh uses `class` not `className` in
some parts. // This is because Fresh has special handling. Both work. <Button
id="decrement" onClick={() => props.count.value -= 1}>-1</Button> // onClick
receives an arrow function // `props.count.value -= 1` decrements the signal's
value
<p class="text-3xl tabular-nums">{props.count}</p> // `{props.count}` renders
the signal's current value reactively. // When count.value changes, this
paragraph auto-updates! <Button id="increment" onClick={() => props.count.value
+= 1}>+1</Button>
</div> ); }

---

## QUIZ TIME!

Q1: What is wrong with this TypeScript code? function multiply(a, b) { return
a * b; } A1: The parameters have no type annotations. TypeScript doesn't know if
a and b are numbers, strings, etc. Fix: function multiply(a: number, b: number):
number

Q2: What is wrong with this JSX?

<div class="container"><img src="logo.png"></div> A2: Two issues: 1. `class`
should be `className` in JSX. 2. `<img>` must be self-closing:
`<img src="logo.png" />` Fixed:
<div className="container"><img src="logo.png" /></div>

Q3: You have an array of users and want to render a `<UserCard>` for each one.
Write the JSX. A3: {users.map((user) => <UserCard key={user.id} user={user} />)}

Q4: What is the difference between `interface` and `type` in TypeScript? A4: For
defining object shapes (like component props), both work the same way. Use
`interface` for objects (it is more extendable/readable). Use `type` for unions,
tuples, and more complex type expressions.

Next up: Module 6 - Vite Config & Styling!
