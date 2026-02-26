import { define } from "../../../../utils.ts";
import { Head } from "fresh/runtime";
import GradeUnitPanel from "../../../../islands/GradeUnitPanel.tsx";

async function* walkDir(dir: string): AsyncIterableIterator<string> {
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) {
      yield* walkDir(path);
    } else if (entry.isFile && entry.name.endsWith(".mdx")) {
      yield path;
    }
  }
}

export default define.page(async function GradeOverview(ctx) {
  const grade = ctx.params.grade; // e.g., "grade_1"
  const curriculumPath = `curriculums/en/math/by_topics`;

  // Stores { name: lessonFileName, path: /learn/en/... route }
  const unitsMap = new Map<string, { name: string; path: string }[]>();

  try {
    for await (const filePath of walkDir(curriculumPath)) {
      const content = await Deno.readTextFile(filePath);
      // Simple check for grade in frontmatter
      if (
        content.includes(`grade: "${grade}"`) ||
        content.includes(`grade: ${grade}`)
      ) {
        // Extract unit from frontmatter or path
        const unitMatch = content.match(/unit:\s*"?([^"\n]+)"?/);
        let unitName = "Other";
        if (unitMatch) {
          unitName = unitMatch[1].trim();
        } else {
          // Fallback to directory name
          const parts = filePath.split(/[\\/]/);
          if (parts.length >= 2) {
            unitName = parts[parts.length - 2];
          }
        }

        const fileName = filePath.split(/[\\/]/).pop() || "";
        const lessonName = fileName.replace(".mdx", "");
        // Derive the actual MDX route URL from the file path
        // curriculums/en/... → /learn/en/...
        const routePath = "/" + filePath.replace(/\\/g, "/").replace(
          /^curriculums\//,
          "learn/",
        ).replace(/\.mdx$/, "");

        if (!unitsMap.has(unitName)) {
          unitsMap.set(unitName, []);
        }
        unitsMap.get(unitName)!.push({ name: lessonName, path: routePath });
      }
    }
    console.log(
      `Found ${unitsMap.size} units for grade ${grade}:`,
      Array.from(unitsMap.keys()),
    );
  } catch (e) {
    console.error("Error reading curriculum:", e);
  }

  if (unitsMap.size === 0) {
    return (
      <div class="page-container" style="text-align: center;">
        <h1 class="page-title">Grade Not Found</h1>
        <p>Return to the curriculum overview.</p>
        <a
          href="/curriculum/math/by_grade"
          class="btn-primary"
          style="display: inline-block; margin-top: 1rem; text-decoration: none;"
        >
          Go Back
        </a>
      </div>
    );
  }

  const units: { name: string; lessons: { name: string; path: string }[] }[] =
    [];
  for (const [name, lessons] of unitsMap.entries()) {
    // Sort lessons: introductions first, then numbered, then quizzes last
    lessons.sort((a, b) => {
      const getWeight = (n: string) => {
        if (n.includes("introduction")) return -1;
        if (n.includes("quiz") || n.includes("test")) return 1000;
        const match = n.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 999;
      };

      const weightA = getWeight(a.name);
      const weightB = getWeight(b.name);

      if (weightA !== weightB) return weightA - weightB;
      return a.name.localeCompare(b.name);
    });

    units.push({ name, lessons });
  }

  // Sort units numerically if they have numbers, otherwise alphabetically
  units.sort((a, b) => {
    const numA = parseInt(a.name.match(/unit_(\d+)/)?.[1] || "999");
    const numB = parseInt(b.name.match(/unit_(\d+)/)?.[1] || "999");

    if (numA !== 999 || numB !== 999) {
      return numA - numB;
    }

    return a.name.localeCompare(b.name);
  });

  const formattedGradeTitle = grade.replace(/_/g, " ").replace(
    /\b\w/g,
    (c) => c.toUpperCase(),
  );

  const totalLessons = units.reduce((acc, u) => acc + u.lessons.length, 0);

  return (
    <>
      <Head>
        <title>{formattedGradeTitle} Math | Sovereign Academy</title>
      </Head>
      <GradeUnitPanel
        units={units}
        grade={grade}
        gradeTitle={`${formattedGradeTitle} Math`}
        totalLessons={totalLessons}
      />
    </>
  );
});
