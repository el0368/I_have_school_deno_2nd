// ============================================================================
// Password Hashing (Web Crypto API — no dependencies)
// ============================================================================

const ITERATIONS = 100_000;
const KEY_LENGTH = 32;
const ALGORITHM = "SHA-256";

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: ALGORITHM },
    keyMaterial,
    KEY_LENGTH * 8,
  );
  const saltHex = [...salt].map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  const hashHex = [...new Uint8Array(derived)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, storedHash] = stored.split(":");
  const salt = Uint8Array.from(
    saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)),
  );
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: ALGORITHM },
    keyMaterial,
    KEY_LENGTH * 8,
  );
  const hashHex = [...new Uint8Array(derived)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex === storedHash;
}
