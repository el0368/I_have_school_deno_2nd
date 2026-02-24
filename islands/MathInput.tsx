import { useEffect, useRef, useState } from "preact/hooks";
import "mathlive"; // Imports the <math-field> Web Component

// ─── Props ────────────────────────────────────────────────────────────────────
// These are embedded in MDX lessons:
//   <MathInput question="Simplify $\\frac{2}{4}$" correctAnswer="\\frac{1}{2}" />
interface Props {
  /** The question prompt, shown above the input field */
  question?: string;
  /** The correct answer in LaTeX — compared symbolically by the math engine */
  correctAnswer?: string;
  /** Optional placeholder LaTeX shown inside the field before the student types */
  placeholder?: string;
}

type FeedbackState = "idle" | "checking" | "correct" | "incorrect" | "error";

export default function MathInput(
  { question, correctAnswer, placeholder }: Props,
) {
  const mf = useRef<HTMLElement>(null);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [attempts, setAttempts] = useState(0);

  // Helper to read LaTeX from the math-field Web Component
  const getLatex = (): string => {
    if (!mf.current) return "";
    return (mf.current as unknown as { getValue: (f: string) => string })
      .getValue("latex");
  };

  // ─── Submit handler ───────────────────────────────────────────────────
  const handleCheck = async () => {
    const studentAnswer = getLatex().trim();
    if (!studentAnswer) return;

    // If no correctAnswer prop, there's nothing to check — free-form mode
    if (!correctAnswer) {
      console.log(
        "[MathInput] Free-form mode — no grading. LaTeX:",
        studentAnswer,
      );
      return;
    }

    setFeedback("checking");
    setErrorMsg("");
    setAttempts((a) => a + 1);

    try {
      const res = await fetch("/api/math/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentAnswer, correctAnswer }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setFeedback("error");
        setErrorMsg(data.error ?? `Server returned ${res.status}`);
        return;
      }

      setFeedback(data.correct ? "correct" : "incorrect");
    } catch (err) {
      setFeedback("error");
      setErrorMsg(String(err));
    }
  };

  // Allow "Enter" key to submit
  useEffect(() => {
    const el = mf.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleCheck();
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [correctAnswer]);

  // ─── Feedback banner ──────────────────────────────────────────────────
  const feedbackBanner = () => {
    switch (feedback) {
      case "correct":
        return (
          <div class="math-feedback math-feedback--correct">
            ✓ Correct!
          </div>
        );
      case "incorrect":
        return (
          <div class="math-feedback math-feedback--incorrect">
            ✗ Not quite. {attempts >= 3
              ? <span>The answer is ${correctAnswer}$</span>
              : "Try again!"}
          </div>
        );
      case "error":
        return (
          <div class="math-feedback math-feedback--error">
            ⚠ {errorMsg || "Something went wrong."}
          </div>
        );
      case "checking":
        return (
          <div class="math-feedback math-feedback--checking">
            Checking…
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div class="math-interactive-container">
      {question && <p class="math-question">{question}</p>}

      <math-field
        class="math-input-field"
        ref={mf}
        placeholder={placeholder}
      />

      {correctAnswer && (
        <button
          type="button"
          class="btn-primary math-check-btn"
          onClick={handleCheck}
          disabled={feedback === "checking"}
        >
          {feedback === "checking" ? "Checking…" : "Check Answer"}
        </button>
      )}

      {feedbackBanner()}
    </div>
  );
}
