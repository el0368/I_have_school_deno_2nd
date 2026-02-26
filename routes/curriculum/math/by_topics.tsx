import { Head } from "fresh/runtime";

const MATH_GROUPS = [
  {
    id: "1_the_core",
    title: "The Core",
    emoji: "🔢",
    topics: [
      {
        name: "Number Sense & Operations",
        id: "01_number_sense_and_operations",
      },
      { name: "Fractions & Proportions", id: "02_fractions_and_proportions" },
      { name: "Patterns & Rules", id: "03_patterns_and_rules" },
    ],
  },
  {
    id: "2_space_and_measurement",
    title: "Space & Measurement",
    emoji: "📐",
    topics: [
      { name: "Measurement & Scale", id: "04_measurement_and_scale" },
      { name: "Geometric Reasoning", id: "05_geometric_reasoning" },
      { name: "Trigonometry & Waves", id: "06_trigonometry_and_waves" },
    ],
  },
  {
    id: "3_change_and_relationships",
    title: "Change & Relationships",
    emoji: "📈",
    topics: [
      { name: "Variables & Equations", id: "07_variables_and_equations" },
      { name: "Functions & Graphs", id: "08_functions_and_graphs" },
      { name: "Systems & Matrices", id: "09_systems_and_matrices" },
    ],
  },
  {
    id: "4_data_and_uncertainty",
    title: "Data & Uncertainty",
    emoji: "🎲",
    topics: [
      {
        name: "Probability & Combinatorics",
        id: "10_probability_and_combinatorics",
      },
      {
        name: "Statistics & Data Science",
        id: "11_statistics_and_data_science",
      },
    ],
  },
  {
    id: "5_continuous_mathematics",
    title: "Continuous Mathematics",
    emoji: "∞",
    topics: [
      { name: "Limits & Continuity", id: "12_limits_and_continuity" },
      { name: "Differential Calculus", id: "13_differential_calculus" },
      { name: "Integral Calculus", id: "14_integral_calculus" },
      {
        name: "Multivariable & Vector Calculus",
        id: "15_multivariable_and_vector_calculus",
      },
      { name: "Differential Equations", id: "16_differential_equations" },
    ],
  },
  {
    id: "6_discrete_mathematics",
    title: "Discrete Mathematics",
    emoji: "🔗",
    topics: [
      { name: "Logic & Set Theory", id: "17_logic_and_set_theory" },
      {
        name: "Number Theory & Cryptography",
        id: "18_number_theory_and_cryptography",
      },
      { name: "Graph Theory", id: "19_graph_theory" },
    ],
  },
  {
    id: "7_formal_proofs_and_abstraction",
    title: "Formal Proofs & Abstraction",
    emoji: "🧩",
    topics: [
      { name: "Real & Complex Analysis", id: "20_real_and_complex_analysis" },
      { name: "Abstract Algebra", id: "21_abstract_algebra" },
      { name: "Topology", id: "22_topology" },
    ],
  },
];

export default function MathByTopics() {
  return (
    <>
      <Head>
        <title>Math by Topics | Sovereign Academy</title>
      </Head>

      <div class="subject-hero">
        <div class="page-container" style="padding-top: 0; padding-bottom: 0;">
          <h1 class="hero-large-title">Math by Topics</h1>
          <p class="hero-large-subtitle">
            22 topics — from counting to topology
          </p>
        </div>
      </div>

      <main
        class="page-container"
        style="padding-top: var(--spacing-8); padding-bottom: var(--spacing-10); margin-top: -1.5rem;"
      >
        <div style="margin-bottom: var(--spacing-6);">
          <a
            href="/curriculum/math"
            style="display: inline-block; text-decoration: none; color: var(--color-primary); font-weight: bold;"
          >
            ← Back to Math
          </a>
        </div>

        <div class="grid-container grid-container--wide">
          {MATH_GROUPS.map((group) => (
            <article key={group.id} class="dashboard-card">
              <div class="group-card-body">
                <div class="group-card-icon">{group.emoji}</div>
                <div class="group-card-text">
                  <h2
                    class="dashboard-card-title"
                    style="color: var(--color-primary); margin-bottom: var(--spacing-3);"
                  >
                    {group.title}
                  </h2>
                  <ul class="topic-grid">
                    {group.topics.map((topic, idx) => (
                      <li key={idx} class="topic-item">
                        <span class="topic-bullet">•</span>
                        <a
                          href={`/curriculum/math/by_topics/${group.id}/${topic.id}`}
                          style="color: inherit; text-decoration: none;"
                        >
                          {topic.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
