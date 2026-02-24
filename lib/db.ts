// ============================================================================
// Server-Side Database Client (Deno KV)
// ============================================================================
// Uses Deno's built-in KV store for user data, sessions, and subscriptions.
// The client-side PGlite (utils/db.ts) handles student progress locally.

let kv: Deno.Kv | null = null;

export async function getKv(): Promise<Deno.Kv> {
  if (!kv) {
    kv = await Deno.openKv();
  }
  return kv;
}

// Key namespaces
export const KV_KEYS = {
  user: (id: string) => ["users", id] as const,
  userByEmail: (email: string) => ["users_by_email", email] as const,
  session: (sessionId: string) => ["sessions", sessionId] as const,
  subscription: (userId: string) => ["subscriptions", userId] as const,
};
