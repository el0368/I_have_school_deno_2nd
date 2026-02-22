import { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  path: string;
}

export function CurriculumLayout({ children, path }: Props) {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  const title = filename
    ? filename.replace(/_/g, " ").replace(
      /\b\w/g,
      (char: string) => char.toUpperCase(),
    )
    : "Lesson";
  const breadcrumb = parts.map((p: string) =>
    p.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
  ).filter(Boolean).join(" > ");

  return (
    <>
      <title>{title}</title>

      <div class="app-container">
        {/* Sidebar Navigation */}
        <nav class="sidebar">
          <h2 class="sidebar-title">
            SOVEREIGN ACADEMY
          </h2>

          <div class="sidebar-navigation-items">
            <div class="sidebar-label">
              Location
            </div>
            <div class="sidebar-content">
              {breadcrumb}
            </div>
          </div>

          <div class="sidebar-footer">
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

            {/* Footer */}
            <div class="card-footer">
              <div class="path-pill">
                {path}
              </div>
              <button class="btn-primary">
                Mark Complete
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
