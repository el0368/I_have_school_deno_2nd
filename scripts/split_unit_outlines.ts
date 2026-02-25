/**
 * split_unit_outlines.ts
 *
 * Splits every "Unit Outline" file (detected by `topic:` in frontmatter)
 * into individual lesson stub files, one per bullet point.
 *
 * Input file example (grade_5_02_adding_decimals.mdx):
 *   ---
 *   title: "Unit 2: Adding Decimals"
 *   grade: "grade_5"
 *   topic: "01_number_sense_and_operations"
 *   ---
 *   # Unit 2: Adding Decimals
 *   - Adding decimals using models
 *   - Adding decimals using place value
 *
 * Output (replaces the input file with):
 *   grade_5_01_adding_decimals_using_models.mdx
 *   grade_5_02_adding_decimals_using_place_value.mdx
 *   grade_5_unit_quiz_adding_decimals.mdx
 *   grade_5_unit_test_adding_decimals.mdx
 *
 * Usage:
 *   deno run -A scripts/split_unit_outlines.ts          ← dry run
 *   deno run -A scripts/split_unit_outlines.ts --apply  ← execute
 */

import { walk } from "jsr:@std/fs@1/walk";
import { dirname, join } from "jsr:@std/path@1";

const DRY_RUN = !Deno.args.includes("--apply");
const ROOT = "curriculums/en/math/by_topics";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Convert a lesson title to a snake_case filename slug. */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[^a-z0-9\s-]/g, "") // strip punctuation
    .trim()
    .replace(/\s+/g, "_");
}

/** Extract a frontmatter value by key. Returns "" if not found. */
function getFrontmatter(content: string, key: string): string {
  const m = content.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?`, "m"));
  return m ? m[1].trim() : "";
}

/** Parse bullet-point lessons from the body of a Unit Outline. */
function parseBullets(content: string): string[] {
  return content
    .split("\n")
    .filter((l) => l.trimStart().startsWith("- "))
    .map((l) => l.replace(/^[\s]*-\s+/, "").trim())
    .filter((l) => l.length > 0);
}

/** Derive the unit slug from the parent folder name.
 *  e.g. "unit_2_adding_decimals" → "adding_decimals"
 */
function unitSlugFromFolder(folder: string): string {
  // Remove leading "unit_N_" prefix
  return folder.replace(/^unit_\d+_/, "");
}

/** Build the frontmatter + minimal body for a new lesson stub. */
function lessonStub(
  title: string,
  grade: string,
  unitFolder: string,
): string {
  return `---
title: "${title.replace(/"/g, '\\"')}"
grade: "${grade}"
unit: "${unitFolder}"
---

# ${title}

{/* TODO: Write lesson content here */}
`;
}

/** Build the frontmatter + minimal body for a quiz stub. */
function quizStub(
  unitTitle: string,
  grade: string,
  unitFolder: string,
): string {
  return `---
title: "Unit Quiz: ${unitTitle.replace(/"/g, '\\"')}"
grade: "${grade}"
unit: "${unitFolder}"
---

# Unit Quiz: ${unitTitle}

{/* TODO: Add quiz questions here */}
`;
}

/** Build the frontmatter + minimal body for a unit test stub. */
function unitTestStub(
  unitTitle: string,
  grade: string,
  unitFolder: string,
): string {
  return `---
title: "Unit Test: ${unitTitle.replace(/"/g, '\\"')}"
grade: "${grade}"
unit: "${unitFolder}"
---

# Unit Test: ${unitTitle}

{/* TODO: Add unit test questions here */}
`;
}

// ── main ─────────────────────────────────────────────────────────────────────

interface Plan {
  sourceFile: string;
  grade: string;
  unitFolder: string;
  unitTitle: string;
  newFiles: { path: string; content: string }[];
}

const plans: Plan[] = [];

for await (const entry of walk(ROOT, { exts: [".mdx"] })) {
  const content = await Deno.readTextFile(entry.path);

  // Only process Unit Outline files — those with `topic:` frontmatter
  if (!content.match(/^topic:/m)) continue;

  const grade = getFrontmatter(content, "grade");
  const rawTitle = getFrontmatter(content, "title");
  // Strip "Unit N: " prefix to get the bare unit title
  const unitTitle = rawTitle.replace(/^Unit \d+:\s*/i, "").trim();

  const dir = dirname(entry.path);
  const unitFolder = dir.split(/[/\\]/).at(-1) ?? "";
  const unitSlug = unitSlugFromFolder(unitFolder);

  const bullets = parseBullets(content);
  if (bullets.length === 0) continue; // nothing to split

  const newFiles: { path: string; content: string }[] = [];

  // One stub per lesson bullet
  bullets.forEach((title, i) => {
    const num = String(i + 1).padStart(2, "0");
    const filename = `${grade}_${num}_${toSlug(title)}.mdx`;
    newFiles.push({
      path: join(dir, filename),
      content: lessonStub(title, grade, unitFolder),
    });
  });

  // Quiz + unit test at the end
  newFiles.push({
    path: join(dir, `${grade}_unit_quiz_${unitSlug}.mdx`),
    content: quizStub(unitTitle, grade, unitFolder),
  });
  newFiles.push({
    path: join(dir, `${grade}_unit_test_${unitSlug}.mdx`),
    content: unitTestStub(unitTitle, grade, unitFolder),
  });

  plans.push({
    sourceFile: entry.path,
    grade,
    unitFolder,
    unitTitle,
    newFiles,
  });
}

if (plans.length === 0) {
  console.log("✅ No Unit Outline files found — nothing to split.");
  Deno.exit(0);
}

// ── report / execute ──────────────────────────────────────────────────────────

console.log(
  `\n${
    DRY_RUN ? "🔍 DRY RUN — no files will be changed" : "✏️  APPLYING splits"
  }\n`,
);

let totalNew = 0;

for (const plan of plans) {
  const shortSrc = plan.sourceFile.replace(ROOT + "/", "").replace(
    ROOT + "\\",
    "",
  );
  console.log(`\n📂 ${shortSrc}  (${plan.newFiles.length} files)`);
  for (const f of plan.newFiles) {
    const shortDest = f.path.replace(ROOT + "/", "").replace(ROOT + "\\", "");
    console.log(`   + ${shortDest}`);
    if (!DRY_RUN) {
      await Deno.writeTextFile(f.path, f.content);
    }
    totalNew++;
  }
  if (!DRY_RUN) {
    await Deno.remove(plan.sourceFile);
    console.log(`   ✗ deleted source`);
  }
}

console.log(
  `\n${
    DRY_RUN
      ? `📋 ${plans.length} Unit Outline files → ${totalNew} new lesson files.\n   Run with --apply to execute:\n   deno run -A scripts/split_unit_outlines.ts --apply`
      : `✅ Done. ${plans.length} outlines split into ${totalNew} lesson stubs.`
  }\n`,
);
