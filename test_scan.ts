const start = performance.now();
import { walk } from "https://deno.land/std/fs/walk.ts";

let count = 0;
for await (
  const entry of walk("curriculums/en/math/by_topics", { exts: [".mdx"] })
) {
  const content = await Deno.readTextFile(entry.path);
  if (content.includes('grade: "grade_1"')) {
    count++;
  }
}
console.log(`Found ${count} files in ${performance.now() - start}ms`);
