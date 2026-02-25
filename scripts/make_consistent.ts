import { expandGlob } from "jsr:@std/fs@1/expand-glob";
import { basename, dirname, join } from "jsr:@std/path@1";

const TOPICS_DIR =
  "c:\\GitHub\\I_have_school_deno_2nd\\curriculums\\math\\by_topics";

async function makeConsistent() {
  for await (const file of expandGlob(join(TOPICS_DIR, "**/*.mdx"))) {
    const content = await Deno.readTextFile(file.path);

    // Extract Grade from Frontmatter
    let grade = "unknown";
    const gradeMatch = content.match(/^grade:\s*["']?([^"'\n]+)["']?/m);
    if (gradeMatch) {
      grade = gradeMatch[1];
    }

    const currentName = basename(file.path, ".mdx");
    let baseName = currentName;

    // If it's one of the "syllabus.mdx" files we just made, rename it based on its parent folder
    if (currentName === "syllabus") {
      const parentFolder = basename(dirname(file.path));
      baseName = parentFolder.replace("unit_", ""); // e.g. "1_intro_to_multiplication"
    }
    // If it's an old file like "1_numbers_from_1_to_9", we keep that name

    // Now, FORCE every single file to start with its grade level so VS Code sorts them perfectly
    // e.g. grade_1_1_numbers_from_1_to_9.mdx
    let finalName = baseName;
    if (
      !baseName.startsWith("grade_") && !baseName.startsWith("kindergarten")
    ) {
      finalName = `${grade}_${baseName}`;
    }

    const newPath = join(dirname(file.path), `${finalName}.mdx`);

    if (file.path !== newPath) {
      await Deno.rename(file.path, newPath);
      console.log(`Renamed: ${basename(file.path)} -> ${basename(newPath)}`);
    }
  }
}

makeConsistent().then(() =>
  console.log("Done making everything 100% consistent!")
).catch(console.error);
