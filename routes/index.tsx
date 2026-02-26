import { Head } from "fresh/runtime";
import { define } from "../utils.ts";

export default define.page(function Home() {
  return (
    <>
      <Head>
        <title>Sovereign Academy | Math Curriculum</title>
      </Head>
      <div class="hero-wrapper">
        <h1 class="hero-large-title">
          Master Mathematics.<br />
          <span style="color: var(--color-primary-light);">
            Own Your Education.
          </span>
        </h1>
        <p class="hero-large-subtitle">
          A truly offline-first, comprehensive K-to-PhD math curriculum designed
          for deep intuition and independent learning.
        </p>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <a
            href="/curriculum/math"
            class="btn-primary"
            style="font-size: 1.125rem; padding: 0.75rem 2rem; border-radius: 9999px; text-decoration: none;"
          >
            Explore Math Curriculum
          </a>
          <a
            href="/practice"
            class="btn-primary"
            style="font-size: 1.125rem; padding: 0.75rem 2rem; border-radius: 9999px; text-decoration: none; background: transparent; border: 2px solid var(--color-primary-light); color: var(--color-primary-light);"
          >
            Practice Arena
          </a>
        </div>
      </div>

      <div
        class="page-container"
        style="text-align: center; padding-top: 4rem; padding-bottom: 4rem;"
      >
        <h2 style="font-size: 1.5rem; color: var(--color-text-muted); font-weight: 500;">
          Built with WebAssembly and Modern Web Tech
        </h2>
      </div>
    </>
  );
});
