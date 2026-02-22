import { Head } from "fresh/runtime";

export default function PracticeDashboard() {
  const modules = [
    {
      title: "Daily Challenge",
      desc: "A mix of problems tailored to your current level.",
      link: "#",
      active: false,
    },
    {
      title: "Math Drills",
      desc: "Focus on speed and accuracy for basic operations.",
      link: "#",
      active: false,
    },
    {
      title: "Algorithm Puzzles",
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
      <div class="page-container">
        <header class="page-header">
          <h1 class="page-title">Practice Arena</h1>
          <p class="page-subtitle">
            Sharpen your skills with targeted exercises and dynamic challenges.
          </p>
        </header>

        <div class="grid-container">
          {modules.map((mod) => (
            <a
              href={mod.active ? mod.link : undefined}
              class={`dashboard-card ${mod.active ? "is-active" : "is-dummy"}`}
            >
              <h3 class="dashboard-card-title">{mod.title}</h3>
              <p class="dashboard-card-desc">{mod.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
