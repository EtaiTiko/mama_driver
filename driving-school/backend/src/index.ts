import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Intentionally minimal Phase 0 placeholder: no routes, no Prisma client,
// no auth yet. See PROJECT_STATUS.md — Phase 1 adds the database
// connection, auth routes, and role-guard middleware described in
// docs/ARCHITECTURE.md and docs/SECURITY.md.

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", phase: "0 - scaffolding only" });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port} (Phase 0 scaffold)`);
});
