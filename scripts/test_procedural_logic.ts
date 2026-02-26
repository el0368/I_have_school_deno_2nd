/**
 * test_procedural_logic.ts
 *
 * This script tests the "Answer-First" logic described in
 * docs/66_procedural_question_generation.md
 */

function generateQuestion() {
  // 1. Pick the Answer (x) FIRST - ensures the result is always clean
  const x = Math.floor(Math.random() * 15) + 1;

  // 2. Pick the Coefficient (A) and Constant (B)
  const a = Math.floor(Math.random() * 10) + 2; // coefficient between 2 and 11
  const b = Math.floor(Math.random() * 20) + 1; // constant between 1 and 20

  // 3. Calculate the Result (C) based on our chosen x
  // Problem Shape: Ax + B = C
  const c = (a * x) + b;

  return {
    equation: `${a}x + ${b} = ${c}`,
    correctAnswer: x,
  };
}

console.log("=== TESTING PROCEDURAL GENERATION (ANSWER-FIRST) ===");
console.log("Goal: Generate 5 clean equations for 'Ax + B = C'\n");

for (let i = 1; i <= 5; i++) {
  const { equation, correctAnswer } = generateQuestion();
  console.log(`Question ${i}: Solve for x:  ${equation}`);
  console.log(`   [Answer: x = ${correctAnswer}]`);
  console.log("-----------------------------------------");
}
