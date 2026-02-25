#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Creates the two missing subdomains under 3_change_and_relationships:
 *   06_ratios_and_rates       (from subjects/math/by_topics/11_ratios_rates_proportions.txt)
 *   08_functions              (from subjects/math/by_topics/16_functions.txt)
 *
 * Only K-8 content is scaffolded here. High-school courses (Algebra 1+)
 * will be added in a separate high-school expansion script.
 *
 * Run:  deno run --allow-read --allow-write scripts/create_missing_subdomains.ts
 * Dry:  deno run --allow-read --allow-write scripts/create_missing_subdomains.ts --dry-run
 */

import { ensureDir } from "jsr:@std/fs@1";
import { join } from "jsr:@std/path@1";

const DRY = Deno.args.includes("--dry-run");
const BASE = "curriculums/en/math/by_topics/3_change_and_relationships";

// ─── helpers ──────────────────────────────────────────────────────────────────

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

async function writeStub(
  dir: string,
  filename: string,
  grade: string,
  unit: string,
  topic: string,
  type: "lesson" | "quiz" | "test",
) {
  const path = join(dir, filename);
  const content = `---
grade: ${grade}
unit: ${unit}
topic: ${topic}
type: ${type}
---

{/* TODO: Write ${type} content here */}
`;
  if (DRY) {
    console.log(`[DRY] ${path}`);
  } else {
    await ensureDir(dir);
    await Deno.writeTextFile(path, content);
    console.log(`  ✓  ${path}`);
  }
}

type Lesson = string;
interface Unit {
  num: string; // folder prefix, e.g. "unit_1"
  name: string; // human name → slug used as unit value in frontmatter
  grade: string; // e.g. "grade_6", "pre_algebra", "arithmetic"
  lessons: Lesson[];
}

// ─── 06_ratios_and_rates ──────────────────────────────────────────────────────

const RATIOS_DIR = join(BASE, "06_ratios_and_rates");

const ratiosUnits: Unit[] = [
  // ── Grade 6 ──────────────────────────────────────────────────────────────
  {
    num: "unit_1",
    name: "ratios",
    grade: "grade_6",
    lessons: [
      "intro_to_ratios",
      "visualize_ratios",
      "ratio_word_problems",
      "equivalent_ratios",
      "equivalent_ratios_word_problems",
      "ratio_tables",
    ],
  },
  {
    num: "unit_3",
    name: "rates_and_percentages",
    grade: "grade_6",
    lessons: [
      "intro_to_rates",
      "unit_rates",
      "converting_units",
      "unit_rate_word_problems",
      "percent_of_a_number",
      "percent_word_problems",
      "finding_the_whole_from_the_percent",
      "percent_problems_tax_tip_discount_commission",
    ],
  },
  // ── Grade 7 ──────────────────────────────────────────────────────────────
  {
    num: "unit_1",
    name: "proportional_relationships",
    grade: "grade_7",
    lessons: [
      "intro_to_proportional_relationships",
      "identifying_proportional_relationships",
      "identifying_proportional_relationships_from_tables",
      "identifying_proportional_relationships_from_graphs",
      "writing_proportions",
      "solving_proportions",
      "constant_of_proportionality",
      "proportional_relationship_equations",
      "proportion_word_problems",
    ],
  },
  {
    num: "unit_2",
    name: "rates_and_percentages_advanced",
    grade: "grade_7",
    lessons: [
      "unit_rate_problems",
      "rate_problems_with_fractions",
      "multi_step_ratio_and_percent_problems",
      "percent_increase_and_decrease",
      "percent_change",
      "tax_tip_markup_discount_commission_word_problems",
      "simple_interest",
    ],
  },
];

// ─── 08_functions ─────────────────────────────────────────────────────────────

const FUNCTIONS_DIR = join(BASE, "08_functions");

const functionsUnits: Unit[] = [
  // ── Grade 8 (partial) ────────────────────────────────────────────────────
  {
    num: "unit_3",
    name: "intro_to_functions",
    grade: "grade_8",
    lessons: [
      "introduction_to_functions",
      "recognizing_functions_from_tables_and_graphs",
      "linear_vs_nonlinear_functions",
      "interpreting_function_graphs",
      "comparing_functions",
    ],
  },
];

// ─── main ─────────────────────────────────────────────────────────────────────

async function processUnits(subdomainDir: string, units: Unit[]) {
  // Build a map: folderName → [grades that use it]
  // Folders with the SAME num+name but different grades share a folder.
  // Folders with the SAME num but DIFFERENT name get distinct folders.

  const folderMap = new Map<string, Unit[]>();
  for (const u of units) {
    const folderName = `${u.num}_${slug(u.name)}`;
    if (!folderMap.has(folderName)) folderMap.set(folderName, []);
    folderMap.get(folderName)!.push(u);
  }

  for (const [folderName, gradeUnits] of folderMap) {
    const dir = join(subdomainDir, folderName);
    console.log(`\n📁 ${dir}`);

    for (const u of gradeUnits) {
      const unitSlug = slug(u.name);
      // Lessons
      for (let i = 0; i < u.lessons.length; i++) {
        const lessonSlug = u.lessons[i];
        const filename = `${u.grade}_${pad(i + 1)}_${lessonSlug}.mdx`;
        await writeStub(dir, filename, u.grade, unitSlug, lessonSlug, "lesson");
      }
      // Quiz & Test
      await writeStub(
        dir,
        `${u.grade}_unit_quiz_${unitSlug}.mdx`,
        u.grade,
        unitSlug,
        `unit_quiz`,
        "quiz",
      );
      await writeStub(
        dir,
        `${u.grade}_unit_test_${unitSlug}.mdx`,
        u.grade,
        unitSlug,
        `unit_test`,
        "test",
      );
    }
  }
}

console.log(DRY ? "=== DRY RUN ===" : "=== CREATING FILES ===");
console.log("\n── 06_ratios_and_rates ──────────────────────────────────────");
await processUnits(RATIOS_DIR, ratiosUnits);

console.log("\n── 08_functions ─────────────────────────────────────────────");
await processUnits(FUNCTIONS_DIR, functionsUnits);

console.log(
  `\n✅ Done${DRY ? " (dry run — no files written)" : ""}.`,
);
