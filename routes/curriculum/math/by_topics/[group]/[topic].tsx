import { define } from "../../../../../utils.ts";
import { Head } from "fresh/runtime";
import GradeUnitPanel from "../../../../../islands/GradeUnitPanel.tsx";

export default define.page(async function TopicOverview(ctx) {
  const group = ctx.params.group;
  const topic = ctx.params.topic;
  const topicPath = `curriculums/en/math/by_topics/${group}/${topic}`;

  const unitsMap = new Map<string, { name: string; path: string }[]>();

  try {
    for await (const unitEntry of Deno.readDir(topicPath)) {
      if (!unitEntry.isDirectory) continue;
      const unitName = unitEntry.name;
      const unitPath = `${topicPath}/${unitName}`;
      const lessons: { name: string; path: string }[] = [];

      for await (const fileEntry of Deno.readDir(unitPath)) {
        if (fileEntry.isFile && fileEntry.name.endsWith(".mdx")) {
          const lessonName = fileEntry.name.replace(".mdx", "");
          const routePath =
            `/learn/en/math/by_topics/${group}/${topic}/${unitName}/${lessonName}`;
          lessons.push({ name: lessonName, path: routePath });
        }
      }

      lessons.sort((a, b) => {
        const getWeight = (name: string) => {
          if (name.includes("introduction")) return -1;
          if (name.includes("quiz") || name.includes("test")) return 1000;
          const match = name.match(/^(\d+)/);
          return match ? parseInt(match[1]) : 999;
        };
        const wa = getWeight(a.name);
        const wb = getWeight(b.name);
        if (wa !== wb) return wa - wb;
        return a.name.localeCompare(b.name);
      });

      unitsMap.set(unitName, lessons);
    }
  } catch (_e) {
    return (
      <div class="page-container" style="text-align: center;">
        <h1 class="page-title">Topic Not Found</h1>
        <a
          href="/curriculum/math/by_topics"
          class="btn-primary"
          style="display:inline-block;margin-top:1rem;text-decoration:none;"
        >
          Go Back
        </a>
      </div>
    );
  }

  if (unitsMap.size === 0) {
    return (
      <div
        class="page-container"
        style="padding: 4rem 2rem; text-align: center;"
      >
        <p style="font-size: 1.25rem; color: var(--color-text-muted);">
          No units yet — check back soon!
        </p>
        <a
          href="/curriculum/math/by_topics"
          style="display:inline-block;margin-top:1.5rem;text-decoration:none;color:var(--color-primary);font-weight:bold;"
        >
          ← Back to Topics
        </a>
      </div>
    );
  }

  const units: { name: string; lessons: { name: string; path: string }[] }[] =
    [];
  for (const [name, lessons] of unitsMap.entries()) {
    units.push({ name, lessons });
  }

  units.sort((a, b) => {
    const numA = parseInt(a.name.match(/unit_(\d+)/)?.[1] || "999");
    const numB = parseInt(b.name.match(/unit_(\d+)/)?.[1] || "999");
    if (numA !== numB) return numA - numB;
    return a.name.localeCompare(b.name);
  });

  const formattedTopicTitle = topic
    .replace(/^\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const totalLessons = units.reduce(
    (acc, u) =>
      acc +
      u.lessons.filter(
        (l) => !l.name.includes("quiz") && !l.name.includes("test"),
      ).length,
    0,
  );

  return (
    <>
      <Head>
        <title>{formattedTopicTitle} | Sovereign Academy</title>
      </Head>
      <GradeUnitPanel
        units={units}
        grade={topic}
        gradeTitle={formattedTopicTitle}
        totalLessons={totalLessons}
        backLink="/curriculum/math/by_topics"
        backLabel="Back to Topics"
      />
    </>
  );
});
