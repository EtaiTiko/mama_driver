import { prisma } from "../lib/prisma.js";
import { verifyPassword } from "../lib/password.js";
import {
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiryDate,
  type Role,
} from "../lib/jwt.js";

export class AuthError extends Error {
  constructor(
    public code: "INVALID_CREDENTIALS" | "INACTIVE_USER",
    message: string
  ) {
    super(message);
  }
}

export async function loginWithPassword(phone: string, password: string) {
  // Deliberately generic on every failure path below — see
  // docs/SECURITY.md: don't reveal whether an account exists.
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new AuthError("INVALID_CREDENTIALS", "מספר טלפון או סיסמה שגויים");
  }

  const passwordOk = await verifyPassword(user.passwordHash, password);
  if (!passwordOk) {
    throw new AuthError("INVALID_CREDENTIALS", "מספר טלפון או סיסמה שגויים");
  }

  if (!user.active) {
    throw new AuthError("INACTIVE_USER", "החשבון אינו פעיל, פנה למנהל המערכת");
  }

  return issueTokenPair(user.id, user.role as Role);
}

export async function issueTokenPair(userId: string, role: Role) {
  const accessToken = signAccessToken({ sub: userId, role });

  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: refreshTokenExpiryDate(),
    },
  });

  return { accessToken, refreshToken };
}

export async function rotateRefreshToken(presentedToken: string) {
  const tokenHash = hashRefreshToken(presentedToken);
  const existing = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    throw new AuthError("INVALID_CREDENTIALS", "יש להתחבר מחדש");
  }

  if (!existing.user.active) {
    throw new AuthError("INACTIVE_USER", "החשבון אינו פעיל, פנה למנהל המערכת");
  }

  // Rotate on every use: revoke the presented token and issue a new
  // pair. Limits the damage window if a refresh token is ever stolen —
  // a replayed old token becomes detectably invalid.
  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });

  return issueTokenPair(existing.userId, existing.user.role as Role);
}

export async function revokeRefreshToken(presentedToken: string) {
  const tokenHash = hashRefreshToken(presentedToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
