import { useEffect, useState } from "preact/hooks";
// 1. Import the "init" and your Rust function from the pkg folder
import init, { add_in_rust } from "../wasm/pkg/wasm.js";

export default function RustCounter() {
  const [result, setResult] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 2. Initialize the WASM module when the component first loads
    // We use .then() to ensure it finishes before we set isLoaded to true
    init().then(() => {
      console.log("Rust WASM Loaded!");
      setIsLoaded(true);
    });
  }, []);

  const handleCalc = () => {
    if (isLoaded) {
      // 3. Call your Rust function just like a normal JavaScript function!
      const val = add_in_rust(10, 20);
      setResult(val);
    }
  };

  return (
    <div class="p-4 border-2 border-orange-400 rounded-xl bg-orange-50 mt-4">
      <h3 class="text-lg font-bold text-orange-800">Rust WASM Island</h3>

      {!isLoaded
        ? <p class="text-sm text-gray-500 italic">⏳ Loading Rust engine...</p>
        : (
          <div class="mt-2 space-y-4">
            <p class="text-sm text-gray-700">
              The button below calls a function written in <b>Rust</b>!
            </p>

            <button
              type="button"
              onClick={handleCalc}
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-bold shadow-md"
            >
              Calculate 10 + 20 in Rust
            </button>

            {result !== null && (
              <div class="p-2 bg-white border border-orange-200 rounded text-center">
                <span class="text-gray-500">Result:</span>
                <span class="text-2xl font-black text-orange-600 underline Decoration-double">
                  {result}
                </span>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
