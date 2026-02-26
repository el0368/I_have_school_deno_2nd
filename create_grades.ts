import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";

const grades = [
  "kindergarten",
  "grade_1",
  "grade_2",
  "grade_3",
  "grade_4",
  "grade_5",
  "grade_6",
  "grade_7",
  "grade_8",
  "high_school",
];

async function createGradeFolders() {
  for (const grade of grades) {
    const unitPath =
      `./curriculums/en/math/by_grade/${grade}/unit_01_getting_started`;
    await ensureDir(unitPath);

    // Create a dummy lesson file so it renders something
    await Deno.writeTextFile(
      `${unitPath}/01_introduction.mdx`,
      `# Welcome to ${grade}\n\nThis is a placeholder lesson.`,
    );
    console.log(`Created placeholder for ${grade}`);
  }
}

createGradeFolders();
