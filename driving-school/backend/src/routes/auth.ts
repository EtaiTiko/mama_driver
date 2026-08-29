import { Router } from "express";
import rateLimit from "express-rate-limit";
import { loginSchema } from "../validation/auth.js";
import {
  loginWithPassword,
  rotateRefreshToken,
  revokeRefreshToken,
  AuthError,
} from "../services/authService.js";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../lib/env.js";

const router = Router();

const REFRESH_COOKIE_NAME = "refreshToken";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  // Scoped to /auth so this cookie is never sent on unrelated API
  // calls — only the endpoints that need it receive it.
  path: "/auth",
};

// Login attempts are rate-limited per IP in addition to the generic
// error message on failure — see docs/SECURITY.md.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { phone, password } = loginSchema.parse(req.body);
    const { accessToken, refreshToken } = await loginWithPassword(phone, password);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.json({ accessToken });
  } catch (err) {
    if (err instanceof AuthError) {
      return res.status(401).json({ error: err.code, message: err.message });
    }
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const presented = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!presented) {
      return res.status(401).json({ error: "AUTH_REQUIRED", message: "נדרשת התחברות" });
    }

    const { accessToken, refreshToken } = await rotateRefreshToken(presented);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.json({ accessToken });
  } catch (err) {
    if (err instanceof AuthError) {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ error: err.code, message: err.message });
    }
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const presented = req.cookies?.[REFRESH_COOKIE_NAME];
    if (presented) {
      await revokeRefreshToken(presented);
    }
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Example protected route: proves requireAuth + role-aware profile
// loading work end-to-end. Later phases build real dashboards on top of
// this same "verify auth, then load only what this user should see"
// pattern — see docs/SECURITY.md.
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        role: true,
        active: true,
        teacherProfile: { select: { id: true } },
        studentProfile: { select: { id: true, teacherId: true } },
      },
    });

    if (!user || !user.active) {
      return res.status(401).json({ error: "INACTIVE_USER", message: "החשבון אינו פעיל" });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
