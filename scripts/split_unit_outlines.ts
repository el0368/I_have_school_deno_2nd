import { walk } from "jsr:@std/fs@1/walk";
import { dirname, join } from "jsr:@std/path@1";

const DRY_RUN = !Deno.args.includes("--apply");
const ROOT = "curriculums";

/** Convert a lesson title to a snake_case filename slug. */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[^a-z0-9\s-]/g, "") // strip punctuation
    .trim()
    .replace(/\s+/g, "_");
}

function getFrontmatter(content: string, key: string): string {
  const m = content.match(
    new RegExp("^" + key + ":\\s*['\"]?([^'\"\\n]+)['\"]?", "m"),
  );
  return m ? m[1].trim() : "";
}

/** Parse bullet-point lessons from the body of a Unit Outline. */
function parseBullets(content: string): string[] {
  return content
    .split("\n")
    .filter((l) => l.trimStart().startsWith("- "))
    .map((l) => l.replace(/^[\\s]*-\\s+/, "").trim())
    .filter((l) => l.length > 0);
}

/** Derive the unit slug from the parent folder name.
 *  e.g. "unit_2_adding_decimals" → "adding_decimals"
 */
function unitSlugFromFolder(folder: string): string {
  return folder.replace(/^unit_\\d+_/, "");
}

function lessonStub(title: string, grade: string, unitFolder: string): string {
  return `---
title: "${title.replace(/"/g, '"')}"
grade: "${grade}"
unit: "${unitFolder}"
---

# ${title}

{/* TODO: Write lesson content here */}
`;
}

function quizStub(
  unitTitle: string,
  grade: string,
  unitFolder: string,
): string {
  return `---
title: "Unit Quiz: ${unitTitle.replace(/"/g, '"')}"
grade: "${grade}"
unit: "${unitFolder}"
---

# Unit Quiz: ${unitTitle}

{/* TODO: Add quiz questions here */}
`;
}

function unitTestStub(
  unitTitle: string,
  grade: string,
  unitFolder: string,
): string {
  return `---
title: "Unit Test: ${unitTitle.replace(/"/g, '"')}"
grade: "${grade}"
unit: "${unitFolder}"
---

# Unit Test: ${unitTitle}

{/* TODO: Add unit test questions here */}
`;
}

interface Plan {
  sourceFile: string;
  unitFolder: string;
  unitTitle: string;
  newFiles: { path: string; content: string }[];
}

const plans: Plan[] = [];

for await (const entry of walk(ROOT, { exts: [".mdx"] })) {
  const content = await Deno.readTextFile(entry.path);
  if (!content.match(/^topic:/m)) continue;

  const grade = getFrontmatter(content, "grade");
  const rawTitle = getFrontmatter(content, "title");
  const unitTitle = rawTitle.replace(/^Unit \\d+:\\s*/, "");
  const dir = dirname(entry.path);
  const unitFolder = dir.split(/[\\\\/]/).at(-1) ?? "";
  const unitSlug = unitSlugFromFolder(unitFolder);

  const bullets = parseBullets(content);
  if (bullets.length === 0) continue;

  const newFiles: { path: string; content: string }[] = [];
  bullets.forEach((title, i) => {
    const num = String(i + 1).padStart(2, "0");
    const filename = `${grade}_${num}_${toSlug(title)}.mdx`;
    newFiles.push({
      path: join(dir, filename),
      content: lessonStub(title, grade, unitFolder),
    });
  });

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
    unitFolder,
    unitTitle,
    newFiles,
  });
}

if (plans.length === 0) {
  console.log("✅ No Unit Outline files found to split.");
  Deno.exit(0);
}

console.log(`\\n${DRY_RUN ? "��� DRY RUN" : "✏️  APPLYING"}\\n`);
let totalNew = 0;

for (const plan of plans) {
  console.log(`��� ${plan.sourceFile}`);
  for (const f of plan.newFiles) {
    console.log(`  + ${f.path}`);
    if (!DRY_RUN) await Deno.writeTextFile(f.path, f.content);
    totalNew++;
  }
  if (!DRY_RUN) await Deno.remove(plan.sourceFile);
}

console.log(`\\nDone. ${plans.length} outlines -> ${totalNew} lesson stubs.`);
