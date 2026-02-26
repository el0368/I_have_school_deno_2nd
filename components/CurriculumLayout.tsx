import { ComponentChildren } from "preact";
import MarkCompleteButton from "../islands/MarkCompleteButton.tsx";
import { formatLessonTitle, topicOverviewLink } from "../utils/lesson_nav.ts";

interface Props {
  children: ComponentChildren;
  path: string;
  /** URL of the previous lesson (set by the MDX router in main.ts) */
  prevLesson?: string;
  /** URL of the next lesson (set by the MDX router in main.ts) */
  nextLesson?: string;
}

export function CurriculumLayout(
  { children, path, prevLesson, nextLesson }: Props,
) {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  const title = filename ? formatLessonTitle(filename) : "Lesson";
  const breadcrumb = parts.map((p: string) =>
    p.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
  ).filter(Boolean).join(" > ");

  // Derive the topic overview link (e.g. /curriculum/math/by_topics/1_the_core/01_number_sense_and_operations)
  const overviewLink = topicOverviewLink(path);

  return (
    <>
      <title>{title}</title>

      <div class="app-container">
        {/* Sidebar Navigation */}
        <nav class="sidebar">
          <div class="sidebar-navigation-items">
            <div class="sidebar-label">
              Location
            </div>
            <div class="sidebar-content">
              {breadcrumb}
            </div>
          </div>

          <div class="sidebar-footer">
            <a href={overviewLink} class="sidebar-link">
              ← Back to Overview
            </a>
            <a
              href="/"
              class="sidebar-link"
            >
              ← Back to Home
            </a>
          </div>
        </nav>

        {/* Main Content Area */}
        <main class="main-content">
          <div class="lesson-card">
            {/* MDX Content Document */}
            <article class="prose">
              {children}
            </article>

            <hr class="divider" />

            {/* Prev / Next Navigation */}
            <nav class="lesson-nav">
              {prevLesson
                ? (
                  <a href={prevLesson} class="lesson-nav-link lesson-nav-prev">
                    ← Previous Lesson
                  </a>
                )
                : <span />}
              {nextLesson
                ? (
                  <a href={nextLesson} class="lesson-nav-link lesson-nav-next">
                    Next Lesson →
                  </a>
                )
                : <span />}
            </nav>

            {/* Footer */}
            <div class="card-footer">
              <div class="path-pill">
                {path}
              </div>
              <MarkCompleteButton lessonId={path} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
