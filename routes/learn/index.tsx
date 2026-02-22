import { Head } from "fresh/runtime";

export default function LearnDashboard() {
  const subjects = [
    {
      title: "Mathematics",
      desc: "Explore the complete K-12 math curriculum.",
      link: "/curriculum/math",
      active: true,
    },
    {
      title: "Computer Science",
      desc: "Coming soon",
      link: "#",
      active: false,
    },
    { title: "Physics", desc: "Coming soon", link: "#", active: false },
    { title: "History", desc: "Coming soon", link: "#", active: false },
  ];

  return (
    <>
      <Head>
        <title>Learn | Sovereign Academy</title>
      </Head>
      <div class="page-container">
        <header class="page-header">
          <h1 class="page-title">Learning Dashboard</h1>
          <p class="page-subtitle">
            Select a subject to view the curriculum and begin your journey.
          </p>
        </header>

        <div class="grid-container">
          {subjects.map((subject) => (
            <a
              href={subject.active ? subject.link : undefined}
              class={`dashboard-card ${
                subject.active ? "is-active" : "is-dummy"
              }`}
            >
              <h3 class="dashboard-card-title">{subject.title}</h3>
              <p class="dashboard-card-desc">{subject.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
