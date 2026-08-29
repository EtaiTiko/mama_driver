import argon2 from "argon2";

// Argon2id per docs/SECURITY.md. Parameters are a reasonable default for
// a small single-server deployment — revisit if the hosting target
// changes (e.g. a memory-constrained serverless environment).
const HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456, // ~19 MB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plainPassword: string): Promise<string> {
  return argon2.hash(plainPassword, HASH_OPTIONS);
}

export async function verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    // A malformed/unexpected hash should never crash the request —
    // treat it as "does not match" rather than surfacing a 500.
    return false;
  }
}
