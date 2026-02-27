import { Head } from "fresh/runtime";

const GRADES = [
  {
    id: "kindergarten",
    title: "Kindergarten",
    emoji: "🧸",
    description: "Counting, basic shapes, and simple addition.",
  },
  {
    id: "grade_1",
    title: "1st Grade",
    emoji: "🍎",
    description: "Addition and subtraction within 20, place value.",
  },
  {
    id: "grade_2",
    title: "2nd Grade",
    emoji: "✏️",
    description: "Addition and subtraction within 1000, money and time.",
  },
  {
    id: "grade_3",
    title: "3rd Grade",
    emoji: "📏",
    description: "Multiplication, division, and basic fractions.",
  },
  {
    id: "grade_4",
    title: "4th Grade",
    emoji: "📐",
    description: "Fractions, decimals, and multi-digit arithmetic.",
  },
  {
    id: "grade_5",
    title: "5th Grade",
    emoji: "🔬",
    description: "Advanced fractions, volume, and coordinate plane.",
  },
  {
    id: "grade_6",
    title: "6th Grade",
    emoji: "📊",
    description: "Ratios, rates, and introductory algebra.",
  },
  {
    id: "grade_7",
    title: "7th Grade",
    emoji: "📈",
    description: "Proportional relationships and rational numbers.",
  },
  {
    id: "grade_8",
    title: "8th Grade",
    emoji: "📉",
    description: "Linear equations, functions, and geometry.",
  },
  {
    id: "high_school",
    title: "High School",
    emoji: "🎓",
    description: "Algebra, Geometry, Trigonometry, and Calculus.",
  },
];

export default function MathByGrade() {
  return (
    <>
      <Head>
        <title>Math by Grade | Sovereign Academy</title>
      </Head>

      <div class="subject-hero">
        <div class="page-container" style="padding-top: 0; padding-bottom: 0;">
          <h1 class="hero-large-title">Math by Grade</h1>
          <p class="hero-large-subtitle">
            Follow a structured path from Kindergarten to High School
          </p>
        </div>
      </div>

      <main
        class="page-container"
        style="padding-top: var(--spacing-8); padding-bottom: var(--spacing-10);"
      >
        <div style="margin-bottom: var(--spacing-6);">
          <a
            href="/curriculum/math"
            style="display: inline-block; text-decoration: none; color: var(--color-primary); font-weight: bold;"
          >
            ← Back to Math
          </a>
        </div>

        <div class="grid-container">
          {GRADES.map((grade) => (
            <a
              key={grade.id}
              href={`/curriculum/math/by_grade/${grade.id}`}
              class="dashboard-card"
            >
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">
                {grade.emoji}
              </div>
              <h2 class="dashboard-card-title">{grade.title}</h2>
              <p class="dashboard-card-desc">{grade.description}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
