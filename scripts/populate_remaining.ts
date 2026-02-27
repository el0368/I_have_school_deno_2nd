import { ensureDir } from "jsr:@std/fs@1/ensure-dir";
import { join } from "jsr:@std/path@1";

const BASE =
  "c:\\GitHub\\I_have_school_deno_2nd\\curriculums\\en\\math\\by_topics";

interface UnitDef {
  unitFolder: string;
  title: string;
  grade: string;
  lessons: string[];
}

interface TopicDef {
  path: string;
  topic: string;
  units: UnitDef[];
}

const topics: TopicDef[] = [
  // ── 2_space_and_shape / 04_coordinate_geometry ──────────────
  {
    path: "2_space_and_shape\\04_coordinate_geometry",
    topic: "04_coordinate_geometry",
    units: [
      {
        unitFolder: "unit_01_the_coordinate_plane",
        title: "The Coordinate Plane",
        grade: "grade_5",
        lessons: [
          "Introduction to the coordinate plane",
          "Plotting points in four quadrants",
          "Identifying coordinates from a graph",
          "Distance between two points on a grid",
          "Coordinate plane word problems",
        ],
      },
      {
        unitFolder: "unit_02_graphing_linear_equations",
        title: "Graphing Linear Equations",
        grade: "grade_8",
        lessons: [
          "Graphing from a table of values",
          "Slope of a line",
          "Slope-intercept form",
          "Point-slope form",
          "Graphing linear equations practice",
          "Horizontal and vertical lines",
        ],
      },
      {
        unitFolder: "unit_03_equations_of_lines",
        title: "Equations of Lines",
        grade: "grade_8",
        lessons: [
          "Writing equations from slope and a point",
          "Writing equations from two points",
          "Parallel and perpendicular lines",
          "Standard form of linear equations",
          "Converting between forms",
        ],
      },
      {
        unitFolder: "unit_04_conic_sections",
        title: "Conic Sections",
        grade: "precalculus",
        lessons: [
          "Circles in the coordinate plane",
          "Parabolas and their equations",
          "Ellipses",
          "Hyperbolas",
          "Identifying conic sections from equations",
          "Conic sections applications",
        ],
      },
    ],
  },

  // ── 2_space_and_shape / 05_transformations_and_symmetry ─────
  {
    path: "2_space_and_shape\\05_transformations_and_symmetry",
    topic: "05_transformations_and_symmetry",
    units: [
      {
        unitFolder: "unit_01_translations",
        title: "Translations",
        grade: "grade_8",
        lessons: [
          "What is a translation",
          "Translating points on the coordinate plane",
          "Translating shapes",
          "Describing translations with vectors",
          "Translation practice problems",
        ],
      },
      {
        unitFolder: "unit_02_reflections",
        title: "Reflections",
        grade: "grade_8",
        lessons: [
          "What is a reflection",
          "Reflecting over the x-axis and y-axis",
          "Reflecting over other lines",
          "Line symmetry",
          "Reflection practice problems",
        ],
      },
      {
        unitFolder: "unit_03_rotations",
        title: "Rotations",
        grade: "grade_8",
        lessons: [
          "What is a rotation",
          "Rotating 90, 180, and 270 degrees",
          "Rotational symmetry",
          "Center of rotation",
          "Rotation practice problems",
        ],
      },
      {
        unitFolder: "unit_04_dilations_and_similarity",
        title: "Dilations and Similarity",
        grade: "geometry",
        lessons: [
          "What is a dilation",
          "Scale factor",
          "Dilations on the coordinate plane",
          "Similar figures and proportions",
          "Proving similarity with transformations",
        ],
      },
      {
        unitFolder: "unit_05_sequences_of_transformations",
        title: "Sequences of Transformations",
        grade: "geometry",
        lessons: [
          "Composing transformations",
          "Congruence through rigid motions",
          "Symmetry groups introduction",
          "Tessellations and tiling patterns",
        ],
      },
    ],
  },

  // ── 4_data_and_uncertainty / 01_collecting_and_displaying_data
  {
    path: "4_data_and_uncertainty\\01_collecting_and_displaying_data",
    topic: "01_collecting_and_displaying_data",
    units: [
      {
        unitFolder: "unit_01_picture_and_bar_graphs",
        title: "Picture and Bar Graphs",
        grade: "grade_2",
        lessons: [
          "Reading picture graphs",
          "Creating picture graphs",
          "Reading bar graphs",
          "Creating bar graphs",
          "Comparing data with bar graphs",
        ],
      },
      {
        unitFolder: "unit_02_line_plots_and_dot_plots",
        title: "Line Plots and Dot Plots",
        grade: "grade_3",
        lessons: [
          "Reading line plots",
          "Creating line plots with whole numbers",
          "Line plots with fractions",
          "Interpreting line plot data",
        ],
      },
      {
        unitFolder: "unit_03_tables_and_frequency",
        title: "Tables and Frequency",
        grade: "grade_5",
        lessons: [
          "Tally charts and frequency tables",
          "Two-way frequency tables",
          "Relative frequency",
          "Categorical vs numerical data",
        ],
      },
      {
        unitFolder: "unit_04_histograms_and_stem_plots",
        title: "Histograms and Stem-and-Leaf Plots",
        grade: "grade_6",
        lessons: [
          "Creating histograms",
          "Interpreting histograms",
          "Stem-and-leaf plots",
          "Choosing the right display",
          "Misleading graphs",
        ],
      },
      {
        unitFolder: "unit_05_scatter_plots",
        title: "Scatter Plots and Bivariate Data",
        grade: "grade_8",
        lessons: [
          "Creating scatter plots",
          "Describing trends in scatter plots",
          "Line of best fit (informal)",
          "Interpreting slope and intercept in context",
          "Correlation vs causation",
        ],
      },
    ],
  },

  // ── 4_data_and_uncertainty / 04_distributions_and_inference ──
  {
    path: "4_data_and_uncertainty\\04_distributions_and_inference",
    topic: "04_distributions_and_inference",
    units: [
      {
        unitFolder: "unit_01_normal_distribution",
        title: "The Normal Distribution",
        grade: "statistics",
        lessons: [
          "Introduction to distributions",
          "The normal curve and its properties",
          "The empirical rule (68-95-99.7)",
          "Z-scores and standardization",
          "Using the standard normal table",
        ],
      },
      {
        unitFolder: "unit_02_sampling_and_bias",
        title: "Sampling and Bias",
        grade: "statistics",
        lessons: [
          "Populations and samples",
          "Random sampling methods",
          "Types of bias",
          "Sampling distributions",
          "Central Limit Theorem",
        ],
      },
      {
        unitFolder: "unit_03_confidence_intervals",
        title: "Confidence Intervals",
        grade: "statistics",
        lessons: [
          "Point estimates vs interval estimates",
          "Confidence interval for a mean",
          "Confidence interval for a proportion",
          "Margin of error",
          "Choosing sample size",
        ],
      },
      {
        unitFolder: "unit_04_hypothesis_testing",
        title: "Hypothesis Testing",
        grade: "statistics",
        lessons: [
          "Null and alternative hypotheses",
          "P-values and significance levels",
          "One-sample t-test",
          "Two-sample t-test",
          "Chi-square test for independence",
          "Type I and Type II errors",
        ],
      },
    ],
  },

  // ── 4_data_and_uncertainty / 05_combinatorics_and_counting ───
  {
    path: "4_data_and_uncertainty\\05_combinatorics_and_counting",
    topic: "05_combinatorics_and_counting",
    units: [
      {
        unitFolder: "unit_01_fundamental_counting",
        title: "Fundamental Counting Principles",
        grade: "algebra_2",
        lessons: [
          "The multiplication principle",
          "The addition principle",
          "Tree diagrams",
          "Counting with restrictions",
        ],
      },
      {
        unitFolder: "unit_02_permutations",
        title: "Permutations",
        grade: "algebra_2",
        lessons: [
          "What is a permutation",
          "Factorial notation",
          "Permutations of distinct objects",
          "Permutations with repetition",
          "Circular permutations",
        ],
      },
      {
        unitFolder: "unit_03_combinations",
        title: "Combinations",
        grade: "algebra_2",
        lessons: [
          "What is a combination",
          "Combinations formula",
          "Combinations vs permutations",
          "Pascal's triangle",
          "Binomial theorem",
        ],
      },
    ],
  },

  // ── 5_calculus / 04_series_and_sequences ─────────────────────
  {
    path: "5_calculus\\04_series_and_sequences",
    topic: "04_series_and_sequences",
    units: [
      {
        unitFolder: "unit_01_sequences",
        title: "Sequences",
        grade: "precalculus",
        lessons: [
          "Arithmetic sequences",
          "Geometric sequences",
          "Recursive definitions",
          "Explicit formulas for sequences",
          "Convergence and divergence of sequences",
        ],
      },
      {
        unitFolder: "unit_02_series_and_summation",
        title: "Series and Summation",
        grade: "precalculus",
        lessons: [
          "Sigma notation",
          "Arithmetic series",
          "Geometric series",
          "Finite vs infinite series",
          "Sum of an infinite geometric series",
        ],
      },
      {
        unitFolder: "unit_03_convergence_tests",
        title: "Convergence Tests",
        grade: "freshman",
        lessons: [
          "Divergence test",
          "Integral test",
          "Comparison test",
          "Ratio test",
          "Root test",
          "Alternating series test",
        ],
      },
      {
        unitFolder: "unit_04_power_and_taylor_series",
        title: "Power and Taylor Series",
        grade: "freshman",
        lessons: [
          "Power series and radius of convergence",
          "Taylor polynomials",
          "Taylor series for common functions",
          "Maclaurin series",
          "Applications of Taylor series",
        ],
      },
    ],
  },

  // ── 6_linear_algebra / 01_vectors_and_spaces ────────────────
  {
    path: "6_linear_algebra\\01_vectors_and_spaces",
    topic: "01_vectors_and_spaces",
    units: [
      {
        unitFolder: "unit_01_vectors_in_rn",
        title: "Vectors in Rn",
        grade: "sophomore",
        lessons: [
          "What is a vector",
          "Vector addition and scalar multiplication",
          "Linear combinations",
          "Span of a set of vectors",
          "Linear independence",
        ],
      },
      {
        unitFolder: "unit_02_vector_spaces",
        title: "Vector Spaces",
        grade: "sophomore",
        lessons: [
          "Definition and axioms of vector spaces",
          "Subspaces",
          "Null space and column space",
          "Basis and dimension",
          "Rank of a matrix",
        ],
      },
      {
        unitFolder: "unit_03_inner_product_spaces",
        title: "Inner Product Spaces",
        grade: "sophomore",
        lessons: [
          "Dot product and inner products",
          "Orthogonality",
          "Orthogonal projections",
          "Gram-Schmidt process",
          "Orthonormal bases",
        ],
      },
    ],
  },

  // ── 6_linear_algebra / 02_matrix_operations ─────────────────
  {
    path: "6_linear_algebra\\02_matrix_operations",
    topic: "02_matrix_operations",
    units: [
      {
        unitFolder: "unit_01_matrix_basics",
        title: "Matrix Basics",
        grade: "precalculus",
        lessons: [
          "What is a matrix",
          "Matrix addition and subtraction",
          "Scalar multiplication",
          "Matrix multiplication",
          "Properties of matrix multiplication",
        ],
      },
      {
        unitFolder: "unit_02_row_reduction",
        title: "Row Reduction and Echelon Forms",
        grade: "sophomore",
        lessons: [
          "Row operations",
          "Row echelon form",
          "Reduced row echelon form",
          "Solving systems with row reduction",
          "Free variables and parametric solutions",
        ],
      },
      {
        unitFolder: "unit_03_determinants",
        title: "Determinants",
        grade: "sophomore",
        lessons: [
          "Determinant of a 2x2 matrix",
          "Determinant of a 3x3 matrix (cofactor expansion)",
          "Properties of determinants",
          "Determinants and invertibility",
          "Cramer's rule",
        ],
      },
      {
        unitFolder: "unit_04_inverse_matrices",
        title: "Inverse Matrices",
        grade: "sophomore",
        lessons: [
          "Finding the inverse of a 2x2 matrix",
          "Finding the inverse using row reduction",
          "Properties of inverse matrices",
          "Solving systems with inverse matrices",
        ],
      },
    ],
  },

  // ── 6_linear_algebra / 03_linear_transformations ────────────
  {
    path: "6_linear_algebra\\03_linear_transformations",
    topic: "03_linear_transformations",
    units: [
      {
        unitFolder: "unit_01_intro_to_linear_transformations",
        title: "Introduction to Linear Transformations",
        grade: "sophomore",
        lessons: [
          "What is a linear transformation",
          "Matrix representation of a transformation",
          "Geometric transformations as matrices",
          "Kernel and range",
          "One-to-one and onto transformations",
        ],
      },
      {
        unitFolder: "unit_02_change_of_basis",
        title: "Change of Basis",
        grade: "sophomore",
        lessons: [
          "Coordinates relative to a basis",
          "Change of basis matrix",
          "Similar matrices",
          "Diagonalization preview",
        ],
      },
    ],
  },

  // ── 6_linear_algebra / 04_eigenvalues_and_eigenvectors ──────
  {
    path: "6_linear_algebra\\04_eigenvalues_and_eigenvectors",
    topic: "04_eigenvalues_and_eigenvectors",
    units: [
      {
        unitFolder: "unit_01_eigenvalues",
        title: "Eigenvalues and Eigenvectors",
        grade: "sophomore",
        lessons: [
          "What are eigenvalues and eigenvectors",
          "Finding eigenvalues (characteristic polynomial)",
          "Finding eigenvectors",
          "Eigenspaces",
          "Algebraic vs geometric multiplicity",
        ],
      },
      {
        unitFolder: "unit_02_diagonalization",
        title: "Diagonalization",
        grade: "sophomore",
        lessons: [
          "Diagonalizable matrices",
          "The diagonalization process",
          "Powers of diagonalizable matrices",
          "Applications to dynamical systems",
        ],
      },
      {
        unitFolder: "unit_03_symmetric_matrices_and_svd",
        title: "Symmetric Matrices and SVD",
        grade: "junior",
        lessons: [
          "Symmetric matrices and orthogonal diagonalization",
          "Positive definite matrices",
          "Singular Value Decomposition (SVD)",
          "Applications: PCA and data compression",
        ],
      },
    ],
  },

  // ── 6_linear_algebra / 05_applications ──────────────────────
  {
    path: "6_linear_algebra\\05_applications",
    topic: "05_applications",
    units: [
      {
        unitFolder: "unit_01_least_squares",
        title: "Least Squares and Regression",
        grade: "junior",
        lessons: [
          "Least squares problem",
          "Normal equations",
          "Linear regression with matrices",
          "Polynomial fitting",
        ],
      },
      {
        unitFolder: "unit_02_markov_chains",
        title: "Markov Chains",
        grade: "junior",
        lessons: [
          "Stochastic matrices",
          "State transitions",
          "Steady-state vectors",
          "Absorbing Markov chains",
        ],
      },
      {
        unitFolder: "unit_03_computer_graphics",
        title: "Linear Algebra in Computer Graphics",
        grade: "junior",
        lessons: [
          "2D transformations with matrices",
          "3D transformations and homogeneous coordinates",
          "Projection matrices",
          "Applications in game engines and rendering",
        ],
      },
    ],
  },

  // ── 7_discrete_mathematics / 02_set_theory ──────────────────
  {
    path: "7_discrete_mathematics\\02_set_theory",
    topic: "02_set_theory",
    units: [
      {
        unitFolder: "unit_01_basic_set_operations",
        title: "Basic Set Operations",
        grade: "junior",
        lessons: [
          "Sets, elements, and notation",
          "Subsets and proper subsets",
          "Union and intersection",
          "Complement and difference",
          "Venn diagrams",
        ],
      },
      {
        unitFolder: "unit_02_relations_and_functions",
        title: "Relations and Functions",
        grade: "junior",
        lessons: [
          "Cartesian products",
          "Relations and their properties",
          "Equivalence relations and partitions",
          "Partial orders",
          "Functions as relations",
          "Injective surjective and bijective functions",
        ],
      },
      {
        unitFolder: "unit_03_cardinality",
        title: "Cardinality",
        grade: "senior",
        lessons: [
          "Finite and infinite sets",
          "Countable and uncountable sets",
          "Cantor's diagonal argument",
          "Cardinality of the continuum",
        ],
      },
    ],
  },

  // ── 7_discrete_mathematics / 05_advanced_combinatorics ──────
  {
    path: "7_discrete_mathematics\\05_advanced_combinatorics",
    topic: "05_advanced_combinatorics",
    units: [
      {
        unitFolder: "unit_01_inclusion_exclusion",
        title: "Inclusion-Exclusion Principle",
        grade: "senior",
        lessons: [
          "The inclusion-exclusion formula",
          "Counting with overlapping sets",
          "Derangements",
          "Euler's totient function connection",
        ],
      },
      {
        unitFolder: "unit_02_generating_functions",
        title: "Generating Functions",
        grade: "senior",
        lessons: [
          "Ordinary generating functions",
          "Exponential generating functions",
          "Solving recurrences with generating functions",
          "Partition function",
        ],
      },
      {
        unitFolder: "unit_03_pigeonhole_and_ramsey",
        title: "Pigeonhole Principle and Ramsey Theory",
        grade: "senior",
        lessons: [
          "The pigeonhole principle",
          "Generalized pigeonhole principle",
          "Introduction to Ramsey numbers",
          "Applications in computer science",
        ],
      },
    ],
  },

  // ── 8_abstract_and_pure_mathematics / 02_complex_analysis ───
  {
    path: "8_abstract_and_pure_mathematics\\02_complex_analysis",
    topic: "02_complex_analysis",
    units: [
      {
        unitFolder: "unit_01_complex_numbers_and_functions",
        title: "Complex Numbers and Functions",
        grade: "masters",
        lessons: [
          "The complex plane revisited",
          "Polar form and Euler's formula",
          "Complex functions and mappings",
          "Limits and continuity in the complex plane",
          "Complex exponential and logarithm",
        ],
      },
      {
        unitFolder: "unit_02_analytic_functions",
        title: "Analytic Functions",
        grade: "masters",
        lessons: [
          "Differentiability in the complex plane",
          "Cauchy-Riemann equations",
          "Harmonic functions",
          "Conformal mappings",
        ],
      },
      {
        unitFolder: "unit_03_complex_integration",
        title: "Complex Integration",
        grade: "masters",
        lessons: [
          "Contour integrals",
          "Cauchy's integral theorem",
          "Cauchy's integral formula",
          "Liouville's theorem",
          "Maximum modulus principle",
        ],
      },
      {
        unitFolder: "unit_04_series_and_residues",
        title: "Series and Residues",
        grade: "masters",
        lessons: [
          "Taylor series in the complex plane",
          "Laurent series",
          "Singularities and their classification",
          "The Residue Theorem",
          "Evaluating real integrals with residues",
          "Argument principle and Rouche's theorem",
        ],
      },
    ],
  },
];

async function populate() {
  let unitCount = 0;
  let lessonCount = 0;

  for (const topic of topics) {
    for (const unit of topic.units) {
      const unitDir = join(BASE, topic.path, unit.unitFolder);
      await ensureDir(unitDir);
      unitCount++;

      for (let i = 0; i < unit.lessons.length; i++) {
        const lessonName = unit.lessons[i];
        const fileName = `${unit.grade}_${String(i + 1).padStart(2, "0")}_${
          lessonName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")
            .toLowerCase()
        }.mdx`;
        const filePath = join(unitDir, fileName);

        const content = `---
title: "${lessonName}"
grade: "${unit.grade}"
topic: "${topic.topic}"
unit: "${unit.unitFolder}"
---

# ${lessonName}

*This lesson is a placeholder. Content will be written here.*
`;
        await Deno.writeTextFile(filePath, content);
        lessonCount++;
      }
    }
  }

  console.log(
    `Created ${unitCount} units and ${lessonCount} lessons across the 14 remaining topics!`,
  );
}

populate().catch(console.error);
