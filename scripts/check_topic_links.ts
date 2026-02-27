/**
 * check_topic_links.ts
 *
 * Validates that every group and topic ID hardcoded in
 * routes/curriculum/math/by_topics.tsx actually exists as a folder
 * inside curriculums/en/math/by_topics/.
 *
 * Also checks that each topic folder contains at least one unit folder.
 *
 * Usage:
 *   deno run --allow-read scripts/check_topic_links.ts
 */

// ── Hardcoded registry from routes/curriculum/math/by_topics.tsx ─────────────
// Keep this in sync whenever you edit that file.

const MATH_GROUPS = [
  {
    id: "1_quantity",
    title: "Quantity",
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
    topics: [
      { name: "Real Analysis", id: "01_real_analysis" },
      { name: "Complex Analysis", id: "02_complex_analysis" },
      { name: "Abstract Algebra", id: "03_abstract_algebra" },
      { name: "Topology", id: "04_topology" },
    ],
  },
];

// ── Config ────────────────────────────────────────────────────────────────────

const TOPICS_ROOT = "curriculums/en/math/by_topics";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function dirExists(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isDirectory;
  } catch {
    return false;
  }
}

async function hasSubfolders(path: string): Promise<boolean> {
  try {
    for await (const entry of Deno.readDir(path)) {
      if (entry.isDirectory) return true;
    }
  } catch {
    // ignore
  }
  return false;
}

async function getFolders(path: string): Promise<string[]> {
  const folders: string[] = [];
  try {
    for await (const entry of Deno.readDir(path)) {
      if (entry.isDirectory) folders.push(entry.name);
    }
  } catch {
    // ignore
  }
  return folders.sort();
}

// ── Main ──────────────────────────────────────────────────────────────────────

let broken = 0;
let warnings = 0;
let ok = 0;

console.log("\n🔍  Checking topic links against filesystem...\n");
console.log(`    Root: ${TOPICS_ROOT}\n`);
console.log("─".repeat(70));

// ── 1. Check that every hardcoded group folder exists ─────────────────────────

const registeredGroupIds = new Set(MATH_GROUPS.map((g) => g.id));
const actualGroupFolders = await getFolders(TOPICS_ROOT);

// Orphaned folders (exist on disk but NOT in the hardcoded registry)
const orphanedGroups = actualGroupFolders.filter((f) =>
  !registeredGroupIds.has(f)
);
if (orphanedGroups.length > 0) {
  console.log(
    "\n⚠️  ORPHANED GROUP FOLDERS (exist on disk, not registered in route):",
  );
  for (const g of orphanedGroups) {
    console.log(`   ⚠  ${TOPICS_ROOT}/${g}`);
    warnings++;
  }
}

// ── 2. Check each registered group + topic ────────────────────────────────────

for (const group of MATH_GROUPS) {
  const groupPath = `${TOPICS_ROOT}/${group.id}`;
  const groupExists = await dirExists(groupPath);

  console.log(`\n[GROUP] ${group.title}`);
  console.log(`        /${group.id}`);

  if (!groupExists) {
    console.log(`        ❌  MISSING — folder does not exist on disk`);
    broken += group.topics.length; // all topics in this group are broken
    continue;
  }

  console.log(`        ✅  exists`);

  const registeredTopicIds = new Set(group.topics.map((t) => t.id));
  const actualTopicFolders = await getFolders(groupPath);

  // Orphaned topic folders
  const orphanedTopics = actualTopicFolders.filter((f) =>
    !registeredTopicIds.has(f)
  );
  if (orphanedTopics.length > 0) {
    for (const t of orphanedTopics) {
      console.log(`   ⚠  ORPHANED: ${group.id}/${t} (exists, not in route)`);
      warnings++;
    }
  }

  // Check each registered topic
  for (const topic of group.topics) {
    const topicPath = `${groupPath}/${topic.id}`;
    const topicExists = await dirExists(topicPath);
    const url = `/curriculum/math/by_topics/${group.id}/${topic.id}`;

    if (!topicExists) {
      console.log(`   ❌  BROKEN  "${topic.name}"`);
      console.log(`            ${url}`);
      console.log(`            → folder not found: ${topicPath}`);
      broken++;
    } else {
      const hasUnits = await hasSubfolders(topicPath);
      if (!hasUnits) {
        console.log(`   ⚠️  EMPTY   "${topic.name}" — no unit subfolders`);
        console.log(`            ${url}`);
        warnings++;
      } else {
        console.log(`   ✅  OK      "${topic.name}"`);
        console.log(`            ${url}`);
        ok++;
      }
    }
  }
}

// ── 3. Summary ────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(70));
console.log("\n📋  SUMMARY\n");
console.log(`   ✅  Links OK      : ${ok}`);
console.log(
  `   ⚠️   Warnings      : ${warnings}  (orphaned folders, empty topics)`,
);
console.log(`   ❌  Broken links  : ${broken}`);

if (broken === 0 && warnings === 0) {
  console.log("\n🎉  All topic links are valid!\n");
} else if (broken === 0) {
  console.log(
    "\n✅  No broken links, but review the warnings above.\n" +
      "    Orphaned folders = folders that exist on disk but are NOT listed\n" +
      "    in routes/curriculum/math/by_topics.tsx — they're unreachable\n" +
      "    via the UI unless you add them to the MATH_GROUPS array.\n",
  );
} else {
  console.log(
    "\n❌  Fix broken links before deploying.\n" +
      "    Either rename the folders to match the hardcoded IDs,\n" +
      "    OR update the MATH_GROUPS array in by_topics.tsx to match\n" +
      "    the new folder names.\n",
  );
  Deno.exit(1);
}
