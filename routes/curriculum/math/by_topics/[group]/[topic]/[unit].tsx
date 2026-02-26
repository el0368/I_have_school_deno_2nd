import { define } from "../../../../../../utils.ts";
import { Head } from "fresh/runtime";
import GradeUnitPanel from "../../../../../../islands/GradeUnitPanel.tsx";

export default define.page(async function UnitOverview(ctx) {
  const group = ctx.params.group;
  const topic = ctx.params.topic;
  const unit = ctx.params.unit;
  const unitPath = `curriculums/en/math/by_topics/${group}/${topic}/${unit}`;

  const lessons: string[] = [];

  try {
    for await (const fileEntry of Deno.readDir(unitPath)) {
      if (fileEntry.isFile && fileEntry.name.endsWith(".mdx")) {
        lessons.push(fileEntry.name.replace(".mdx", ""));
      }
    }
  } catch (_e) {
    return (
      <div class="page-container" style="text-align: center;">
        <h1 class="page-title">Unit Not Found</h1>
        <a
          href={`/curriculum/math/by_topics/${group}/${topic}`}
          class="btn-primary"
          style="display:inline-block;margin-top:1rem;text-decoration:none;"
        >
          Back to Topic
        </a>
      </div>
    );
  }

  lessons.sort((a, b) => {
    const getWeight = (name: string) => {
      if (name.includes("introduction")) return -1;
      if (name.includes("quiz") || name.includes("test")) return 1000;
      const match = name.match(/^(\d+)/);
      return match ? parseInt(match[1]) : 999;
    };
    const wa = getWeight(a);
    const wb = getWeight(b);
    if (wa !== wb) return wa - wb;
    return a.localeCompare(b);
  });

  const formattedUnitTitle = unit
    .replace(/^unit_\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const formattedTopicTitle = topic
    .replace(/^\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const unitData = [{
    name: unit,
    lessons: lessons.map((l) => ({
      name: l,
      path: `/learn/en/math/by_topics/${group}/${topic}/${unit}/${l}`,
    })),
  }];

  return (
    <>
      <Head>
        <title>{formattedUnitTitle} | Sovereign Academy</title>
      </Head>
      <GradeUnitPanel
        units={unitData}
        grade={unit}
        gradeTitle={formattedUnitTitle}
        totalLessons={lessons.length}
        backLink={`/curriculum/math/by_topics/${group}/${topic}`}
        backLabel={`← ${formattedTopicTitle}`}
      />
    </>
  );
});
