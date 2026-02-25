import { expandGlob } from "jsr:@std/fs@1/expand-glob";
import { ensureDir } from "jsr:@std/fs@1/ensure-dir";
import { basename, dirname, join } from "jsr:@std/path@1";

const TOPICS_DIR =
  "c:\\GitHub\\I_have_school_deno_2nd\\curriculums\\math\\by_topics";

async function standardize() {
  for await (const file of expandGlob(join(TOPICS_DIR, "**/*.mdx"))) {
    const parentDir = basename(dirname(file.path));

    // Check if the file is sitting directly in a topic folder (parent name starts with digit)
    if (parentDir.match(/^\d+_/)) {
      const fileName = basename(file.path, ".mdx"); // e.g., grade_3_unit_1_intro_to_multiplication

      // We only want to process the ones we just extracted containing "_unit_"
      if (fileName.includes("_unit_")) {
        // Extract the unit part for the folder name
        const match = fileName.match(/^(?:grade_\d+|kindergarten)_(unit_.*)$/);

        if (match) {
          const unitFolderName = match[1]; // e.g., unit_1_intro_to_multiplication
          const newFolderDir = join(dirname(file.path), unitFolderName);

          await ensureDir(newFolderDir);

          // Move the file into the new unit folder and rename it to syllabus.mdx
          // (Since it is the syllabus extracted from the grade file)
          const newFilePath = join(newFolderDir, "syllabus.mdx");

          await Deno.rename(file.path, newFilePath);
          console.log(
            `Standardized: ${fileName}.mdx -> ${unitFolderName}/syllabus.mdx`,
          );
        }
      }
    }
  }
}

standardize().then(() => console.log("Done standardizing loose units!")).catch(
  console.error,
);
