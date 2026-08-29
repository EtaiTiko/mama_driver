import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "NOT_FOUND", message: "המשאב לא נמצא" });
}

// Centralized error handler so route handlers can just throw or call
// next(err) and get a consistent JSON shape, instead of leaking stack
// traces or ad-hoc error bodies to the client.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "הנתונים שהוזנו אינם תקינים",
      details: err.flatten(),
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "INTERNAL_ERROR", message: "אירעה שגיאה, נסו שוב מאוחר יותר" });
}
