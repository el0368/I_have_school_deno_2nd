import { Coordinates, Mafs, Plot, Theme, useMovablePoint } from "mafs";
import "mafs/core.css";
import "mafs/font.css";

interface Props {
  equation?: string;
}

export default function MathAnimation({ equation = "y = x^2" }: Props) {
  const point = useMovablePoint([1, 1]);

  return (
    <div
      class="math-animation-container p-6 bg-white rounded-xl shadow-sm border border-gray-200"
      style={{ margin: "20px auto", maxWidth: "600px" }}
    >
      <div class="mb-4 text-center">
        <h3 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Interactive Math Engine
        </h3>
        <p class="text-gray-500 font-mono text-sm mt-1">
          Current Equation: {equation}
        </p>
      </div>

      <div class="rounded-lg overflow-hidden border border-gray-200 shadow-inner">
        <Mafs height={300}>
          <Coordinates.Cartesian />
          <Plot.OfX y={(x) => Math.pow(x, 2)} color={Theme.blue} />

          {point.element}
        </Mafs>
      </div>
      <div class="mt-4 text-center text-sm text-gray-500">
        Drag the pink point around the Cartesian plane!
        <br />
        (Point coordinates: {point.x.toFixed(2)}, {point.y.toFixed(2)})
      </div>
    </div>
  );
}
