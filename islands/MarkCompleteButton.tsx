import { useEffect, useState } from "preact/hooks";
import { getLessonStatus, markLessonComplete } from "../utils/db.ts";

interface Props {
  lessonId: string;
}

export default function MarkCompleteButton({ lessonId }: Props) {
  const [status, setStatus] = useState<
    "loading" | "incomplete" | "complete" | "syncing"
  >("loading");

  useEffect(() => {
    // On load, check the local database to see if we already finished this lesson
    getLessonStatus(lessonId).then((existingRecord) => {
      if (existingRecord?.completed) {
        setStatus("complete");
      } else {
        setStatus("incomplete");
      }
    });
  }, [lessonId]);

  const handleComplete = async () => {
    setStatus("syncing");

    // Gives 100% score by default for simply reading a lesson
    await markLessonComplete(lessonId, 100);

    setStatus("complete");
  };

  if (status === "loading") {
    return (
      <button
        type="button"
        class="btn-primary opacity-50 cursor-not-allowed"
        disabled
      >
        Checking Status...
      </button>
    );
  }

  if (status === "complete") {
    return (
      <button
        type="button"
        class="btn-primary bg-green-600 hover:bg-green-700"
        disabled
      >
        ✓ Lesson Completed
      </button>
    );
  }

  return (
    <button
      type="button"
      class="btn-primary"
      onClick={handleComplete}
      disabled={status === "syncing"}
    >
      {status === "syncing" ? "Saving..." : "Mark Complete"}
    </button>
  );
}
