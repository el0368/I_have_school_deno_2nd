import { PGlite } from "@electric-sql/pglite";

// ============================================================================
// Sovereign Academy Database Layer (PGlite)
// ============================================================================
// This file runs strictly on the client (Islands only).
// It encapsulates all PGlite WASM database logic.

let dbInstance: PGlite | null = null;

/**
 * Initializes the PGlite database and creates the necessary tables
 * if they do not already exist. Uses IndexedDB for persistant storage.
 */
export async function getDb(): Promise<PGlite> {
  if (!dbInstance) {
    dbInstance = new PGlite("idb://sovereign-progress");

    // Create the schema on first boot
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS student_progress (
        lesson_id TEXT PRIMARY KEY,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        score INTEGER NOT NULL DEFAULT 0,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("[DB] PGlite Initialized");
  }
  return dbInstance;
}

/**
 * Marks a specific lesson as completed in the local database.
 * Also attempts to background-sync this progress to the Cloud.
 */
export async function markLessonComplete(
  lessonId: string,
  score: number = 100,
) {
  const db = await getDb();
  await db.query(
    `
    INSERT INTO student_progress (lesson_id, completed, score) 
    VALUES ($1, true, $2)
    ON CONFLICT (lesson_id) DO UPDATE 
    SET completed = true, score = EXCLUDED.score, last_accessed = CURRENT_TIMESTAMP;
    `,
    [lessonId, score],
  );
  console.log(`[DB] Lesson ${lessonId} saved locally (Score: ${score})`);

  // Phase 3: Background Cloud Sync
  // Assume a default "guest" user if none is globally set yet
  // In a full app, we would get this from `utils/store.ts` studentId variable
  const studentId = "student_123";

  try {
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        progress: {
          lesson_id: lessonId,
          completed: true,
          score,
          last_accessed: new Date().toISOString(),
        },
      }),
    }).then((res) => {
      if (res.ok) console.log(`[Cloud] Sync complete for ${lessonId}`);
    }).catch((_e) => console.warn("[Cloud] Sync failed (Offline mode)"));
  } catch (_e) {
    // Ignore fetch errors so local execution never fails
  }
}

/**
 * Downloads a student's history from the cloud and restores it to PGlite.
 * Used when switching computers.
 */
export async function downloadCloudBackup(studentId: string) {
  try {
    const res = await fetch(`/api/sync?studentId=${studentId}`);
    if (!res.ok) return false;

    const history = await res.json() as {
      lesson_id: string;
      completed: boolean;
      score: number;
    }[];
    const db = await getDb();

    for (const record of history) {
      await db.query(
        `
        INSERT INTO student_progress (lesson_id, completed, score) 
        VALUES ($1, $2, $3)
        ON CONFLICT (lesson_id) DO UPDATE 
        SET completed = EXCLUDED.completed, score = EXCLUDED.score;
        `,
        [record.lesson_id, record.completed, record.score],
      );
    }
    console.log(`[DB] Restored ${history.length} lessons from Cloud Backup.`);
    return true;
  } catch (e) {
    console.error(`[DB] Failed to restore from cloud backup.`, e);
    return false;
  }
}

/**
 * Retrieves the completion status for a lesson.
 */
export async function getLessonStatus(lessonId: string) {
  const db = await getDb();
  const res = await db.query(
    `SELECT completed, score FROM student_progress WHERE lesson_id = $1;`,
    [lessonId],
  );

  if (res.rows.length > 0) {
    return res.rows[0];
  }
  return null;
}
