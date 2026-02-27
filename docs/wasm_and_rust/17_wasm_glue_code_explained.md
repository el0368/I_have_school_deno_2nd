# ================================================================================ WASM "GLUE CODE": THE JS/TS LINK

To answer your question: **YES, you still need a tiny bit of JS or TS to link
your Rust or C++ code to the browser.**

In the industry, we call this "Glue Code."

---

1. WHY CAN'T RUST/C++ RUN BY ITSELF?

---

- SECURITY: The browser is a very secure "sandbox." It doesn't allow any outside
  program (like a .wasm file) to just start running and accessing your computer.

- LOADING: Browsers don't know how to "start" a WASM file automatically. They
  need a script to:
  1. Fetch the file from the server.
  2. Prepare the memory for it.
  3. "Instantiate" (start) it.

---

2. THE "LOADER" PATTERN (THE GLUE)

---

Here is what that "link" code looks like in an Island:

```typescript
// islands/MyWasmCounter.tsx
import { useEffect } from "preact/hooks";

export default function MyWasmCounter() {
  useEffect(async () => {
    // 1. Fetch the .wasm file (The "Guest")
    const response = await fetch("/static/my_logic.wasm");

    // 2. The JS/TS "Bridge" loads it
    const { instance } = await WebAssembly.instantiateStreaming(response);

    // 3. Now you can use Rust/C++ functions!
    const result = instance.exports.add_in_rust(5, 10);
    console.log("Rust calculated:", result);
  }, []);

  return <div>Check console for Rust output!</div>;
}
```

---

3. GOOD NEWS: TOOLS DO IT FOR YOU

---

Most developers don't write this "Glue Code" by hand.

- RUST: When you use `wasm-pack`, it automatically creates a `.js` file for you
  that handles all the linking.
- C++: When you use `Emscripten`, it also generates the `.js` loader for you.

---

# SUMMARY: You still use **Rust** for the logic (the engine), but you use **JavaScript** as the "Key" that turns the engine on and connects it to the user's screen.
