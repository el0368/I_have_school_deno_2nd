import { useEffect, useRef } from "preact/hooks";
import "mathlive"; // Imports the <math-field> Web Component

export default function MathInput() {
  const mf = useRef<HTMLElement>(null);

  useEffect(() => {
    // Attach event listeners to evaluate the student's answer
    if (mf.current) {
      mf.current.addEventListener("input", (_ev: Event) => {
        // @ts-ignore: math-field exposes getValue
        console.log(
          "Current MathML output:",
          (mf.current as unknown as { getValue: (format: string) => string })
            .getValue("math-ml"),
        );
        // @ts-ignore: math-field exposes getValue
        console.log(
          "Current LaTeX output:",
          (mf.current as unknown as { getValue: (format: string) => string })
            .getValue("latex"),
        );
      });
    }
  }, []);

  return (
    <div class="math-interactive-container">
      <math-field class="math-input-field" ref={mf}>
        {/* Initial equation placeholder */}
      </math-field>
    </div>
  );
}
