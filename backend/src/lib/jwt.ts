import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "./env.js";

export type Role = "TEACHER" | "STUDENT" | "ADMIN";

export interface AccessTokenPayload {
  sub: string; // userId
  role: Role;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    // env.JWT_ACCESS_TOKEN_TTL is validated at runtime (see env.ts) to be a
    // duration string like "15m", but @types/jsonwebtoken types `expiresIn`
    // with a narrow literal union it can't express from a plain `string`.
    expiresIn: env.JWT_ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

// Refresh tokens are opaque random strings, not JWTs — only the server
// ever needs to interpret them (via the RefreshToken table), and an
// opaque token can be revoked deterministically by its stored hash,
// which a self-describing JWT refresh token cannot without an extra
// denylist anyway.
export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiryDate(): Date {
  return new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_TOKEN_TTL));
}

// Minimal duration parser for strings like "30d", "15m", "12h" — avoids
// pulling in another dependency just for this one conversion.
function parseDurationToMs(input: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)$/.exec(input.trim());
  if (!match) {
    throw new Error(`Invalid duration string: "${input}"`);
  }
  const value = Number(match[1]);
  const unit = match[2] as "ms" | "s" | "m" | "h" | "d";
  const unitMs: Record<typeof unit, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return value * unitMs[unit];
}
