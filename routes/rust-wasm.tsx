import RustCounter from "../islands/RustCounter.tsx";

export default function RustWasmPage() {
  return (
    <div class="px-4 py-8 mx-auto max-w-screen-md">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Rust-WASM: From Start to Finish
      </h1>

      <p class="text-lg text-gray-700 mb-8">
        This page demonstrates exactly how a piece of code travels from your
        computer's Rust compiler all the way to a user's browser screen.
      </p>

      {/* THE INTERACTIVE DEMO */}
      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border-2 border-orange-100 mb-12">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span class="w-3 h-8 bg-orange-500 rounded-full"></span>
            1. The Live Result
          </h2>
          <p class="text-sm text-gray-600 mb-6">
            Even though this looks like regular HTML, the math inside the box
            below is happening inside a <b>WebAssembly Machine</b>{" "}
            built with Rust.
          </p>
          <RustCounter />
        </div>
      </div>

      {/* THE WORKFLOW EXPLANATION */}
      <div class="space-y-8">
        <h2 class="text-3xl font-bold text-gray-900 border-b-2 border-gray-100 pb-2">
          2. The Life Cycle
        </h2>

        {/* STEP 1 */}
        <div class="flex gap-6 items-start">
          <div class="flex-none w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">The Source (Rust)</h3>
            <p class="text-gray-600 text-sm mt-1">
              It starts in{" "}
              <code>/wasm/src/lib.rs</code>. You write standard Rust code and
              use <code>#[wasm_bindgen]</code>{" "}
              to tell Rust: "Make this function visible to the browser."
            </p>
          </div>
        </div>

        {/* STEP 2 */}
        <div class="flex gap-6 items-start">
          <div class="flex-none w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">
              The Build (Wasm-Pack)
            </h3>
            <p class="text-gray-600 text-sm mt-1">
              You run{" "}
              <code>wasm-pack build</code>. This transforms your human-readable
              Rust into two files in the <code>/wasm/pkg/</code> folder:
            </p>
            <ul class="list-disc list-inside text-xs text-gray-500 mt-2 space-y-1 ml-4">
              <li>
                <code>wasm_bg.wasm</code>: The raw binary machine code.
              </li>
              <li>
                <code>wasm.js</code>: The "Glue Code" that allows JavaScript to
                talk to the binary.
              </li>
            </ul>
          </div>
        </div>

        {/* STEP 3 */}
        <div class="flex gap-6 items-start">
          <div class="flex-none w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">The Delivery (Deno)</h3>
            <p class="text-gray-600 text-sm mt-1">
              Deno (the server) detects these files. When a user visits this
              URL, Deno sends the **HTML** first, then the **Island JS**, and
              finally the <b>WASM Binary</b> only when it's needed.
            </p>
          </div>
        </div>

        {/* STEP 4 */}
        <div class="flex gap-6 items-start">
          <div class="flex-none w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
            4
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">
              The Connection (Island)
            </h3>
            <p class="text-gray-600 text-sm mt-1">
              Inside <code>/islands/RustCounter.tsx</code>, the{" "}
              <code>useEffect</code>
              hook calls{" "}
              <code>init()</code>. This "wakes up" the WASM module in the user's
              browser memory.
            </p>
          </div>
        </div>

        {/* STEP 5 */}
        <div class="flex gap-6 items-start">
          <div class="flex-none w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
            5
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">The Execution</h3>
            <p class="text-gray-600 text-sm mt-1 font-semibold italic text-purple-700">
              User clicks the button &rarr; JS calls Rust &rarr; Rust runs
              calculation &rarr; Result returns to Screen.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-16 p-8 bg-gray-900 rounded-3xl text-white">
        <h3 class="text-xl font-bold mb-4 text-orange-400">Why do this?</h3>
        <p class="text-gray-300 text-sm leading-relaxed">
          Standard JavaScript is great, but Rust is <b>faster</b> and{" "}
          <b>more stable</b>
          for complex logic. By combining them in Fresh, you get the beauty and
          simplicity of a website with the raw power of a desktop application.
        </p>
      </div>

      <p class="mt-12 text-center">
        <a href="/testmdx" class="text-blue-500 hover:underline">
          &larr; Back to MDX Test Page
        </a>
      </p>
    </div>
  );
}
