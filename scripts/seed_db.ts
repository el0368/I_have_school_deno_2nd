// ============================================================================
// DB Seed Script — populate dev environment with test data
// ============================================================================
// Usage: deno run -A scripts/seed_db.ts

import { getKv, KV_KEYS } from "../lib/db.ts";
import { hashPassword } from "../lib/hash.ts";
import type { UserRecord } from "../db/schema.ts";

const kv = await getKv();

const adminUser: UserRecord = {
  id: crypto.randomUUID(),
  email: "admin@test.com",
  passwordHash: await hashPassword("admin1234"),
  displayName: "Admin",
  role: "admin",
  subscriptionId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const studentUser: UserRecord = {
  id: crypto.randomUUID(),
  email: "student@test.com",
  passwordHash: await hashPassword("student1234"),
  displayName: "Test Student",
  role: "student",
  subscriptionId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

await kv.set(KV_KEYS.user(adminUser.id), adminUser);
await kv.set(KV_KEYS.userByEmail(adminUser.email), adminUser.id);
await kv.set(KV_KEYS.user(studentUser.id), studentUser);
await kv.set(KV_KEYS.userByEmail(studentUser.email), studentUser.id);

console.log("✅ Seeded: admin@test.com / admin1234");
console.log("✅ Seeded: student@test.com / student1234");

kv.close();
