# How to Organize Math "By Topic" — Based on Modern Education Research (2024–2026)

## The Question

How should `curriculums/en/math/by_topics/` be organized so a student can browse
math **purely by concept** (not by grade), following how modern education
science says humans actually learn mathematics?

**Important:** This does NOT touch `by_grade/`. That folder continues to exist
separately and independently.

---

## Part 1: Why Your Current Structure Is Already Good (And What to Adjust)

Your existing 7 groups follow a **mathematical maturity ladder** — this is
correct. The idea of grouping by conceptual family (not by school year) is
exactly what the research recommends. Here is your current structure mapped
against the research:

| # | Your Current Group                | Math Domain It Covers                           |
| - | --------------------------------- | ----------------------------------------------- |
| 1 | `1_the_core`                      | Arithmetic, fractions, early patterns           |
| 2 | `2_space_and_measurement`         | Geometry, measurement, trigonometry             |
| 3 | `3_change_and_relationships`      | Algebra, functions, systems                     |
| 4 | `4_data_and_uncertainty`          | Statistics, probability, combinatorics          |
| 5 | `5_continuous_mathematics`        | Calculus (single/multi), differential equations |
| 6 | `6_discrete_mathematics`          | Logic, set theory, number theory, graph theory  |
| 7 | `7_formal_proofs_and_abstraction` | Analysis, abstract algebra, topology            |

**Verdict:** This is a solid mathematical taxonomy. Below, I'll refine it based
on 4 key insights from modern education research.

---

## Part 2: The 4 Key Insights From Modern Education Science

### Insight 1: "Learning Progressions" (Not Grade Levels)

**Source:** Clements & Sarama (2021), _Learning and Teaching Early Math_; NCTM
Research; Learning Trajectories research by Confrey et al.

The most important discovery in math education in the past decade is that
children learn along **trajectories** — not grade levels. A "learning
progression" is a scientifically validated sequence of conceptual milestones
that a learner must pass through, regardless of age.

**Example:** The progression for multiplicative thinking is:

```
Count objects → Skip count → Repeated addition → Array model →
Area model → Standard algorithm → Multi-digit → Decimals → Fractions of quantities
```

A 3rd grader and a struggling 6th grader follow the **same trajectory** — just
at different speeds. This is exactly why your "by topic" view is more
scientifically valid than "by grade."

**What this means for your folders:** Each **topic** (e.g.,
`01_number_sense_and_operations`) should internally order its units from the
**earliest milestone to the most advanced**, regardless of what grade they
"belong" to. You are already doing this — unit_01 is kindergarten counting,
unit_28 is grade 7 scale drawings. This is correct.

### Insight 2: "Big Ideas" Organization (Not Skill Lists)

**Source:** Jo Boaler (Stanford), Charles (2005) "Big Ideas and Understandings",
Common Core State Standards' "Domains"

