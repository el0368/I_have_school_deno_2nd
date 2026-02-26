import { Head } from "fresh/runtime";

export default function LearnDashboard() {
  const subjects = [
    {
      title: "Mathematics",
      emoji: "🔢",
      desc: "22 topics — from counting to topology.",
      link: "/curriculum/math",
      active: true,
    },
  ];

  return (
    <>
      <Head>
        <title>Learn | Sovereign Academy</title>
      </Head>

      <div class="subject-hero">
        <div class="page-container" style="padding-top: 0; padding-bottom: 0;">
          <h1 class="hero-large-title">Learn</h1>
          <p class="hero-large-subtitle">
            Select a subject to view the curriculum and begin your journey.
          </p>
        </div>
      </div>

      <div class="page-container">
        <div class="grid-container" style="margin-top: -1.5rem;">
          {subjects.map((subject) => (
            <a
              href={subject.active ? subject.link : undefined}
              class={`dashboard-card ${
                subject.active ? "is-active" : "is-dummy"
              }`}
            >
              <div class="group-card-body">
                <div class="group-card-icon">{subject.emoji}</div>
                <div class="group-card-text">
                  <h3 class="dashboard-card-title">{subject.title}</h3>
                  <p class="dashboard-card-desc">{subject.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
