import { Head } from "fresh/runtime";

export default function MathCurriculum() {
  const primaryGrades = [
    { title: "Kindergarten", desc: "Coming soon", active: false },
    {
      title: "Grade 1",
      desc: "Addition, subtraction, and place value basics.",
      active: true,
      link: "/curriculum/math/grade_1",
    },
    {
      title: "Grade 2",
      desc:
        "Addition and subtraction within 1000, foundations of multiplication.",
      active: true,
      link: "/curriculum/math/grade_2",
    },
    { title: "Grade 3", desc: "Coming soon", active: false },
    { title: "Grade 4", desc: "Coming soon", active: false },
    { title: "Grade 5", desc: "Coming soon", active: false },
  ];

  const secondaryGrades = [
    { title: "Grade 6", desc: "Coming soon", active: false },
    { title: "Grade 7", desc: "Coming soon", active: false },
    { title: "Grade 8", desc: "Coming soon", active: false },
  ];

  const highSchoolGrades = [
    { title: "Algebra 1", desc: "Coming soon", active: false },
    { title: "Geometry", desc: "Coming soon", active: false },
    { title: "Algebra 2", desc: "Coming soon", active: false },
    { title: "Precalculus", desc: "Coming soon", active: false },
  ];

  const renderGrid = (
    grades: { title: string; desc: string; active: boolean; link?: string }[],
  ) => (
    <div class="grid-container">
      {grades.map((grade) => (
        <a
          href={grade.active ? grade.link : undefined}
          class={`dashboard-card ${grade.active ? "is-active" : "is-dummy"}`}
        >
          <h3 class="dashboard-card-title">{grade.title}</h3>
          <p class="dashboard-card-desc">{grade.desc}</p>
        </a>
      ))}
    </div>
  );

  return (
    <>
      <Head>
        <title>Math Curriculum | Sovereign Academy</title>
      </Head>
      <div class="page-container">
        <header class="page-header">
          <h1 class="page-title">Math Curriculum</h1>
          <p class="page-subtitle">
            Master mathematics from foundational counting to advanced calculus,
            designed to build deep intuition and problem-solving skills.
          </p>
        </header>

        <section class="category-section">
          <h2 class="section-title">Primary School</h2>
          {renderGrid(primaryGrades)}
        </section>

        <section class="category-section">
          <h2 class="section-title">Secondary School</h2>
          {renderGrid(secondaryGrades)}
        </section>

        <section class="category-section">
          <h2 class="section-title">High School</h2>
          {renderGrid(highSchoolGrades)}
        </section>
      </div>
    </>
  );
}
