import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";

async function validateCurriculum() {
  const rootDir = "./curriculums/en/math";
  console.log(`Scanning ${rootDir}...\n`);

  // Group items by their parent directory
  const directories: Record<string, string[]> = {};

  try {
    for await (const entry of walk(rootDir)) {
      if (entry.path === rootDir) continue;

      const parentDir = entry.path.substring(0, entry.path.lastIndexOf("\\"));
      const normalizedParent = parentDir.replace(/\\/g, "/");

      if (!directories[normalizedParent]) {
        directories[normalizedParent] = [];
      }
      directories[normalizedParent].push(entry.name);
    }
  } catch (error) {
    console.error("Error reading directory:", error);
    return;
  }

  let missingFound = false;

  // Regex to match our numbering pattern, e.g., "01_something", "02_something" or "unit_01_something"
  const numberRegex = /^(?:unit_)?(\d+)_/i;

  for (const [dir, items] of Object.entries(directories)) {
    // Filter to only items that start with a number (ignore _template, etc)
    const numberedItems = items
      .map((name) => {
        const match = name.match(numberRegex);
        if (match) {
          return { name, num: parseInt(match[1], 10) };
        }
        return null;
      })
      .filter((item): item is { name: string; num: number } => item !== null)
      .sort((a, b) => a.num - b.num);

    if (numberedItems.length === 0) continue;

    const missing: number[] = [];

    // Check if it starts at 1
    if (numberedItems[0].num !== 1) {
      // Only flag if the lowest number is > 1. Sometimes things might legitimately start at 0, but usually 1.
      if (numberedItems[0].num > 1 && !numberedItems.some((i) => i.num === 0)) {
        console.log(
          `[Missing Start] ${dir} starts at ${
            numberedItems[0].num
          }, expected 1.`,
        );
        missingFound = true;
      }
    }

    // Check for gaps in the sequence
    for (let i = 0; i < numberedItems.length - 1; i++) {
      const current = numberedItems[i].num;
      const next = numberedItems[i + 1].num;

      if (next - current > 1) {
        for (let j = current + 1; j < next; j++) {
          missing.push(j);
        }
      }
    }

    if (missing.length > 0) {
      missingFound = true;
      console.log(`[Gap Found] ${dir}`);
      console.log(`   -> Missing numbers: ${missing.join(", ")}`);
      console.log(
        `   -> Existing: ${numberedItems.map((i) => i.num).join(", ")}`,
      );
    }
  }

  if (!missingFound) {
    console.log(
      "✅ Curriculum structure is perfectly sequential! No missing numbers found.",
    );
  } else {
    console.log("\n⚠️ Found potential gaps in the curriculum structure.");
  }
}

validateCurriculum();
