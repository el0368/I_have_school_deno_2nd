// ============================================================================
// Database Schema — Single Source of Truth
// ============================================================================
// This defines the shape of all Deno KV records.
// When switching to a real SQL DB, these become your table definitions.

/**
 * KV Path: ["users", userId]
 */
export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: "student" | "admin" | "teacher";
  subscriptionId: string | null;
  createdAt: string; // ISO string
  updatedAt: string;
}

/**
 * KV Path: ["users_by_email", email] -> userId (string)
 */

/**
 * KV Path: ["sessions", sessionId]
 */
export interface SessionRecord {
  sessionId: string;
  userId: string;
  role: "student" | "admin" | "teacher";
  expiresAt: string; // ISO string
}

/**
 * KV Path: ["subscriptions", userId]
 */
export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: "free" | "pro" | "phd";
  status: "active" | "canceled" | "past_due" | "trialing" | "unpaid";
  currentPeriodEnd: string; // ISO string
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}
