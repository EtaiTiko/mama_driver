import type { Request, Response, NextFunction } from "express";
import type { Role } from "../lib/jwt.js";

// Use AFTER requireAuth. This only checks role — resource ownership
// (e.g. "is this lesson actually this student's own lesson") must still
// be checked inside each route handler once Lesson/Message/Payment
// routes are built in later phases. A role check alone is not
// sufficient authorization for per-resource endpoints; see
// docs/SECURITY.md.
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ error: "AUTH_REQUIRED", message: "נדרשת התחברות" });
    }
    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ error: "FORBIDDEN", message: "אין הרשאה לבצע פעולה זו" });
    }
    next();
  };
}
