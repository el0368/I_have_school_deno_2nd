import { expandGlob } from "jsr:@std/fs@1/expand-glob";
import { ensureDir } from "jsr:@std/fs@1/ensure-dir";
import { dirname, join } from "jsr:@std/path@1";

const TOPICS_DIR =
  "c:\\GitHub\\I_have_school_deno_2nd\\curriculums\\math\\by_topics";

async function fix() {
  for await (const file of expandGlob(join(TOPICS_DIR, "**/*.mdx"))) {
    const relativePath = file.path.substring(TOPICS_DIR.length + 1);
    const parts = relativePath.split("\\");

    // The structure is currently: by_topics / group / topic / grade / unit / file.mdx
    // So parts[0] is group, parts[1] is topic, parts[2] is grade.
    if (
      parts.length >= 4 &&
      (parts[2].startsWith("grade_") || parts[2] === "kindergarten")
    ) {
      parts.splice(2, 1); // remove the grade folder from the path

      const destPathStr = join(TOPICS_DIR, ...parts);
      await ensureDir(dirname(destPathStr));
      try {
        await Deno.rename(file.path, destPathStr);
        console.log(`Moved to ${destPathStr}`);
      } catch (e) {
        console.error(`Failed to move ${file.path}: ${e}`);
      }
    }
  }
}

fix().then(() => console.log("Done fixing paths!")).catch(console.error);
