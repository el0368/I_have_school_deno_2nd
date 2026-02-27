import { Head } from "fresh/runtime";

export default function MathCurriculum() {
  return (
    <>
      <Head>
        <title>Math | Sovereign Academy</title>
      </Head>

      <div class="subject-hero">
        <div class="page-container" style="padding-top: 0; padding-bottom: 0;">
          <h1 class="hero-large-title">Math</h1>
          <p class="hero-large-subtitle">
            Choose how you want to learn
          </p>
        </div>
      </div>

      <main
        class="page-container"
        style="padding-bottom: var(--spacing-10);"
      >
        <div class="grid-container" style="margin-top: -1.5rem;">
          <a
            href="/curriculum/math/by_grade"
            class="dashboard-card"
            style="text-align: center; padding: 3rem 2rem;"
          >
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎒</div>
            <h2 class="dashboard-card-title" style="font-size: 1.5rem;">
              By Grade
            </h2>
            <p class="dashboard-card-desc" style="font-size: 1rem;">
              Follow a structured path from Kindergarten to High School.
            </p>
          </a>

          <a
            href="/curriculum/math/by_topics"
            class="dashboard-card"
            style="text-align: center; padding: 3rem 2rem;"
          >
            <div style="font-size: 4rem; margin-bottom: 1rem;">🧩</div>
            <h2 class="dashboard-card-title" style="font-size: 1.5rem;">
              By Topics
            </h2>
            <p class="dashboard-card-desc" style="font-size: 1rem;">
              Dive deep into specific mathematical concepts and fields.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
