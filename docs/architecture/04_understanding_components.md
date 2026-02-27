# ================================================================================ UNDERSTANDING COMPONENTS vs. ISLANDS IN FRESH

In Fresh, there is a very important distinction between a "Component" and an
"Island". Understanding this is the key to building fast websites.

---

1. STATIC COMPONENTS (/components folder)

---

These are basic parts of your UI that do not change after the page loads.

- WHERE THEY LIVE: Store these in the "components/" directory.
- HOW THEY WORK: They are rendered into pure HTML on the server.
- JAVASCRIPT: They send ZERO JavaScript to the user's browser.
- EXAMPLES: Navigation bars, Footers, Buttons (without complex logic), Headers.

Example (Button.tsx): export function Button(props) { return
<button class="btn">{props.children}</button>; }

---

2. INTERACTIVE ISLANDS (/islands folder)

---

These are components that "come to life" once they reach the browser.

- WHERE THEY LIVE: MUST be in the "islands/" directory.
- HOW THEY WORK: They are rendered into HTML on the server, BUT they also send
  JavaScript to the browser to make them interactive.
- JAVASCRIPT: Only the code for that specific island is sent.
- EXAMPLES: Counters, Image Sliders, Search Bars, Forms with validation.

Example (Counter.tsx): export default function Counter() { const count =
useSignal(0); return <button onClick={() => count.value++}>{count}</button>; }

---

3. THE "RULE OF THUMB"

---

- Rule 1: If it doesn't have an "onClick", "onInput", or use a "Signal", it
  should be a STATIC COMPONENT.

- Rule 2: If the user needs to interact with it (click things that change the
  screen without a page refresh), it must be an ISLAND.

---

4. PASSING DATA (PROPS)

---

Both Components and Islands use "Props" to receive data.

- COMPONENTS can take any kind of data (strings, numbers, objects).
- ISLANDS should ideally take basic data or "Signals". Warning: Do not pass
  giant complex functions from a page to an island, as they might not transfer
  correctly during hydration.

---

5. NESTING RULES

---

- A Page can contain Components and Islands.
- A Component can contain other Components.
- An Island can contain Components.
- CRITICAL: A Static Component CANNOT contain an Island and make it work.
  Islands should usually be top-level interactive blocks.

---

6. WHY THIS MATTERS

---

# Most frameworks send all your code to the browser. Fresh only sends code for the Islands. This means if your page is 90% Static Components, your website will load 90% faster because there is almost no JavaScript for the browser to run.
