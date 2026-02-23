import { useState } from "preact/hooks";
import { downloadCloudBackup } from "../utils/db.ts";

export default function LoginSync() {
  const [studentId, setStudentId] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");

  const handleSync = async (e: Event) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setIsSyncing(true);
    setError("");

    // 1. Save ID to local storage so standard Islands know who is logged in
    localStorage.setItem("sovereign_student_id", studentId);

    // 2. Reach out to Deno KV and pull down the history
    const success = await downloadCloudBackup(studentId);

    if (success) {
      // 3. Redirect to the curriculum dashboard!
      globalThis.location.href = "/curriculum/math";
    } else {
      setError("Failed to sync progress. Are you connected to the internet?");
      setIsSyncing(false);
    }
  };

  return (
    <form class="flex flex-col gap-4" onSubmit={handleSync}>
      {error && (
        <div class="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        value={studentId}
        onInput={(e) => setStudentId((e.target as HTMLInputElement).value)}
        placeholder="Enter Student ID (e.g. student_123)"
        class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-800"
        required
        disabled={isSyncing}
      />

      <button
        class="btn-primary py-3 text-lg flex justify-center items-center"
        type="submit"
        disabled={isSyncing}
      >
        {isSyncing ? "Syncing Progress..." : "Sync My Progress"}
      </button>
    </form>
  );
}
