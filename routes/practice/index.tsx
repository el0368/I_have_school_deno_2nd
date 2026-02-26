import { Head } from "fresh/runtime";

export default function PracticeDashboard() {
  const modules = [
    {
      title: "Daily Challenge",
      emoji: "⚡",
      desc: "A mix of problems tailored to your current level.",
      link: "#",
      active: false,
    },
    {
      title: "Math Drills",
      emoji: "🎯",
      desc: "Focus on speed and accuracy for basic operations.",
      link: "#",
      active: false,
    },
    {
      title: "Algorithm Puzzles",
      emoji: "🧩",
      desc: "Coming soon",
      link: "#",
      active: false,
    },
  ];

  return (
    <>
      <Head>
        <title>Practice | Sovereign Academy</title>
      </Head>

      <div class="subject-hero">
        <div class="page-container" style="padding-top: 0; padding-bottom: 0;">
          <h1 class="hero-large-title">Practice Arena</h1>
          <p class="hero-large-subtitle">
            Sharpen your skills with targeted exercises and dynamic challenges.
          </p>
        </div>
      </div>

      <div class="page-container">
        <div class="grid-container" style="margin-top: -1.5rem;">
          {modules.map((mod) => (
            <a
              href={mod.active ? mod.link : undefined}
              class={`dashboard-card ${mod.active ? "is-active" : "is-dummy"}`}
            >
              <div class="group-card-body">
                <div class="group-card-icon">{mod.emoji}</div>
                <div class="group-card-text">
                  <h3 class="dashboard-card-title">{mod.title}</h3>
                  <p class="dashboard-card-desc">{mod.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
