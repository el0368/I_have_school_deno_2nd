// MDX Routes Registry (Auto-Discovery Version)
// This file automatically finds all .mdx files in the routes/ directory
// and converts them into Fresh routes. You do NOT need to manually add files here.

import type { ComponentType } from "preact";

/**
 * 1. AUTO-DISCOVERY (Vite Global Import)
 * import.meta.glob is a special feature of Vite.
 * It scans the folder and finds EVERY file that ends in .mdx.
 * This is what makes the system "Bulletproof" and automatic!
 */
const mdxFiles = import.meta.glob("./routes/**/*.mdx");
const curriculumFiles = import.meta.glob("./curriculums/**/*.mdx");

const mdxRoutes: Record<string, () => Promise<{ default: ComponentType }>> = {};

// 2. THE ROUTE BUILDER for /routes/
for (const path in mdxFiles) {
  let routePath = path.replace(/^\.\/routes/, "").replace(/\.mdx$/, "");

  if (routePath.endsWith("/index")) {
    routePath = routePath.replace(/\/index$/, "");
    if (routePath === "") routePath = "/"; // The root /index.mdx becomes just "/"
  }

  // Add the discovered route and its "Loader" to our dictionary
  mdxRoutes[routePath] = mdxFiles[path] as () => Promise<
    { default: ComponentType }
  >;
}

// 3. THE ROUTE BUILDER for /curriculums/ (Mapped to /learn/...)
for (const path in curriculumFiles) {
  let routePath = path.replace(/^\.\/curriculums/, "/learn").replace(
    /\.mdx$/,
    "",
  );

  if (routePath.endsWith("/index")) {
    routePath = routePath.replace(/\/index$/, "");
    if (routePath === "/learn") routePath = "/learn";
  }

  // Add the discovered route and its "Loader" to our dictionary
  mdxRoutes[routePath] = curriculumFiles[path] as () => Promise<
    { default: ComponentType }
  >;
}

export default mdxRoutes;
