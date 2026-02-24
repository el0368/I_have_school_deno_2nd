// ============================================================================
// Lesson Navigation Utilities
// ============================================================================
// Pure, side-effect-free functions for computing prev/next lesson neighbors.
// Extracted from main.ts so they can be unit-tested without spinning up
// a Deno server.
// ============================================================================

/**
 * Weight-based sort key for lesson filenames.
 * Mirrors the sort used in routes/curriculum/math/[grade].tsx.
 *
 * Order:
 *   introduction → -1   (always first)
 *   1_foo        →  1   (numeric prefix, ascending)
 *   quiz / test  → 1000 (always last)
 *   anything else→  999
 */
function lessonSortKey(fullPath: string): number {
  const name = fullPath.substring(fullPath.lastIndexOf("/") + 1);
  if (name.includes("introduction")) return -1;
  if (name.includes("quiz") || name.includes("test")) return 1000;
  const match = name.match(/^(\d+)/);
  return match ? parseInt(match[1]) : 999;
}

/**
 * Given the current lesson path and the full registry of lesson paths,
 * returns the previous and next lesson URLs within the same parent folder.
 *
 * Siblings are sorted with keyword-aware weights so `introduction` always
 * comes first, numbered topics follow in numeric order, and `quiz`/`test`
 * files always come last. Ties are broken with localeCompare.
 *
 * @example
 *   computeLessonNeighbors(
 *     "/learn/math/grade_1/unit_1/2_place_value",
 *     ["/learn/math/grade_1/unit_1/introduction",
 *      "/learn/math/grade_1/unit_1/1_intro",
 *      "/learn/math/grade_1/unit_1/2_place_value",
 *      "/learn/math/grade_1/unit_1/3_tens_and_ones",
 *      "/learn/math/grade_1/unit_1/quiz_unit"]
 *   )
 *   // → { prevLesson: "/.../1_intro", nextLesson: "/.../3_tens_and_ones" }
 */
export function computeLessonNeighbors(
  currentPath: string,
  allPaths: string[],
): { prevLesson?: string; nextLesson?: string } {
  // Derive the parent directory of the current path
  const parentDir = currentPath.substring(0, currentPath.lastIndexOf("/"));

  // Collect siblings: /learn/ paths sharing the same parent folder
  const siblings = allPaths
    .filter((p) => {
      if (!p.startsWith("/learn/")) return false;
      const pParent = p.substring(0, p.lastIndexOf("/"));
      return pParent === parentDir;
    })
    .sort((a, b) => {
      const wA = lessonSortKey(a);
      const wB = lessonSortKey(b);
      if (wA !== wB) return wA - wB;
      return a.localeCompare(b);
    });

  const idx = siblings.indexOf(currentPath);

  // Path not found in registry — no neighbors
  if (idx === -1) return {};

  return {
    prevLesson: idx > 0 ? siblings[idx - 1] : undefined,
    nextLesson: idx < siblings.length - 1 ? siblings[idx + 1] : undefined,
  };
}

/**
 * Derives the "Back to Grade Overview" URL from a lesson path.
 *
 * @example
 *   gradeOverviewLink("/learn/math/grade_1/unit_1_place_value/1_numbers")
 *   // → "/curriculum/math/grade_1"
 *
 *   gradeOverviewLink("/learn/math/grade_2/unit_3/quiz")
 *   // → "/curriculum/math/grade_2"
 *
 *   gradeOverviewLink("/learn/something_unexpected")
 *   // → "/curriculum/math"  (fallback)
 */
export function gradeOverviewLink(lessonPath: string): string {
  const match = lessonPath.match(/^\/learn\/math\/(grade_\d+)/);
  return match ? `/curriculum/math/${match[1]}` : "/curriculum/math";
}
