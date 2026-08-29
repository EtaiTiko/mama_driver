import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";

// Verifies the JWT access token from the Authorization header and
// attaches { userId, role } to req.auth. Does NOT check resource
// ownership — that happens per-route once Lesson/Message/Payment
// endpoints exist (Phases 3+), per docs/SECURITY.md.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "AUTH_REQUIRED", message: "נדרשת התחברות" });
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "INVALID_TOKEN", message: "החיבור פג תוקף, יש להתחבר מחדש" });
  }
}
