import { useState } from "preact/hooks";

interface Lesson {
  name: string;
  path: string;
}

interface Unit {
  name: string;
  lessons: Lesson[];
}

interface Props {
  units: Unit[];
  grade: string;
  gradeTitle: string;
  totalLessons: number;
  backLink?: string;
  backLabel?: string;
}

function formatUnitTitle(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/^Unit (\d+) /, "");
}

function formatLessonTitle(name: string): string {
  return name
    .replace(/^\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function GradeUnitPanel(
  {
    units,
    grade: _grade,
    gradeTitle,
    totalLessons,
    backLink = "/curriculum/math/by_grade",
    backLabel = "Back to Grades",
  }: Props,
) {
  // -1 = show all units; 0..n = show only that unit
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <div class="topic-layout">
      {/* ── Sidebar ── */}
      <aside class="topic-sidebar">
        <div class="topic-sidebar-sticky">
          {/* Grade title — click to show all units */}
          <div
            class={`topic-header-card grade-title-btn${
              selectedIndex === -1 ? " is-active" : ""
            }`}
            onClick={() => setSelectedIndex(-1)}
            style="cursor:pointer"
          >
            <h1 class="topic-header-title">{gradeTitle}</h1>
            <p class="topic-header-subtitle">
              {units.length} units · {totalLessons} lessons
            </p>
          </div>

          {/* Unit list — click to show only that unit */}
          <nav class="topic-nav">
            {units.map((u, i) => {
              const count = u.lessons.filter(
                (l) => !l.name.includes("quiz") && !l.name.includes("test"),
              ).length;
              return (
                <button
                  type="button"
                  class={`topic-nav-item grade-unit-btn${
                    i === selectedIndex ? " is-active" : ""
                  }`}
                  onClick={() => setSelectedIndex(i)}
                >
                  <span class="topic-nav-label">UNIT {i + 1}</span>
                  <span class="topic-nav-title">{formatUnitTitle(u.name)}</span>
                  <span class="topic-nav-count">{count} lessons</span>
                </button>
              );
            })}
          </nav>

          <a href={backLink} class="back-link">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {backLabel}
          </a>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <section class="topic-main">
        {/* Overview bar */}
        <div class="grade-overview-bar">
          <div class="grade-overview-mastery">
            <div class="grade-mastery-ring">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path
                  class="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="circle"
                  stroke-dasharray="0, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div class="percentage">0%</div>
            </div>
            <div class="grade-overview-text">
              <span class="grade-overview-label">Course mastery</span>
              <span class="grade-overview-points">
                0 / {units.length * 1000} Mastery points
              </span>
            </div>
          </div>
          <a href="/practice" class="grade-overview-challenge-btn">
            Start Course challenge
          </a>
        </div>

        {selectedIndex === -1
          ? (
            /* ── ALL units view ── */
            <div>
              {units.map((u, i) => {
                const lessons = u.lessons.filter(
                  (l) => !l.name.includes("quiz") && !l.name.includes("test"),
                );
                const quizzes = u.lessons.filter(
                  (l) => l.name.includes("quiz") || l.name.includes("test"),
                );
                return (
                  <div class="unit-section">
                    <div class="unit-panel-header">
                      <div class="unit-panel-number">Unit {i + 1}</div>
                      <h2
                        class="unit-panel-title unit-panel-title--link"
                        onClick={() => setSelectedIndex(i)}
                      >
                        {formatUnitTitle(u.name)}
                      </h2>
                      <span class="unit-card-lesson-count">
                        {lessons.length} lessons
                      </span>
                    </div>
                    <div class="unit-content-wrapper">
                      <div class="unit-lessons-col">
                        {lessons.map((lesson) => (
                          <a href={lesson.path} class="unit-item">
                            <span class="unit-item-text">
                              {formatLessonTitle(lesson.name)}
                            </span>
                          </a>
                        ))}
                      </div>
                      {quizzes.length > 0 && (
                        <div class="unit-quizzes-col">
                          <div class="unit-quizzes-label">Quiz &amp; Test</div>
                          {quizzes.map((lesson) => (
                            <a
                              href={lesson.path}
                              class="unit-item unit-item--quiz"
                            >
                              <span class="unit-item-text">
                                {formatLessonTitle(lesson.name)}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
          : (() => {
            /* ── Single unit view ── */
            const unit = units[selectedIndex];
            const lessons = unit.lessons.filter(
              (l) => !l.name.includes("quiz") && !l.name.includes("test"),
            );
            const quizzes = unit.lessons.filter(
              (l) => l.name.includes("quiz") || l.name.includes("test"),
            );
            return (
              <div>
                <div class="unit-panel-header">
                  <div class="unit-panel-number">Unit {selectedIndex + 1}</div>
                  <h2 class="unit-panel-title">
                    {formatUnitTitle(unit.name)}
                  </h2>
                  <div class="unit-panel-meta">
                    <div class="unit-card-progress">
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: 0%;" />
                      </div>
                      <span class="progress-text">0%</span>
                    </div>
                    <span class="unit-card-lesson-count">
                      {lessons.length} lessons
                    </span>
                  </div>
                  {lessons.length > 0 && (
                    <a href={lessons[0].path} class="btn-continue">
                      Start Unit
                    </a>
                  )}
                </div>

                <div class="unit-content-wrapper">
                  <div class="unit-lessons-col">
                    {lessons.map((lesson) => (
                      <a href={lesson.path} class="unit-item">
                        <span class="unit-item-text">
                          {formatLessonTitle(lesson.name)}
                        </span>
                      </a>
                    ))}
                  </div>
                  {quizzes.length > 0 && (
                    <div class="unit-quizzes-col">
                      <div class="unit-quizzes-label">Quiz &amp; Test</div>
                      {quizzes.map((lesson) => (
                        <a href={lesson.path} class="unit-item unit-item--quiz">
                          <span class="unit-item-text">
                            {formatLessonTitle(lesson.name)}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div class="unit-panel-nav">
                  {selectedIndex > 0
                    ? (
                      <button
                        type="button"
                        class="unit-panel-nav-btn"
                        onClick={() => setSelectedIndex(selectedIndex - 1)}
                      >
                        ← Unit {selectedIndex}: {formatUnitTitle(
                          units[selectedIndex - 1].name,
                        )}
                      </button>
                    )
                    : <span />}
                  {selectedIndex < units.length - 1 && (
                    <button
                      type="button"
                      class="unit-panel-nav-btn unit-panel-nav-btn--next"
                      onClick={() => setSelectedIndex(selectedIndex + 1)}
                    >
                      Unit {selectedIndex + 2}: {formatUnitTitle(
                        units[selectedIndex + 1].name,
                      )} →
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
      </section>
    </div>
  );
}
