/// <reference lib="deno.unstable" />

// ============================================================================
// Sovereign Academy Server Database Layer (Deno KV)
// ============================================================================
// This file runs strictly on the server (Deno backend).
// It encapsulates all Deno KV logic for cloud sync.

const kv = await Deno.openKv();

export interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  score: number;
  last_accessed: string;
}

/**
 * Saves a single lesson's progress to the cloud for a specific student.
 */
export async function saveStudentProgress(
  studentId: string,
  progress: LessonProgress,
) {
  const key = ["student", studentId, "progress", progress.lesson_id];
  await kv.set(key, progress);
  console.log(
    `[Cloud] Saved progress for student ${studentId}, lesson ${progress.lesson_id}`,
  );
}

/**
 * Retrieves all saved progress for a specific student from the cloud.
 */
export async function getStudentProgress(
  studentId: string,
): Promise<LessonProgress[]> {
  const prefix = ["student", studentId, "progress"];
  const entries = kv.list<LessonProgress>({ prefix });
  const results: LessonProgress[] = [];

  for await (const entry of entries) {
    results.push(entry.value);
  }

  console.log(
    `[Cloud] Retrieved ${results.length} records for student ${studentId}`,
  );
  return results;
}