Modern curricula are shifting from organizing by **skills** ("add fractions,"
"divide decimals") to organizing by **Big Ideas** ("How do numbers relate to
each other?", "How do we measure change?").

Your top-level groups (`1_the_core`, `2_space_and_measurement`, etc.) are
already organized by Big Ideas. This is the correct approach.

**Refinement:** Your subtopics (the `01_`, `02_`, etc. folders inside each
group) should also represent Big Ideas, not just skill clusters. Here's the
difference:

| Skill-based (old way) | Big Idea-based (modern way)                  |
| --------------------- | -------------------------------------------- |
| `01_addition`         | `01_composing_and_decomposing_numbers`       |
| `02_subtraction`      | (same folder — addition and subtraction are  |
|                       | the **same Big Idea** viewed from two sides) |
| `05_fractions`        | `02_equal_sharing_and_partitioning`          |
| `08_ratios`           | `03_multiplicative_comparison`               |

Your current `01_number_sense_and_operations` is a blend. It has 28 units that
span from kindergarten to grade 7. This is fine as long as the units flow in a
logical learning progression (they do).

### Insight 3: "Interconnected Strands" (The Singapore/Japanese Model)

**Source:** Singapore Math framework, Japanese "Gakushuu Shidou Youryou", OECD
PISA 2025 Mathematics Framework

The most successful math education systems (Singapore, Japan, South Korea,
Finland) do NOT separate "Number" from "Geometry" from "Algebra" completely.
They use **strands** that weave together. The PISA 2025 framework defines 4
content areas:

1. **Quantity** (your groups 1)
2. **Space and Shape** (your group 2)
3. **Change and Relationships** (your group 3)
4. **Uncertainty and Data** (your group 4)

Groups 5–7 are **advanced mathematics** that go beyond K-12 entirely. These are
correct to keep separate because they represent university-level content.

**What this means:** Your 7-group structure maps cleanly to the international
standard. The only adjustment is whether to rename them to match the global
framework for better clarity.

### Insight 4: "Productive Struggle" Levels (The ZPD Bands)

**Source:** Vygotsky's Zone of Proximal Development, modernized by Hattie (2023)
and Rosenshine's Principles of Instruction

Within each topic, lessons should be tagged with a **difficulty band** that
tells the system (and the student) where they are on the mastery curve:

| Band | Label     | Description                                          |
| ---- | --------- | ---------------------------------------------------- |
| 1    | `explore` | First encounter — visual, concrete, play-based       |
| 2    | `develop` | Building fluency — guided practice, worked examples  |
| 3    | `master`  | Independent practice — standard problems             |
| 4    | `extend`  | Transfer — apply to new contexts, word problems      |
| 5    | `connect` | Cross-topic links — how this idea connects to others |

You could add this as a `level:` field in frontmatter:

```yaml
---
title: "Multiply fractions"
grade: "grade_5"
topic: "02_fractions_and_proportions"
unit: "unit_04_multiply_fractions"
level: "develop"
---
```

---

## Part 3: The Recommended Structure

Based on all 4 insights, here is the refined `by_topics` taxonomy. I've
**preserved your existing structure** and only made targeted adjustments.

### Tier 1: Foundational Mathematics (K-8 equivalent)

These 4 groups match the PISA/Singapore framework exactly.

```
by_topics/
├── 1_quantity/                              ← was "1_the_core"
│   ├── 01_counting_and_place_value/          (keep as-is)
│   ├── 02_addition_and_subtraction/          (merge your current units)
│   ├── 03_multiplication_and_division/
│   ├── 04_fractions_and_decimals/            ← was "02_fractions_and_proportions"
│   ├── 05_ratios_and_proportional_reasoning/
│   ├── 06_integers_and_rational_numbers/
│   └── 07_number_theory_foundations/
│
├── 2_space_and_shape/                       ← was "2_space_and_measurement"
│   ├── 01_shapes_and_spatial_sense/
│   ├── 02_measurement_and_units/             ← was "04_measurement_and_scale"
│   ├── 03_area_perimeter_volume/
│   ├── 04_coordinate_geometry/
│   ├── 05_transformations_and_symmetry/
│   ├── 06_geometric_proof_and_reasoning/     ← was "05_geometric_reasoning"
│   └── 07_trigonometry/                      ← was "06_trigonometry_and_waves"
│
├── 3_change_and_relationships/              ← keep name
│   ├── 01_patterns_and_algebraic_thinking/   ← was "03_patterns_and_rules"
│   ├── 02_expressions_and_equations/         ← was "07_variables_and_equations"
│   ├── 03_linear_functions/
│   ├── 04_quadratic_functions/
│   ├── 05_polynomial_and_rational_functions/
│   ├── 06_exponential_and_logarithmic/
│   ├── 07_systems_of_equations/              ← was "09_systems_and_matrices"
│   └── 08_sequences_and_series/
│
├── 4_data_and_uncertainty/                  ← keep name
│   ├── 01_collecting_and_displaying_data/
│   ├── 02_descriptive_statistics/
│   ├── 03_probability_fundamentals/          ← was "10_probability_and_combinatorics"
│   ├── 04_distributions_and_inference/
│   └── 05_combinatorics_and_counting/
```

### Tier 2: Advanced Mathematics (High School / AP / University)

These go beyond the 4 foundational strands. They represent **specialized
disciplines** where a student has chosen to go deeper.

```
├── 5_calculus/                              ← was "5_continuous_mathematics"
│   ├── 01_limits_and_continuity/             (keep)
│   ├── 02_differential_calculus/             (keep)
│   ├── 03_integral_calculus/                 (keep)
│   ├── 04_series_and_sequences/
│   ├── 05_multivariable_calculus/            ← was "15_multivariable_and_vector_calculus"
│   └── 06_differential_equations/            ← was "16_differential_equations"
│
├── 6_linear_algebra_and_matrices/           ← NEW (was split across 3 & 5)
│   ├── 01_vectors_and_spaces/
│   ├── 02_matrix_operations/
│   ├── 03_linear_transformations/
│   ├── 04_eigenvalues_and_eigenvectors/
│   └── 05_applications/
│
├── 7_discrete_mathematics/                  ← keep name
│   ├── 01_logic_and_proof/                   ← was "17_logic_and_set_theory"
│   ├── 02_set_theory/
│   ├── 03_graph_theory/                      (keep)
│   ├── 04_number_theory/                     ← was "18_number_theory_and_cryptography"
│   └── 05_combinatorics_advanced/
│
├── 8_abstract_and_pure_mathematics/         ← was "7_formal_proofs_and_abstraction"
│   ├── 01_real_analysis/                     ← was "20_real_and_complex_analysis"
│   ├── 02_complex_analysis/
│   ├── 03_abstract_algebra/                  (keep)
│   └── 04_topology/                          (keep)
```

---

## Part 4: What Changed and Why

### Changes from your current structure:

| What Changed                                                                  | Why                                                                                              |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `1_the_core` → `1_quantity`                                                   | Matches PISA framework name exactly                                                              |
| Split `01_number_sense_and_operations` (28 units) into ~4 focused topics      | 28 units is too many for one topic. Research says 5-8 units per topic is optimal for navigation. |
| `02_fractions_and_proportions` (16 units) split into 2 topics                 | Same reason — too many units                                                                     |
| Added `6_linear_algebra_and_matrices`                                         | Linear algebra is the #1 most important math subject for AI/CS — it deserves its own group       |
| Subtopic numbers (`01_` through `22_`) are now local per group                | Global numbering (`01_` through `22_`) was confusing                                             |
| Renamed `7_formal_proofs_and_abstraction` → `8_abstract_and_pure_mathematics` | Clearer for students                                                                             |

### What did NOT change:

- The unit-level structure (e.g., `unit_01_counting_and_place_value/`) stays the
  same
- The lesson files inside units stay the same
- The frontmatter schema stays the same
- The `by_grade/` folder is completely untouched

---

## Part 5: Frontmatter Schema for Topic-Based Lessons

Every `.mdx` file inside `by_topics` should have this frontmatter:

```yaml
---
title: "Lesson title here"
topic: "01_counting_and_place_value"       # Which subtopic folder it lives in
unit: "unit_01_counting_and_place_value"   # Which unit folder it lives in
grade: "grade_3"                           # Which grade this maps to (for by_grade view)
level: "develop"                           # explore | develop | master | extend | connect
prerequisites:                             # What the student should know first
  - "01_counting_and_place_value/unit_01"
tags:                                      # For search and cross-referencing
  - "place-value"
  - "base-ten"
---
```

The `grade:` field is what lets you build the `by_grade` view without
duplicating files. A script can scan all `.mdx` files in `by_topics/` and group
them by `grade:` to generate the grade-based curriculum automatically.

---

## Part 6: How Many Units Per Topic Is Ideal?

Research on cognitive load (Sweller, 2011) and UX navigation (Miller's Law)
suggests:

| Units per topic                | Verdict                                               |
| ------------------------------ | ----------------------------------------------------- |
| 1-3                            | Too few — feels empty, merge with another topic       |
| **4-8**                        | **Ideal** — fits on one screen, scannable at a glance |
| 9-12                           | Acceptable if logical subgrouping exists              |
| 13+                            | Too many — split into subtopics                       |
| 28 (your current Number Sense) | Way too many — must be split                          |

Your `01_number_sense_and_operations` currently has **28 units**. It should be
split into approximately 4 subtopics of 5-8 units each:

```
1_quantity/
├── 01_counting_and_place_value/        (units 1-6 from current)
├── 02_addition_and_subtraction/        (units 2-6,11,13 from current)
├── 03_multiplication_and_division/     (units 7-10,14-16,22 from current)
├── 04_decimals/                        (units 12,17-18,20-21,23-24 from current)
├── 05_negative_numbers/                (units 25-27 from current)
└── 06_ratios_and_scale/                (unit 28 from current + ratios content)
```

---

## Part 7: Topic Difficulty Progression Within Each Subtopic

Inside each subtopic, units should follow the **Concrete → Pictorial → Abstract
(CPA)** progression from Singapore Math:

```
unit_01_  →  Visual/concrete introduction (manipulatives, pictures)
unit_02_  →  Pictorial models (bar models, number lines, area models)
unit_03_  →  Symbolic/abstract (standard notation, algorithms)
unit_04_  →  Fluency and practice
unit_05_  →  Word problems and applications
unit_06_  →  Extension and connections to other topics
unit_quiz →  Assessment
unit_test →  Comprehensive test
```

---

## Part 8: Summary Decision Table

| Decision                       | Your Choice                                    |
| ------------------------------ | ---------------------------------------------- |
| Top-level organization         | 8 mathematical domains (PISA-aligned)          |
| Subtopic naming                | Big Ideas, not skills                          |
| Units per subtopic             | Target 4-8                                     |
| Unit ordering inside subtopics | Learning progression (CPA), not grade order    |
| Grade information              | Stored in frontmatter `grade:` field           |
| Difficulty banding             | Optional `level:` field in frontmatter         |
| Cross-referencing              | Optional `prerequisites:` and `tags:` fields   |
| Folder naming convention       | `snake_case` with numbered prefix for ordering |
| `by_grade/` folder             | **Untouched.** Completely independent.         |

---

## Part 9: The Full Tree (Final Answer)

```
curriculums/en/math/by_topics/
│
├── 1_quantity/
│   ├── 01_counting_and_place_value/
│   │   ├── unit_01_count_small_numbers/
│   │   ├── unit_02_count_in_order/
│   │   ├── unit_03_place_value_tens_and_ones/
│   │   ├── unit_04_place_value_hundreds/
│   │   ├── unit_05_place_value_thousands_and_beyond/
│   │   └── unit_06_rounding_and_estimation/
│   ├── 02_addition_and_subtraction/
│   │   ├── unit_01_add_subtract_within_20/
│   │   ├── unit_02_add_subtract_within_100/
│   │   ├── unit_03_add_subtract_within_1000/
│   │   ├── unit_04_multi_digit_addition_subtraction/
│   │   └── unit_05_estimation_strategies/
│   ├── 03_multiplication_and_division/
│   │   ├── unit_01_intro_to_multiplication/
│   │   ├── unit_02_multiplication_facts/
│   │   ├── unit_03_intro_to_division/
│   │   ├── unit_04_multi_digit_multiplication/
│   │   ├── unit_05_long_division/
│   │   └── unit_06_factors_multiples_primes/
│   ├── 04_fractions/
│   │   ├── unit_01_understanding_fractions/
│   │   ├── unit_02_equivalent_fractions/
│   │   ├── unit_03_add_subtract_fractions/
│   │   ├── unit_04_multiply_fractions/
│   │   ├── unit_05_divide_fractions/
│   │   └── unit_06_mixed_numbers/
│   ├── 05_decimals/
│   │   ├── unit_01_understand_decimals/
│   │   ├── unit_02_decimal_place_value/
│   │   ├── unit_03_add_subtract_decimals/
│   │   ├── unit_04_multiply_decimals/
│   │   ├── unit_05_divide_decimals/
│   │   └── unit_06_powers_of_ten/
│   ├── 06_ratios_and_proportional_reasoning/
│   │   ├── unit_01_intro_to_ratios/
│   │   ├── unit_02_rates_and_unit_rates/
│   │   ├── unit_03_percentages/
│   │   ├── unit_04_proportional_relationships/
│   │   └── unit_05_scale_and_similarity/
│   └── 07_integers_and_rational_numbers/
│       ├── unit_01_negative_numbers/
│       ├── unit_02_integer_operations/
│       ├── unit_03_rational_number_operations/
│       └── unit_04_exponents_and_order_of_operations/
│
├── 2_space_and_shape/
│   ├── 01_shapes_and_spatial_sense/
│   ├── 02_measurement_and_units/
│   ├── 03_area_perimeter_volume/
│   ├── 04_coordinate_geometry/
│   ├── 05_transformations_and_symmetry/
│   ├── 06_geometric_proof_and_reasoning/
│   └── 07_trigonometry/
│
├── 3_change_and_relationships/
│   ├── 01_patterns_and_algebraic_thinking/
│   ├── 02_expressions_and_equations/
│   ├── 03_linear_functions/
│   ├── 04_quadratic_functions/
│   ├── 05_polynomial_and_rational_functions/
│   ├── 06_exponential_and_logarithmic/
│   ├── 07_systems_of_equations/
│   └── 08_sequences_and_series/
│
├── 4_data_and_uncertainty/
│   ├── 01_collecting_and_displaying_data/
│   ├── 02_descriptive_statistics/
│   ├── 03_probability_fundamentals/
│   ├── 04_distributions_and_inference/
│   └── 05_combinatorics_and_counting/
│
├── 5_calculus/
│   ├── 01_limits_and_continuity/
│   ├── 02_differential_calculus/
│   ├── 03_integral_calculus/
│   ├── 04_series_and_sequences/
│   ├── 05_multivariable_calculus/
│   └── 06_differential_equations/
│
├── 6_linear_algebra/
│   ├── 01_vectors_and_spaces/
│   ├── 02_matrix_operations/
│   ├── 03_linear_transformations/
│   ├── 04_eigenvalues_and_eigenvectors/
│   └── 05_applications/
│
├── 7_discrete_mathematics/
│   ├── 01_logic_and_proof/
│   ├── 02_set_theory/
│   ├── 03_graph_theory/
│   ├── 04_number_theory/
│   └── 05_advanced_combinatorics/
│
└── 8_abstract_and_pure_mathematics/
    ├── 01_real_analysis/
    ├── 02_complex_analysis/
    ├── 03_abstract_algebra/
    └── 04_topology/
```

This structure:

- Follows the **PISA 2025 framework** (groups 1-4)
- Follows **learning progressions** research (units ordered by cognitive
  milestone)
- Keeps **4-8 units per subtopic** (cognitive load optimized)
- Separates **K-12 foundations** (1-4) from **advanced** (5-8)
- Added **Linear Algebra** as its own domain (critical for AI/CS era)
- Every lesson stores its `grade:` in frontmatter so `by_grade/` works
  independently
