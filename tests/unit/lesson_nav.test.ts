import { assertEquals, assertExists } from "jsr:@std/assert@1";
import {
  computeLessonNeighbors,
  gradeOverviewLink,
} from "../../utils/lesson_nav.ts";

// ─────────────────────────────────────────────────────────────────────────────
// computeLessonNeighbors
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY = [
  // Grade 1 Unit 1
  "/learn/math/grade_1/unit_1_place_value/introduction",
  "/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9",
  "/learn/math/grade_1/unit_1_place_value/2_numbers_from_1_to_100",
  "/learn/math/grade_1/unit_1_place_value/3_understanding_place_value",
  "/learn/math/grade_1/unit_1_place_value/4_tens_and_ones",
  "/learn/math/grade_1/unit_1_place_value/quiz_place_value",
  // Grade 1 Unit 2 (different parent — should NOT bleed into Unit 1 neighbors)
  "/learn/math/grade_1/unit_2_addition/introduction",
  "/learn/math/grade_1/unit_2_addition/1_counting_on",
  // Non-/learn paths — should be ignored
  "/hello",
  "/curriculum/math/grade_1",
];

Deno.test("computeLessonNeighbors — middle lesson returns both neighbors", () => {
  const { prevLesson, nextLesson } = computeLessonNeighbors(
    "/learn/math/grade_1/unit_1_place_value/2_numbers_from_1_to_100",
    REGISTRY,
  );
  assertEquals(
    prevLesson,
    "/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9",
  );
  assertEquals(
    nextLesson,
    "/learn/math/grade_1/unit_1_place_value/3_understanding_place_value",
  );
});

Deno.test("computeLessonNeighbors — first lesson has no prev", () => {
  const { prevLesson, nextLesson } = computeLessonNeighbors(
    "/learn/math/grade_1/unit_1_place_value/introduction",
    REGISTRY,
  );
  assertEquals(prevLesson, undefined);
  assertEquals(
    nextLesson,
    "/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9",
  );
});

Deno.test("computeLessonNeighbors — last lesson has no next", () => {
  const { prevLesson, nextLesson } = computeLessonNeighbors(
    "/learn/math/grade_1/unit_1_place_value/quiz_place_value",
    REGISTRY,
  );
  assertEquals(
    prevLesson,
    "/learn/math/grade_1/unit_1_place_value/4_tens_and_ones",
  );
  assertEquals(nextLesson, undefined);
});

Deno.test("computeLessonNeighbors — neighbors do NOT cross unit boundaries", () => {
  // Last lesson in Unit 1 should NOT have Unit 2 as its next
  const { nextLesson } = computeLessonNeighbors(
    "/learn/math/grade_1/unit_1_place_value/quiz_place_value",
    REGISTRY,
  );
  // Unit 2 intro is a different parent dir — must not appear here
  assertEquals(nextLesson, undefined);
});

Deno.test("computeLessonNeighbors — unknown path returns empty object", () => {
  const result = computeLessonNeighbors(
    "/learn/math/grade_1/unit_99/nonexistent",
    REGISTRY,
  );
  assertEquals(result.prevLesson, undefined);
  assertEquals(result.nextLesson, undefined);
});

Deno.test("computeLessonNeighbors — single lesson in unit has no neighbors", () => {
  const only = ["/learn/math/grade_2/unit_1/1_intro"];
  const { prevLesson, nextLesson } = computeLessonNeighbors(
    "/learn/math/grade_2/unit_1/1_intro",
    only,
  );
  assertEquals(prevLesson, undefined);
  assertEquals(nextLesson, undefined);
});

Deno.test("computeLessonNeighbors — non-/learn paths are ignored", () => {
  // Adding a curriculum path with the same parent segment must not affect output
  const mixed = [
    "/curriculum/math/grade_1/unit_1/intro", // NOT /learn/, must be ignored
    "/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9",
    "/learn/math/grade_1/unit_1_place_value/2_numbers_from_1_to_100",
  ];
  const { prevLesson } = computeLessonNeighbors(
    "/learn/math/grade_1/unit_1_place_value/2_numbers_from_1_to_100",
    mixed,
  );
  assertEquals(
    prevLesson,
    "/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9",
  );
});

Deno.test("computeLessonNeighbors — siblings are sorted lexicographically", () => {
  // If the registry is shuffled, the sort must still produce correct order
  const shuffled = [
    "/learn/math/grade_1/unit_1/4_tens_and_ones",
    "/learn/math/grade_1/unit_1/1_intro",
    "/learn/math/grade_1/unit_1/3_place_value",
    "/learn/math/grade_1/unit_1/2_numbers",
  ];
  const { prevLesson, nextLesson } = computeLessonNeighbors(
    "/learn/math/grade_1/unit_1/2_numbers",
    shuffled,
  );
  assertEquals(prevLesson, "/learn/math/grade_1/unit_1/1_intro");
  assertEquals(nextLesson, "/learn/math/grade_1/unit_1/3_place_value");
});

// ─────────────────────────────────────────────────────────────────────────────
// gradeOverviewLink
// ─────────────────────────────────────────────────────────────────────────────

Deno.test("gradeOverviewLink — extracts grade from deep lesson path", () => {
  assertEquals(
    gradeOverviewLink(
      "/learn/math/grade_1/unit_1_place_value/1_numbers_from_1_to_9",
    ),
    "/curriculum/math/grade_1",
  );
});

Deno.test("gradeOverviewLink — works for grade_2", () => {
  assertEquals(
    gradeOverviewLink("/learn/math/grade_2/unit_3/quiz"),
    "/curriculum/math/grade_2",
  );
});

Deno.test("gradeOverviewLink — works for double-digit grades", () => {
  assertEquals(
    gradeOverviewLink("/learn/math/grade_10/unit_1/lesson"),
    "/curriculum/math/grade_10",
  );
});

Deno.test("gradeOverviewLink — returns fallback for non-grade paths", () => {
  assertEquals(
    gradeOverviewLink("/learn/something_else"),
    "/curriculum/math",
  );
});

Deno.test("gradeOverviewLink — returns fallback for root /learn path", () => {
  assertEquals(gradeOverviewLink("/learn"), "/curriculum/math");
});

Deno.test("gradeOverviewLink — result is always a valid absolute path", () => {
  const result = gradeOverviewLink("/learn/math/grade_1/unit_1/lesson");
  assertExists(result);
  assertEquals(result.startsWith("/"), true);
});
