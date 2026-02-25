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
  // ── GROUP 5: CONTINUOUS MATHEMATICS ──────────────────────────
  {
    path: "5_continuous_mathematics\\12_limits_and_continuity",
    topic: "12_limits_and_continuity",
    units: [
      {
        unitFolder: "unit_1_intro_to_limits",
        title: "Intro to Limits",
        grade: "grade_11",
        lessons: [
          "What is a limit",
          "Estimating limits from graphs",
          "Estimating limits from tables",
          "One-sided limits",
          "Limits that don't exist",
        ],
      },
      {
        unitFolder: "unit_2_evaluating_limits",
        title: "Evaluating Limits",
        grade: "grade_12",
        lessons: [
          "Direct substitution",
          "Factoring to evaluate limits",
          "Rationalizing to evaluate limits",
          "Squeeze theorem",
          "Limits at infinity",
        ],
      },
      {
        unitFolder: "unit_3_continuity",
        title: "Continuity",
        grade: "grade_12",
        lessons: [
          "Definition of continuity",
          "Types of discontinuities",
          "Intermediate Value Theorem",
          "Continuity over an interval",
        ],
      },
    ],
  },
  {
    path: "5_continuous_mathematics\\13_differential_calculus",
    topic: "13_differential_calculus",
    units: [
      {
        unitFolder: "unit_1_definition_of_the_derivative",
        title: "Definition of the Derivative",
        grade: "freshman",
        lessons: [
          "Average rate of change",
          "Instantaneous rate of change",
          "Derivative as a limit",
          "Derivative as slope of tangent line",
          "Differentiability and continuity",
        ],
      },
      {
        unitFolder: "unit_2_basic_differentiation_rules",
        title: "Basic Differentiation Rules",
        grade: "freshman",
        lessons: [
          "Power rule",
          "Sum and difference rules",
          "Constant multiple rule",
          "Derivatives of polynomials",
          "Derivatives of trigonometric functions",
          "Derivatives of exponential functions",
          "Derivatives of logarithmic functions",
        ],
      },
      {
        unitFolder: "unit_3_product_and_quotient_rules",
        title: "Product and Quotient Rules",
        grade: "freshman",
        lessons: [
          "Product rule",
          "Quotient rule",
          "Combining differentiation rules",
        ],
      },
      {
        unitFolder: "unit_4_chain_rule",
        title: "Chain Rule",
        grade: "freshman",
        lessons: [
          "Chain rule introduction",
          "Chain rule with trigonometric functions",
          "Chain rule with exponentials and logarithms",
          "Implicit differentiation",
        ],
      },
      {
        unitFolder: "unit_5_applications_of_derivatives",
        title: "Applications of Derivatives",
        grade: "freshman",
        lessons: [
          "Related rates",
          "Linear approximation",
          "L'Hopital's rule",
          "Mean Value Theorem",
          "Optimization problems",
          "Curve sketching with derivatives",
        ],
      },
    ],
  },
  {
    path: "5_continuous_mathematics\\14_integral_calculus",
    topic: "14_integral_calculus",
    units: [
      {
        unitFolder: "unit_1_antiderivatives_and_indefinite_integrals",
        title: "Antiderivatives and Indefinite Integrals",
        grade: "freshman",
        lessons: [
          "What is an antiderivative",
          "Basic integration rules",
          "Integrating polynomials",
          "Integrating trigonometric functions",
          "Integrating exponentials and logarithms",
        ],
      },
      {
        unitFolder: "unit_2_definite_integrals",
        title: "Definite Integrals",
        grade: "freshman",
        lessons: [
          "Riemann sums",
          "Definite integral as area under a curve",
          "Fundamental Theorem of Calculus Part 1",
          "Fundamental Theorem of Calculus Part 2",
          "Properties of definite integrals",
        ],
      },
      {
        unitFolder: "unit_3_integration_techniques",
        title: "Integration Techniques",
        grade: "freshman",
        lessons: [
          "U-substitution",
          "Integration by parts",
          "Trigonometric integrals",
          "Trigonometric substitution",
          "Partial fractions",
          "Improper integrals",
        ],
      },
      {
        unitFolder: "unit_4_applications_of_integrals",
        title: "Applications of Integrals",
        grade: "freshman",
        lessons: [
          "Area between curves",
          "Volume by disk and washer method",
          "Volume by shell method",
          "Arc length",
          "Surface area of revolution",
        ],
      },
    ],
  },
  {
    path: "5_continuous_mathematics\\15_multivariable_and_vector_calculus",
    topic: "15_multivariable_and_vector_calculus",
    units: [
      {
        unitFolder: "unit_1_vectors_and_3d_space",
        title: "Vectors and 3D Space",
        grade: "sophomore",
        lessons: [
          "Vectors in 2D and 3D",
          "Dot product",
          "Cross product",
          "Lines and planes in 3D",
          "Cylindrical and spherical coordinates",
        ],
      },
      {
        unitFolder: "unit_2_partial_derivatives",
        title: "Partial Derivatives",
        grade: "sophomore",
        lessons: [
          "Functions of several variables",
          "Limits and continuity in higher dimensions",
          "Partial derivatives",
          "The gradient vector",
          "Directional derivatives",
          "Tangent planes and linear approximation",
        ],
      },
      {
        unitFolder: "unit_3_multiple_integrals",
        title: "Multiple Integrals",
        grade: "sophomore",
        lessons: [
          "Double integrals over rectangles",
          "Double integrals over general regions",
          "Triple integrals",
          "Change of variables (Jacobian)",
        ],
      },
      {
        unitFolder: "unit_4_vector_calculus",
        title: "Vector Calculus",
        grade: "sophomore",
        lessons: [
          "Line integrals",
          "Green's Theorem",
          "Surface integrals",
          "Stokes' Theorem",
          "Divergence Theorem",
        ],
      },
    ],
  },
  {
    path: "5_continuous_mathematics\\16_differential_equations",
    topic: "16_differential_equations",
    units: [
      {
        unitFolder: "unit_1_first_order_odes",
        title: "First Order ODEs",
        grade: "junior",
        lessons: [
          "What is a differential equation",
          "Separable equations",
          "Linear first-order equations",
          "Exact equations",
          "Existence and uniqueness theorems",
        ],
      },
      {
        unitFolder: "unit_2_second_order_linear_odes",
        title: "Second Order Linear ODEs",
        grade: "junior",
        lessons: [
          "Homogeneous equations with constant coefficients",
          "Complex and repeated roots",
          "Nonhomogeneous equations",
          "Method of undetermined coefficients",
          "Variation of parameters",
        ],
      },
      {
        unitFolder: "unit_3_systems_of_odes",
        title: "Systems of ODEs",
        grade: "junior",
        lessons: [
          "Systems of first-order linear equations",
          "Phase portraits",
          "Matrix methods for systems",
          "Stability and equilibrium",
        ],
      },
      {
        unitFolder: "unit_4_laplace_transforms",
        title: "Laplace Transforms",
        grade: "junior",
        lessons: [
          "Definition and properties",
          "Inverse Laplace transforms",
          "Solving ODEs with Laplace transforms",
          "Step functions and impulse functions",
          "Convolution",
        ],
      },
    ],
  },

  // ── GROUP 6: DISCRETE MATHEMATICS ───────────────────────────
  {
    path: "6_discrete_mathematics\\17_logic_and_set_theory",
    topic: "17_logic_and_set_theory",
    units: [
      {
        unitFolder: "unit_1_propositional_logic",
        title: "Propositional Logic",
        grade: "junior",
        lessons: [
          "Propositions and logical operators",
          "Truth tables",
          "Logical equivalences",
          "Conditional and biconditional statements",
          "Tautologies and contradictions",
        ],
      },
      {
        unitFolder: "unit_2_predicate_logic",
        title: "Predicate Logic",
        grade: "junior",
        lessons: [
          "Predicates and quantifiers",
          "Universal and existential quantifiers",
          "Nested quantifiers",
          "Rules of inference",
        ],
      },
      {
        unitFolder: "unit_3_proof_techniques",
        title: "Proof Techniques",
        grade: "junior",
        lessons: [
          "Direct proof",
          "Proof by contrapositive",
          "Proof by contradiction",
          "Mathematical induction",
          "Strong induction",
        ],
      },
      {
        unitFolder: "unit_4_set_theory",
        title: "Set Theory",
        grade: "junior",
        lessons: [
          "Sets, subsets, and set operations",
          "Venn diagrams",
          "Cartesian products",
          "Relations and functions",
          "Cardinality and countability",
        ],
      },
    ],
  },
  {
    path: "6_discrete_mathematics\\18_number_theory_and_cryptography",
    topic: "18_number_theory_and_cryptography",
    units: [
      {
        unitFolder: "unit_1_divisibility_and_primes",
        title: "Divisibility and Primes",
        grade: "senior",
        lessons: [
          "Divisibility rules",
          "Prime numbers and prime factorization",
          "Greatest common divisor (GCD)",
          "Least common multiple (LCM)",
          "The Euclidean algorithm",
        ],
      },
      {
        unitFolder: "unit_2_modular_arithmetic",
        title: "Modular Arithmetic",
        grade: "senior",
        lessons: [
          "Introduction to modular arithmetic",
          "Congruences",
          "Solving linear congruences",
          "Fermat's Little Theorem",
          "Euler's Theorem",
          "Chinese Remainder Theorem",
        ],
      },
      {
        unitFolder: "unit_3_intro_to_cryptography",
        title: "Intro to Cryptography",
        grade: "senior",
        lessons: [
          "Classical ciphers",
          "Public key cryptography concepts",
          "RSA algorithm",
          "Diffie-Hellman key exchange",
          "Digital signatures",
        ],
      },
    ],
  },
  {
    path: "6_discrete_mathematics\\19_graph_theory",
    topic: "19_graph_theory",
    units: [
      {
        unitFolder: "unit_1_intro_to_graphs",
        title: "Introduction to Graphs",
        grade: "senior",
        lessons: [
          "Graphs, vertices, and edges",
          "Types of graphs (directed, undirected, weighted)",
          "Graph representations (adjacency matrix, adjacency list)",
          "Degree of a vertex",
          "Handshaking lemma",
        ],
      },
      {
        unitFolder: "unit_2_paths_and_connectivity",
        title: "Paths and Connectivity",
        grade: "senior",
        lessons: [
          "Paths and cycles",
          "Eulerian paths and circuits",
          "Hamiltonian paths and circuits",
          "Connected components",
          "Shortest path algorithms (Dijkstra)",
        ],
      },
      {
        unitFolder: "unit_3_trees_and_spanning_trees",
        title: "Trees and Spanning Trees",
        grade: "senior",
        lessons: [
          "Trees and forests",
          "Properties of trees",
          "Minimum spanning trees",
          "Kruskal's algorithm",
          "Prim's algorithm",
        ],
      },
      {
        unitFolder: "unit_4_graph_coloring_and_planarity",
        title: "Graph Coloring and Planarity",
        grade: "senior",
        lessons: [
          "Graph coloring",
          "Chromatic number",
          "Planar graphs",
          "Euler's formula for planar graphs",
          "Four Color Theorem",
        ],
      },
    ],
  },

  // ── GROUP 7: FORMAL PROOFS & ABSTRACTION ────────────────────
  {
    path: "7_formal_proofs_and_abstraction\\20_real_and_complex_analysis",
    topic: "20_real_and_complex_analysis",
    units: [
      {
        unitFolder: "unit_1_real_number_system",
        title: "The Real Number System",
        grade: "masters",
        lessons: [
          "Axioms of the real numbers",
          "Supremum and infimum",
          "Completeness axiom",
          "Archimedean property",
          "Density of rationals and irrationals",
        ],
      },
      {
        unitFolder: "unit_2_sequences_and_series",
        title: "Sequences and Series",
        grade: "masters",
        lessons: [
          "Convergence of sequences",
          "Cauchy sequences",
          "Bolzano-Weierstrass Theorem",
          "Convergence tests for series",
          "Power series and radius of convergence",
        ],
      },
      {
        unitFolder: "unit_3_metric_spaces_and_topology_of_r",
        title: "Metric Spaces and Topology of R",
        grade: "masters",
        lessons: [
          "Open and closed sets",
          "Compact sets and Heine-Borel Theorem",
          "Connected sets",
          "Limit points and closure",
        ],
      },
      {
        unitFolder: "unit_4_complex_analysis",
        title: "Complex Analysis",
        grade: "masters",
        lessons: [
          "Complex numbers and the complex plane",
          "Analytic functions and Cauchy-Riemann equations",
          "Complex integration and Cauchy's Theorem",
          "Laurent series and residues",
          "Residue Theorem and applications",
        ],
      },
    ],
  },
  {
    path: "7_formal_proofs_and_abstraction\\21_abstract_algebra",
    topic: "21_abstract_algebra",
    units: [
      {
        unitFolder: "unit_1_groups",
        title: "Groups",
        grade: "masters",
        lessons: [
          "Definition and examples of groups",
          "Subgroups",
          "Cyclic groups",
          "Permutation groups",
          "Cosets and Lagrange's Theorem",
          "Normal subgroups and quotient groups",
          "Group homomorphisms and isomorphisms",
        ],
      },
      {
        unitFolder: "unit_2_rings",
        title: "Rings",
        grade: "masters",
        lessons: [
          "Definition and examples of rings",
          "Integral domains",
          "Ideals and quotient rings",
          "Ring homomorphisms",
          "Polynomial rings",
        ],
      },
      {
        unitFolder: "unit_3_fields",
        title: "Fields",
        grade: "masters",
        lessons: [
          "Definition and examples of fields",
          "Field extensions",
          "Algebraic and transcendental elements",
          "Finite fields",
          "Galois Theory introduction",
        ],
      },
    ],
  },
  {
    path: "7_formal_proofs_and_abstraction\\22_topology",
    topic: "22_topology",
    units: [
      {
        unitFolder: "unit_1_topological_spaces",
        title: "Topological Spaces",
        grade: "phd",
        lessons: [
          "Definition of a topology",
          "Open sets, closed sets, and neighborhoods",
          "Bases and subbases",
          "Continuity in topological spaces",
          "Homeomorphisms",
        ],
      },
      {
        unitFolder: "unit_2_connectedness_and_compactness",
        title: "Connectedness and Compactness",
        grade: "phd",
        lessons: [
          "Connected spaces",
          "Path-connected spaces",
          "Compact spaces",
          "Tychonoff's Theorem",
          "Compactification",
        ],
      },
      {
        unitFolder: "unit_3_fundamental_group",
        title: "The Fundamental Group",
        grade: "phd",
        lessons: [
          "Homotopy of paths",
          "Definition of the fundamental group",
          "Fundamental group of the circle",
          "Covering spaces",
          "Van Kampen's Theorem",
        ],
      },
    ],
  },

  // ── GROUP 2 (MISSING): TRIGONOMETRY AND WAVES ────────────────
  {
    path: "2_space_and_measurement\\06_trigonometry_and_waves",
    topic: "06_trigonometry_and_waves",
    units: [
      {
        unitFolder: "unit_1_right_triangle_trigonometry",
        title: "Right Triangle Trigonometry",
        grade: "geometry",
        lessons: [
          "Pythagorean theorem review",
          "Special right triangles (45-45-90, 30-60-90)",
          "Introduction to the trigonometric ratios",
          "Solving for a side with trig ratios",
          "Solving for an angle with trig ratios",
          "Sine and cosine of complementary angles",
          "Modeling with right triangles",
          "Law of sines",
          "Law of cosines",
        ],
      },
      {
        unitFolder: "unit_2_unit_circle_and_trig_functions",
        title: "Unit Circle and Trig Functions",
        grade: "algebra_2",
        lessons: [
          "Unit circle introduction",
          "Radians",
          "The Pythagorean identity",
          "Trigonometric values of special angles",
          "Trigonometric values on the unit circle",
          "Graphs of sin(x) and cos(x)",
          "Amplitude, midline, and period",
          "Transforming sinusoidal graphs",
          "Graphing sinusoidal functions",
          "Sinusoidal models",
        ],
      },
      {
        unitFolder: "unit_3_trig_identities_and_equations",
        title: "Trig Identities and Equations",
        grade: "precalculus",
        lessons: [
          "Inverse trigonometric functions",
          "Sinusoidal equations",
          "Angle addition identities",
          "Using trigonometric identities",
          "Challenging trig equations",
          "Solving general triangles",
        ],
      },
      {
        unitFolder: "unit_4_polar_parametric_and_waves",
        title: "Polar Coordinates, Parametric Equations, and Waves",
        grade: "precalculus",
        lessons: [
          "Parametric equations intro",
          "Polar coordinates",
          "Graphing polar functions",
          "Converting between polar and rectangular",
          "Wave functions and periodicity",
          "Fourier series introduction",
        ],
      },
    ],
  },

  // ── GROUP 3 (MISSING): SYSTEMS AND MATRICES ──────────────────
  {
    path: "3_change_and_relationships\\09_systems_and_matrices",
    topic: "09_systems_and_matrices",
    units: [
      {
        unitFolder: "unit_1_systems_of_linear_equations",
        title: "Systems of Linear Equations",
        grade: "algebra_1",
        lessons: [
          "Introduction to systems of equations",
          "Solving systems graphically",
          "Solving systems by substitution",
          "Solving systems by elimination",
          "Number of solutions to systems",
          "Systems of equations word problems",
        ],
      },
      {
        unitFolder: "unit_2_systems_of_inequalities",
        title: "Systems of Inequalities",
        grade: "algebra_1",
        lessons: [
          "Graphing linear inequalities",
          "Systems of linear inequalities",
          "Feasibility regions",
          "Systems of inequalities word problems",
        ],
      },
      {
        unitFolder: "unit_3_matrix_algebra",
        title: "Matrix Algebra",
        grade: "precalculus",
        lessons: [
          "Introduction to matrices",
          "Matrix addition and subtraction",
          "Scalar multiplication",
          "Matrix multiplication",
          "Matrix equations",
          "Solving systems with matrices (row reduction)",
        ],
      },
      {
        unitFolder: "unit_4_determinants_and_inverses",
        title: "Determinants and Inverse Matrices",
        grade: "precalculus",
        lessons: [
          "Determinants of 2×2 matrices",
          "Determinants of 3×3 matrices",
          "Inverse matrices",
          "Using inverse matrices to solve systems",
          "Cramer's rule",
          "Eigenvalues and eigenvectors (intro)",
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
        const fileName = `${unit.grade}_${i + 1}_${
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
    `Created ${unitCount} units and ${lessonCount} lessons across Groups 5, 6, and 7!`,
  );
}

populate().catch(console.error);
