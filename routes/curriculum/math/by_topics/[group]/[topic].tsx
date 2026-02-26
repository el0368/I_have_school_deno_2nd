import { define } from "../../../../../utils.ts";
import { Head } from "fresh/runtime";

function formatUnitTitle(name: string): string {
  return name
    .replace(/^unit_\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default define.page(async function TopicOverview(ctx) {
  const group = ctx.params.group;
  const topic = ctx.params.topic;
  const curriculumPath = `curriculums/en/math/by_topics/${group}/${topic}`;

  const units: { name: string; lessonCount: number }[] = [];

  try {
    for await (const dirEntry of Deno.readDir(curriculumPath)) {
      if (dirEntry.isDirectory) {
        let lessonCount = 0;
        for await (
          const fileEntry of Deno.readDir(`${curriculumPath}/${dirEntry.name}`)
        ) {
          if (
            fileEntry.isFile && fileEntry.name.endsWith(".mdx") &&
            !fileEntry.name.includes("quiz") &&
            !fileEntry.name.includes("test")
          ) {
            lessonCount++;
          }
        }
        units.push({ name: dirEntry.name, lessonCount });
      }
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

  units.sort((a, b) => {
    const numA = parseInt(a.name.match(/unit_(\d+)/)?.[1] || "0");
    const numB = parseInt(b.name.match(/unit_(\d+)/)?.[1] || "0");
    return numA - numB;
  });

  const formattedTopicTitle = topic
    .replace(/^\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const totalLessons = units.reduce((acc, u) => acc + u.lessonCount, 0);

  return (
    <>
      <Head>
        <title>{formattedTopicTitle} | Sovereign Academy</title>
      </Head>

      <div class="subject-hero">
        <div class="page-container" style="padding-top:0;padding-bottom:0;">
          <h1 class="hero-large-title">{formattedTopicTitle}</h1>
          <p class="hero-large-subtitle">
            {units.length} units · {totalLessons} lessons
          </p>
        </div>
      </div>

      <main
        class="page-container"
        style="padding-top: var(--spacing-8); padding-bottom: var(--spacing-10); margin-top: -1.5rem;"
      >
        <div style="margin-bottom: var(--spacing-6);">
          <a
            href="/curriculum/math/by_topics"
            style="display:inline-block;text-decoration:none;color:var(--color-primary);font-weight:bold;"
          >
            ← Back to Topics
          </a>
        </div>

        <div class="unit-topic-grid">
          {units.map((u, i) => (
            <a
              href={`/curriculum/math/by_topics/${group}/${topic}/${u.name}`}
              class="unit-topic-card"
            >
              <span class="unit-topic-number">Unit {i + 1}</span>
              <span class="unit-topic-title">{formatUnitTitle(u.name)}</span>
              <span class="unit-topic-count">{u.lessonCount} lessons</span>
            </a>
          ))}
        </div>
      </main>
    </>
  );
});
