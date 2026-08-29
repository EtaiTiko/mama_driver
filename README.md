# מערכת ניהול בית ספר לנהיגה — Driving School Management Platform

A mobile-first, Hebrew/RTL web application for a driving instructor and
their students: scheduling, availability, lesson requests, messaging,
progress tracking, and payment tracking.

This repository is being built in phases. See:
- [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) — **read this first**, every
  session. Current state, what's next.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — stack & structure.
- [`docs/DATABASE.md`](./docs/DATABASE.md) — data model.
- [`docs/FEATURES.md`](./docs/FEATURES.md) — phase-by-phase roadmap.
- [`docs/SECURITY.md`](./docs/SECURITY.md) — security commitments & checklist.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS (RTL, mobile-first)
- **Backend:** Node.js + TypeScript + Express
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT access token + HttpOnly refresh cookie, Argon2id password hashing

## Repository layout

```
/frontend   - React SPA (deployable independently)
/backend    - Express API + Prisma (deployable independently)
/docs       - architecture, database, features, security docs
```

## Getting started

This has been written but **not run** — it was authored in a sandbox with
no network access and no Postgres instance (see `PROJECT_STATUS.md`).
Treat the steps below as the intended path, not a verified one, until
someone runs them for real.

```bash
# from repo root
npm install                    # installs frontend + backend workspaces
cp .env.example .env           # fill in real values — DATABASE_URL,
                                # JWT secrets, INITIAL_ADMIN_PHONE, etc.
                                # never commit .env

# requires a running Postgres instance matching DATABASE_URL
cd backend
npx prisma migrate dev --name init   # creates tables from schema.prisma
npm run prisma:seed                  # creates the first ADMIN account
                                      # (prints a one-time password if
                                      # INITIAL_ADMIN_PASSWORD is unset)
npm run dev                          # starts the API on PORT (default 4000)
```

```bash
# in a second terminal, once the API is running
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"<the phone you seeded>","password":"<the seeded password>"}'
```

Frontend dev server (currently a placeholder page — Phase 2 builds the
real UI):

```bash
cd frontend
npm run dev     # http://localhost:5173
```

## Development workflow

At the start of every work session:
1. Read `PROJECT_STATUS.md`.
2. Read whichever `docs/*.md` file is relevant to the task at hand.
3. Inspect the current code before writing new code.
4. Continue from the last unfinished task — don't restart or rebuild
   working functionality.

At the end of every session, `PROJECT_STATUS.md` is updated with what
changed, what's next, and any new database/API/technical decisions.

## Language conventions

- All user-facing text: Hebrew, RTL layout.
- All code, identifiers, comments, and commit messages: English.
