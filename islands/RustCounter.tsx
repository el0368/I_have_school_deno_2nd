import { useEffect, useState } from "preact/hooks";

export default function RustCounter() {
  // deno-lint-ignore no-explicit-any
  const [wasmMod, setWasmMod] = useState<any>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const mod = await import("../wasm/pkg/wasm.js");
        await mod.default();
        setWasmMod(mod);
        console.log("Rust WASM Loaded!");
        setIsLoaded(true);
      } catch (e) {
        console.error("Failed to load Rust WASM:", e);
      }
    })();
  }, []);

  const handleCalc = () => {
    if (isLoaded && wasmMod) {
      const val = wasmMod.add_in_rust(10, 20);
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
                <span class="text-2xl font-black text-orange-600">
                  {result}
                </span>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
