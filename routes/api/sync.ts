import { FreshContext } from "fresh";
import {
  getStudentProgress,
  LessonProgress,
  saveStudentProgress,
} from "../../utils/serverDb.ts";

export const handler = {
  // Receives progress updates from the client's PGlite database
  async POST(req: Request, _ctx: FreshContext) {
    try {
      const data = await req.json();
      const { studentId, progress } = data;

      if (!studentId || !progress || !progress.lesson_id) {
        return new Response(
          JSON.stringify({ error: "Missing studentId or progress data" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      await saveStudentProgress(studentId, progress as LessonProgress);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[SYNC POST ERROR]", e);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },

  // Returns all saved progress for a student to restore their local PGlite database
  async GET(req: Request, _ctx: FreshContext) {
    const url = new URL(req.url);
    const studentId = url.searchParams.get("studentId");

    if (!studentId) {
      return new Response(
        JSON.stringify({ error: "Missing studentId parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    try {
      const history = await getStudentProgress(studentId);

      return new Response(JSON.stringify(history), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[SYNC GET ERROR]", e);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
