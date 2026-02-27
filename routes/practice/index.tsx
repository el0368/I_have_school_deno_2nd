import { Head } from "fresh/runtime";
import TopicChainMap from "../../islands/TopicChainMap.tsx";

export default function PracticeDashboard() {
  return (
    <>
      <Head>
        <title>Practice | Sovereign Academy</title>
      </Head>

      {/* Hero */}
      <div class="subject-hero">
        <div
          class="page-container"
          style="padding-top: 1.5rem; padding-bottom: 1.5rem;"
        >
          <h1
            class="hero-large-title"
            style="font-size: 2rem; margin-bottom: 0.25rem;"
          >
            ⚡ Challenge-First Practice
          </h1>
          <p
            class="hero-large-subtitle"
            style="font-size: 1rem; margin-bottom: 0;"
          >
            Master each topic in order — attempt the exercise first, unlock the
            lesson only if you need it.
          </p>
        </div>
      </div>

      {/* Chain Map */}
      <div class="page-container" style="padding-top: 2rem;">
        <TopicChainMap />
      </div>
    </>
  );
}
