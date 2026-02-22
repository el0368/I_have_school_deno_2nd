import type { Signal } from "@preact/signals";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div class="counter-container">
      <button
        type="button"
        class="btn-counter"
        onClick={() => props.count.value -= 1}
      >
        -1
      </button>
      <p class="counter-display">{props.count}</p>
      <button
        type="button"
        class="btn-counter"
        onClick={() => props.count.value += 1}
      >
        +1
      </button>
    </div>
  );
}
