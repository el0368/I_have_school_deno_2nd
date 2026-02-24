// ============================================================================
// Session Management
// ============================================================================

import { getKv, KV_KEYS } from "./db.ts";
import { SESSION_COOKIE, SESSION_DURATION_DAYS } from "../config/app.ts";
import type { Session } from "../types/user.ts";

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export async function createSession(
  userId: string,
  role: Session["role"],
): Promise<Session> {
  const kv = await getKv();
  const session: Session = {
    sessionId: generateSessionId(),
    userId,
    role,
    expiresAt: new Date(
      Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
    ),
  };
  await kv.set(KV_KEYS.session(session.sessionId), session, {
    expireIn: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  });
  return session;
}

export async function getSession(
  sessionId: string,
): Promise<Session | null> {
  const kv = await getKv();
  const entry = await kv.get<Session>(KV_KEYS.session(sessionId));
  return entry.value;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const kv = await getKv();
  await kv.delete(KV_KEYS.session(sessionId));
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}
