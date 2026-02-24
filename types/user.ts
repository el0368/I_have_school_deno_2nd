// ============================================================================
// User & Auth Types
// ============================================================================

export type Role = "student" | "admin" | "teacher";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  subscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  sessionId: string;
  userId: string;
  role: Role;
  expiresAt: Date;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthPayload {
  displayName: string;
}
