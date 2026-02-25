/**
 * zero_pad_lessons.ts
 *
 * Renames lesson files in curriculums/en/math/by_topics to use zero-padded
 * lesson numbers so alphabetical sort = correct lesson order.
 *
 * Pattern matched:  grade_1_1_title.mdx  →  grade_1_01_title.mdx
 *                   kindergarten_3_title.mdx  →  kindergarten_03_title.mdx
 *                   grade_1_quiz_1_title.mdx  →  grade_1_quiz_01_title.mdx
 *
 * Already 2+ digit numbers are left alone:
 *                   grade_2_10_title.mdx  →  unchanged
 *
 * Usage:
 *   deno run -A scripts/zero_pad_lessons.ts          ← dry run (shows renames)
 *   deno run -A scripts/zero_pad_lessons.ts --apply  ← actually renames files
 */

import { walk } from "jsr:@std/fs@1/walk";
import { dirname, join } from "jsr:@std/path@1";

const DRY_RUN = !Deno.args.includes("--apply");
const ROOT = "curriculums/en/math/by_topics";

// Matches:  grade_1_1_title.mdx   or   kindergarten_1_title.mdx
// Group 1: prefix up to and including the grade  (e.g. "grade_1_"  or "kindergarten_")
// Group 2: the single-digit lesson number         (e.g. "1")
// Group 3: the rest of the filename               (e.g. "_title.mdx")
const LESSON_RE = /^((?:grade_\d+|kindergarten)_)(\d)(_[^/]+\.mdx)$/;

// Matches:  grade_1_quiz_1_title.mdx
// Group 1: prefix including "quiz_"              (e.g. "grade_1_quiz_")
// Group 2: the single-digit quiz number          (e.g. "1")
// Group 3: the rest                              (e.g. "_title.mdx")
const QUIZ_RE = /^((?:grade_\d+|kindergarten)_quiz_)(\d)(_[^/]+\.mdx)$/;

interface Rename {
  from: string;
  to: string;
}

const renames: Rename[] = [];

for await (const entry of walk(ROOT, { exts: [".mdx"] })) {
  const filename = entry.name;
  const dir = dirname(entry.path);

  let match = LESSON_RE.exec(filename);
  if (match) {
    const [, prefix, digit, suffix] = match;
    const newName = `${prefix}0${digit}${suffix}`;
    if (newName !== filename) {
      renames.push({ from: entry.path, to: join(dir, newName) });
    }
    continue;
  }

  match = QUIZ_RE.exec(filename);
  if (match) {
    const [, prefix, digit, suffix] = match;
    const newName = `${prefix}0${digit}${suffix}`;
    if (newName !== filename) {
      renames.push({ from: entry.path, to: join(dir, newName) });
    }
  }
}

if (renames.length === 0) {
  console.log("✅ No files need renaming.");
  Deno.exit(0);
}

console.log(
  `\n${
    DRY_RUN ? "🔍 DRY RUN — no files will be changed" : "✏️  APPLYING renames"
  }\n`,
);

let changed = 0;
for (const { from, to } of renames) {
  const fromShort = from.replace(ROOT + "/", "");
  const toShort = to.replace(ROOT + "/", "");
  console.log(`  ${fromShort}`);
  console.log(`  → ${toShort}\n`);

  if (!DRY_RUN) {
    await Deno.rename(from, to);
    changed++;
  }
}

if (DRY_RUN) {
  console.log(
    `\n📋 ${renames.length} files would be renamed.\n` +
      `   Run with --apply to execute:\n` +
      `   deno run -A scripts/zero_pad_lessons.ts --apply\n`,
  );
} else {
  console.log(`\n✅ ${changed} files renamed successfully.\n`);
}
