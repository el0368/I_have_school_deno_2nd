import { Head } from "fresh/runtime";

const MATH_GROUPS = [
  {
    id: "1_quantity",
    title: "Quantity",
    emoji: "🔢",
    topics: [
      { name: "Counting & Place Value", id: "01_counting_and_place_value" },
      { name: "Addition & Subtraction", id: "02_addition_and_subtraction" },
      {
        name: "Multiplication & Division",
        id: "03_multiplication_and_division",
      },
      { name: "Fractions", id: "04_fractions" },
      { name: "Decimals", id: "05_decimals" },
      {
        name: "Ratios & Proportional Reasoning",
        id: "06_ratios_and_proportional_reasoning",
      },
      {
        name: "Integers & Rational Numbers",
        id: "07_integers_and_rational_numbers",
      },
    ],
  },
  {
    id: "2_space_and_shape",
    title: "Space & Shape",
    emoji: "📐",
    topics: [
      { name: "Shapes & Spatial Sense", id: "01_shapes_and_spatial_sense" },
      { name: "Measurement & Units", id: "02_measurement_and_units" },
      { name: "Area, Perimeter & Volume", id: "03_area_perimeter_volume" },
      { name: "Coordinate Geometry", id: "04_coordinate_geometry" },
      {
        name: "Transformations & Symmetry",
        id: "05_transformations_and_symmetry",
      },
      {
        name: "Geometric Proof & Reasoning",
        id: "06_geometric_proof_and_reasoning",
      },
      { name: "Trigonometry", id: "07_trigonometry" },
    ],
  },
  {
    id: "3_change_and_relationships",
    title: "Change & Relationships",
    emoji: "📈",
    topics: [
      {
        name: "Patterns & Algebraic Thinking",
        id: "01_patterns_and_algebraic_thinking",
      },
      {
        name: "Expressions & Equations",
        id: "02_expressions_and_equations",
      },
      { name: "Functions & Graphs", id: "03_functions_and_graphs" },
      { name: "Systems of Equations", id: "07_systems_of_equations" },
    ],
  },
  {
    id: "4_data_and_uncertainty",
    title: "Data & Uncertainty",
    emoji: "🎲",
    topics: [
      {
        name: "Collecting & Displaying Data",
        id: "01_collecting_and_displaying_data",
      },
      { name: "Descriptive Statistics", id: "02_descriptive_statistics" },
      {
        name: "Probability Fundamentals",
        id: "03_probability_fundamentals",
      },
      {
        name: "Distributions & Inference",
        id: "04_distributions_and_inference",
      },
      {
        name: "Combinatorics & Counting",
        id: "05_combinatorics_and_counting",
      },
    ],
  },
  {
    id: "5_calculus",
    title: "Calculus",
    emoji: "∞",
    topics: [
      { name: "Limits & Continuity", id: "01_limits_and_continuity" },
      { name: "Differential Calculus", id: "02_differential_calculus" },
      { name: "Integral Calculus", id: "03_integral_calculus" },
      { name: "Series & Sequences", id: "04_series_and_sequences" },
      { name: "Multivariable Calculus", id: "05_multivariable_calculus" },
      { name: "Differential Equations", id: "06_differential_equations" },
    ],
  },
  {
    id: "6_linear_algebra",
    title: "Linear Algebra",
    emoji: "🧮",
    topics: [
      { name: "Vectors & Spaces", id: "01_vectors_and_spaces" },
      { name: "Matrix Operations", id: "02_matrix_operations" },
      { name: "Linear Transformations", id: "03_linear_transformations" },
      {
        name: "Eigenvalues & Eigenvectors",
        id: "04_eigenvalues_and_eigenvectors",
      },
      { name: "Applications", id: "05_applications" },
    ],
  },
  {
    id: "7_discrete_mathematics",
    title: "Discrete Mathematics",
    emoji: "🔗",
    topics: [
      { name: "Logic & Proof", id: "01_logic_and_proof" },
      { name: "Set Theory", id: "02_set_theory" },
      { name: "Graph Theory", id: "03_graph_theory" },
      { name: "Number Theory", id: "04_number_theory" },
      { name: "Advanced Combinatorics", id: "05_advanced_combinatorics" },
    ],
  },
  {
    id: "8_abstract_and_pure_mathematics",
    title: "Abstract & Pure Mathematics",
    emoji: "🧩",
    topics: [
      { name: "Real Analysis", id: "01_real_analysis" },
      { name: "Complex Analysis", id: "02_complex_analysis" },
      { name: "Abstract Algebra", id: "03_abstract_algebra" },
      { name: "Topology", id: "04_topology" },
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
            43 topics — from counting to topology
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

        <div class="grid-container grid-container--wide">
          {MATH_GROUPS.map((group) => (
            <article key={group.id} class="dashboard-card">
              <div class="group-card-body">
                <div class="group-card-icon">{group.emoji}</div>
                <div class="group-card-text">
                  <h2
                    class="dashboard-card-title"
                    style="color: var(--color-primary); margin-bottom: var(--spacing-4);"
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
