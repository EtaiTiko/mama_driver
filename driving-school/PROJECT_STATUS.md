# Project Status

Last updated: 2026-08-29 (Phase 0 session)

## What has been completed

- **Phase 0 — Project planning: done.**
  - Technology stack decided (see `docs/ARCHITECTURE.md`):
    React + TypeScript + Vite + Tailwind (frontend), Node + TypeScript +
    Express (backend), PostgreSQL + Prisma (data), JWT + Argon2id (auth).
  - Repo skeleton created as an npm-workspaces monorepo:
    `/frontend`, `/backend`, `/docs`, root `package.json`.
  - Documentation created: `README.md`, `docs/ARCHITECTURE.md`,
    `docs/DATABASE.md` (full planned schema), `docs/FEATURES.md`
    (phase-by-phase checklist), `docs/SECURITY.md` (commitments +
    Phase 13 checklist), `docs/MASTER_SPEC.md` (the original brief,
    verbatim — the canonical source of truth; the other docs are derived
    from it and should defer to it if anything ever conflicts).
  - Minimal non-functional placeholder files scaffolded so the workspaces
    resolve (`frontend/src/main.tsx`, `App.tsx`, `index.css`,
    `backend/src/index.ts`) — these are intentionally trivial ("hello
    world"-level) and contain **no feature logic**. They exist only so
    `npm install` / `npm run dev` have something to point at once
    dependencies are installed.
  - `.env.example` created listing the environment variables the
    architecture will need.

## What is currently being worked on

Nothing — Phase 0 is complete and awaiting explicit instruction to
proceed to Phase 1 (per the master prompt's "continue only when
explicitly instructed" rule).

## What remains

Phases 1 through 16, in full, per `docs/FEATURES.md`. Nothing beyond
Phase 0 has been implemented. In particular:
- No database schema has actually been written into
  `backend/prisma/schema.prisma` yet (it's documented as a plan in
  `docs/DATABASE.md`, not yet implemented as code) — this is the first
  thing Phase 1 should do.
- No authentication code exists yet.
- No UI beyond an empty placeholder page exists yet.

## Database changes

None yet. Planned schema is fully drafted in `docs/DATABASE.md` and is
ready to be turned into `backend/prisma/schema.prisma` + an initial
migration as the first step of Phase 1.

## API endpoints created

None yet.

## Important technical decisions

1. **Separate frontend/backend (not Next.js full-stack)** — chosen to
   satisfy the "deploy frontend/backend/DB independently" requirement and
   to keep authorization logic explicit and auditable. See
   `docs/ARCHITECTURE.md` §2 for the full reasoning and the rejected
   alternatives.
2. **JWT access token (memory, not localStorage) + HttpOnly refresh
   cookie**, with refresh tokens tracked server-side (not purely
   stateless) so logout is a real operation. See `docs/SECURITY.md`.
3. **UTC storage, configurable display timezone** (`Teacher.timezone`
   field) rather than hardcoding `Asia/Jerusalem` into business logic,
   per the spec's explicit requirement.
4. **Booking race-condition defense is two-layered**: an app-level
   transactional re-check plus a planned Postgres exclusion constraint as
   a database-level backstop. Documented in `docs/DATABASE.md` under
   "Booking concurrency" — actual implementation deferred to Phase 1/3.
5. **npm workspaces monorepo** rather than two separate repos, to keep
   docs/status in one place while still producing two independently
   deployable build artifacts.

## Known bugs

None — no feature code exists yet to have bugs.

## Environment / tooling note for whoever continues this project

This Phase 0 session was run in a chat environment with **no network
access** and **no persistence between sessions** — so `npm install` was
never run here, no Postgres instance exists, and nothing has been
verified to actually build or run. Everything under `/frontend` and
`/backend` is unverified scaffolding, not tested code.

**Recommendation:** continue this project in an environment with
persistent files, git, and network access — e.g. Claude Code with a real
local (or cloned) repository — so Phase 1 can actually run
`npm install`, stand up Postgres, run Prisma migrations, and start a dev
server. Whoever continues should:
1. Unzip/copy this scaffold into a real project folder.
2. `git init` and commit this Phase 0 state as the baseline.
3. Read this file and `docs/ARCHITECTURE.md` + `docs/DATABASE.md`.
4. Begin Phase 1: implement `backend/prisma/schema.prisma` from
   `docs/DATABASE.md`, run the initial migration, then build auth.

## Next recommended action

Begin **Phase 1 — Database and Authentication**:
1. Write `backend/prisma/schema.prisma` from `docs/DATABASE.md`.
2. Run the initial Prisma migration against a real Postgres instance.
3. Implement Argon2id password hashing, login/logout, JWT + refresh
   cookie issuance, and role-based route guard middleware.
4. Implement a seed script for the first teacher/admin account that reads
   credentials from environment variables (no hardcoded password).
5. Update this file at the end of that session.
