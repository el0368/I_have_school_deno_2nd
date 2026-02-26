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
 * Derives the "Back to Topic Overview" URL from a lesson path.
 *
 * @example
 *   topicOverviewLink("/learn/math/by_topics/1_the_core/01_number_sense_and_operations/unit_01/lesson_1")
 *   // → "/curriculum/math/by_topics/1_the_core/01_number_sense_and_operations"
 *
 *   topicOverviewLink("/learn/something_unexpected")
 *   // → "/curriculum/math"  (fallback)
 */
export function topicOverviewLink(lessonPath: string): string {
  // Check for by_topics path
  const topicMatch = lessonPath.match(
    /^\/learn\/math\/by_topics\/([^\/]+)\/([^\/]+)/,
  );
  if (topicMatch) {
    return `/curriculum/math/by_topics/${topicMatch[1]}/${topicMatch[2]}`;
  }

  // Check for by_grade path
  const gradeMatch = lessonPath.match(
    /^\/learn\/math\/by_grade\/([^\/]+)/,
  );
  if (gradeMatch) {
    return `/curriculum/math/by_grade/${gradeMatch[1]}`;
  }

  return "/curriculum/math";
}

/**
 * Converts a unit folder name (slug) into a human-readable display title.
 * Strips the `unit_NN_` prefix and title-cases the remainder.
 *
 * @example
 *   formatUnitTitle("unit_01_counting_and_place_value") → "Counting and Place Value"
 *   formatUnitTitle("unit_02_addition_and_subtraction") → "Addition and Subtraction"
 */
export function formatUnitTitle(slug: string): string {
  // Strip "unit_01_" style prefix
  const s = slug.replace(/^unit_\d+_/, "");
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Converts a lesson filename (slug) into a human-readable display title.
 *
 * Rules applied in order:
 *  1. If the slug starts with `unit_test_` or ends with `_unit_test`, prefix with "Unit Test: "
 *  2. If the slug starts with `quiz_`, prefix with "Quiz: "
 *  3. Strip leading sequence number: `01_`, `12_`, etc.
 *  4. Replace underscores with spaces and title-case every word.
 *
 * @example
 *   formatLessonTitle("01_count_with_small_numbers")   → "Count with Small Numbers"
 *   formatLessonTitle("02_adding_within_20")           → "Adding within 20"
 *   formatLessonTitle("quiz_01_addition_basics")       → "Quiz: Addition Basics"
 *   formatLessonTitle("unit_test_addition_and_subtraction") → "Unit Test: Addition and Subtraction"
 */
export function formatLessonTitle(slug: string): string {
  let s = slug;

  // 1. Detect and strip quiz / unit_test markers
  let prefix = "";
  if (/^unit_test_/.test(s)) {
    prefix = "Unit Test: ";
    s = s.replace(/^unit_test_/, "");
  } else if (/_unit_test$/.test(s)) {
    prefix = "Unit Test: ";
    s = s.replace(/_unit_test$/, "");
  } else if (/^unit_quiz_/.test(s)) {
    prefix = "Quiz: ";
    s = s.replace(/^unit_quiz_/, "");
  } else if (/^quiz_\d+_/.test(s)) {
    prefix = "Quiz: ";
    s = s.replace(/^quiz_\d+_/, "");
  } else if (/^quiz_/.test(s)) {
    prefix = "Quiz: ";
    s = s.replace(/^quiz_/, "");
  }

  // 2. Strip leading sequence number, e.g. "01_", "12_"
  s = s.replace(/^\d+_/, "");

  // 3. Replace underscores with spaces, then title-case each word
  const titled = s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return prefix + titled;
}

/**
 * @deprecated Use topicOverviewLink for by_topics paths.
 * Kept for backwards-compatibility with tests.
 *
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
