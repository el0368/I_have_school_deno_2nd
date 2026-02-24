// Root-level smoke tests — quick sanity checks that don't require a server.
// Full unit tests live in tests/unit/.
import { assertEquals } from "jsr:@std/assert@1";
import {
  computeLessonNeighbors,
  gradeOverviewLink,
} from "./utils/lesson_nav.ts";

Deno.test("lesson nav — smoke: neighbors resolve for a 3-lesson unit", () => {
  const paths = [
    "/learn/math/grade_1/unit_1/1_intro",
    "/learn/math/grade_1/unit_1/2_middle",
    "/learn/math/grade_1/unit_1/3_last",
  ];
  const { prevLesson, nextLesson } = computeLessonNeighbors(paths[1], paths);
  assertEquals(prevLesson, paths[0]);
  assertEquals(nextLesson, paths[2]);
});

Deno.test("lesson nav — smoke: gradeOverviewLink produces /curriculum/math/grade_X", () => {
  const link = gradeOverviewLink("/learn/math/grade_1/unit_1/lesson");
  assertEquals(link, "/curriculum/math/grade_1");
});
