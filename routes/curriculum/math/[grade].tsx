import { define } from "../../../utils.ts";
import { Head } from "fresh/runtime";

export default define.page(async function GradeOverview(ctx) {
  const grade = ctx.params.grade; // e.g., "grade_1"
  const curriculumPath = `curriculums/en/math/${grade}`;

  const units: { name: string; topics: string[] }[] = [];

  try {
    for await (const dirEntry of Deno.readDir(curriculumPath)) {
      if (dirEntry.isDirectory) {
        const unitName = dirEntry.name;
        const topics: string[] = [];
        for await (
          const fileEntry of Deno.readDir(`${curriculumPath}/${unitName}`)
        ) {
          if (fileEntry.isFile && fileEntry.name.endsWith(".mdx")) {
            topics.push(fileEntry.name.replace(".mdx", ""));
          }
        }

        // Sort topics: introductions first, then numbered, then quizzes last
        topics.sort((a, b) => {
          const getWeight = (name: string) => {
            if (name.includes("introduction")) return -1;
            if (name.includes("quiz") || name.includes("test")) return 1000;
            const match = name.match(/^(\d+)/);
            return match ? parseInt(match[1]) : 999;
          };

          const weightA = getWeight(a);
          const weightB = getWeight(b);

          if (weightA !== weightB) return weightA - weightB;
          return a.localeCompare(b);
        });

        units.push({ name: unitName, topics });
      }
    }
  } catch (_e) {
    return (
      <div class="page-container" style="text-align: center;">
        <h1 class="page-title">Grade Not Found</h1>
        <p>Return to the curriculum overview.</p>
        <a
          href="/curriculum/math"
          class="btn-primary"
          style="display: inline-block; margin-top: 1rem; text-decoration: none;"
        >
          Go Back
        </a>
      </div>
    );
  }

  // Sort units numerically
  units.sort((a, b) => {
    const numA = parseInt(a.name.match(/unit_(\d+)/)?.[1] || "0");
    const numB = parseInt(b.name.match(/unit_(\d+)/)?.[1] || "0");
    return numA - numB;
  });

  const formattedGradeTitle = grade.replace(/_/g, " ").replace(
    /\b\w/g,
    (c) => c.toUpperCase(),
  );

  return (
    <>
      <Head>
        <title>{formattedGradeTitle} Overview | Sovereign Academy</title>
      </Head>
      <div class="page-container" style="max-width: 48rem;">
        <header class="page-header">
          <h1 class="page-title">{formattedGradeTitle} Overview</h1>
          <p class="page-subtitle">
            Select a topic to begin learning or practice your skills.
          </p>
          <a
            href="/curriculum/math"
            style="display: inline-block; margin-top: 1rem; text-decoration: none; color: var(--color-primary); font-weight: bold;"
          >
            ← Back to Math Curriculum
          </a>
        </header>

        <div style="display: flex; flex-direction: column; gap: 2rem;">
          {units.map((unit) => (
            <div style="border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 1.5rem; background-color: var(--color-bg-card); box-shadow: var(--shadow-sm);">
              <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-text-main); text-transform: capitalize; border-bottom: 2px solid var(--color-border); padding-bottom: 0.5rem;">
                {unit.name.replace(/_/g, " ")}
              </h2>

              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem;">
                {unit.topics.map((topic) => (
                  <li style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem; padding-top: 0.25rem;">
                    <span style="font-weight: 500; color: var(--color-text-main); text-transform: capitalize; padding-right: 1rem;">
                      {topic.replace(/_/g, " ")}
                    </span>

                    <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                      <a
                        href={`/learn/math/${grade}/${unit.name}/${topic}`}
                        style="padding: 0.375rem 1rem; background-color: var(--color-bg-app); color: var(--color-primary); border: 1px solid var(--color-primary-light); border-radius: 0.375rem; text-decoration: none; font-size: 0.875rem; font-weight: bold; transition: all 0.2s ease;"
                      >
                        Learn
                      </a>
                      <a
                        href={`/practice`}
                        style="padding: 0.375rem 1rem; background-color: white; color: var(--color-text-muted); border: 1px solid var(--color-border-dark); border-radius: 0.375rem; text-decoration: none; font-size: 0.875rem; font-weight: bold; transition: all 0.2s ease;"
                      >
                        Practice
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});
